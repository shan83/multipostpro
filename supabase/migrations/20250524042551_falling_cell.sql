/*
  # Add platform-specific attributes

  1. Changes
    - Add platform-specific fields to social_accounts table
    - Add platform-specific metrics to post_platforms table
    - Add platform configuration table for default settings

  2. New Tables
    - platform_configs: Stores platform-specific posting preferences
*/

-- Add platform-specific fields to social_accounts
ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS platform_username text,
ADD COLUMN IF NOT EXISTS platform_display_name text,
ADD COLUMN IF NOT EXISTS follower_count bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS page_id text, -- For Facebook pages
ADD COLUMN IF NOT EXISTS business_account boolean DEFAULT false, -- For Instagram
ADD COLUMN IF NOT EXISTS channel_id text, -- For YouTube
ADD COLUMN IF NOT EXISTS profile_url text,
ADD COLUMN IF NOT EXISTS scope text[]; -- OAuth scopes granted

-- Add metrics to post_platforms
ALTER TABLE post_platforms
ADD COLUMN IF NOT EXISTS engagement_metrics jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS platform_specific_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS error_message text,
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_retry_at timestamptz;

-- Create platform configuration table
CREATE TABLE IF NOT EXISTS platform_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  default_post_format text DEFAULT 'auto', -- auto, image, video, text
  optimal_posting_times time[] DEFAULT ARRAY[]::time[],
  hashtag_strategy text DEFAULT 'platform_optimized',
  auto_schedule boolean DEFAULT false,
  image_quality text DEFAULT 'high',
  video_quality text DEFAULT 'high',
  custom_settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS on new table
ALTER TABLE platform_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for platform_configs
CREATE POLICY "Users can view own platform configs"
  ON platform_configs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own platform configs"
  ON platform_configs FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_post_platforms_status ON post_platforms(status);
CREATE INDEX IF NOT EXISTS idx_platform_configs_platform ON platform_configs(platform);