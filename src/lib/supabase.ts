import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log configuration status (only in development)
if (import.meta.env.DEV) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase environment variables are not set. Please check your .env file.');
    console.warn('Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  } else {
    console.log('✅ Supabase configuration loaded successfully');
  }
}

// Create a fallback client if environment variables are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);