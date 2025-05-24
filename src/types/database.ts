export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SocialAccount = {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id: string | null;
  platform_username: string | null;
  platform_display_name: string | null;
  follower_count: number;
  page_id: string | null;
  business_account: boolean;
  channel_id: string | null;
  profile_url: string | null;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  scope: string[];
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostPlatform = {
  id: string;
  post_id: string;
  platform: string;
  platform_post_id: string | null;
  status: 'pending' | 'published' | 'failed';
  published_at: string | null;
  engagement_metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
    reach?: number;
    [key: string]: number | undefined;
  };
  platform_specific_data: Record<string, any>;
  error_message: string | null;
  retry_count: number;
  last_retry_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Media = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  url: string;
  thumbnail_url: string | null;
  size: number;
  created_at: string;
  updated_at: string;
};

export type PlatformConfig = {
  id: string;
  user_id: string;
  platform: string;
  default_post_format: 'auto' | 'image' | 'video' | 'text';
  optimal_posting_times: string[];
  hashtag_strategy: string;
  auto_schedule: boolean;
  image_quality: 'high' | 'medium' | 'low';
  video_quality: 'high' | 'medium' | 'low';
  custom_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
};