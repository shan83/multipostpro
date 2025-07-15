import { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../types/database';

type SocialAccount = Database['public']['Tables']['social_accounts']['Row'];
type PlatformConfig = Database['public']['Tables']['platform_configs']['Row'];

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  socialAccounts?: SocialAccount[];
  platformConfigs?: PlatformConfig[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  connectPlatform: (platform: string) => Promise<void>;
  disconnectPlatform: (platform: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) throw profileError;

      // Fetch social accounts
      const { data: socialAccounts, error: socialError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', supabaseUser.id);

      if (socialError) throw socialError;

      // Fetch platform configs
      const { data: platformConfigs, error: configError } = await supabase
        .from('platform_configs')
        .select('*')
        .eq('user_id', supabaseUser.id);

      if (configError) throw configError;

      setUser({
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        socialAccounts: socialAccounts || [],
        platformConfigs: platformConfigs || [],
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Platform OAuth URLs - In production, these would be your actual OAuth endpoints
  const getOAuthUrl = (platform: string) => {
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/auth/callback/${platform}`;
    
    switch (platform) {
      case 'youtube':
        return `https://accounts.google.com/oauth/authorize?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${redirectUri}&scope=https://www.googleapis.com/auth/youtube&response_type=code&access_type=offline`;
      case 'facebook':
        return `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_FACEBOOK_APP_ID&redirect_uri=${redirectUri}&scope=pages_manage_posts,pages_read_engagement&response_type=code`;
      case 'instagram':
        return `https://api.instagram.com/oauth/authorize?client_id=YOUR_INSTAGRAM_CLIENT_ID&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
      case 'twitter':
        return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=YOUR_TWITTER_CLIENT_ID&redirect_uri=${redirectUri}&scope=tweet.read%20tweet.write%20users.read&state=state`;
      case 'tiktok':
        return `https://www.tiktok.com/auth/authorize/?client_key=YOUR_TIKTOK_CLIENT_KEY&response_type=code&scope=user.info.basic,video.list&redirect_uri=${redirectUri}`;
      case 'linkedin':
        return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=${redirectUri}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
      default:
        return '';
    }
  };

  const connectPlatform = async (platform: string) => {
    if (!user) return;
    
    try {
      // For demo purposes, we'll simulate a successful connection
      // In production, this would initiate the OAuth flow
      
      // Check if platform is already connected
      const existingAccount = user.socialAccounts?.find(account => account.platform === platform);
      if (existingAccount) {
        alert('Platform already connected!');
        return;
      }

      // Simulate OAuth flow - in production, redirect to OAuth URL
      const shouldConnect = window.confirm(
        `This will redirect you to ${platform} to authorize the connection. Continue?`
      );
      
      if (!shouldConnect) return;

      // For demo, we'll create a mock social account
      const mockAccountData = {
        user_id: user.id,
        platform: platform,
        platform_user_id: `mock_${platform}_${Date.now()}`,
        username: `user_${platform}`,
        display_name: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        follower_count: Math.floor(Math.random() * 10000) + 1000,
        is_business_account: platform === 'instagram' ? Math.random() > 0.5 : false,
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        token_expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        scopes: ['basic_info', 'publish_content'],
      };

      const { error } = await supabase
        .from('social_accounts')
        .insert([mockAccountData]);

      if (error) {
        console.error('Error connecting platform:', error);
        alert('Failed to connect platform. Please try again.');
        return;
      }

      // Create default platform config
      const defaultConfig = {
        user_id: user.id,
        platform: platform,
        default_post_format: 'optimized',
        optimal_posting_times: ['09:00', '12:00', '17:00'],
        hashtag_strategy: 'platform_optimized',
        image_quality: 'high',
        auto_publish: false,
        settings: {
          auto_hashtags: true,
          cross_post: true,
          analytics_tracking: true,
        },
      };

      await supabase
        .from('platform_configs')
        .insert([defaultConfig]);

      // Refresh user data
      await refreshUserData();
      
      alert(`Successfully connected to ${platform}!`);
      
    } catch (error) {
      console.error('Error connecting platform:', error);
      alert('Failed to connect platform. Please try again.');
    }
  };

  const disconnectPlatform = async (platform: string) => {
    if (!user) return;
    
    try {
      const shouldDisconnect = window.confirm(
        `Are you sure you want to disconnect from ${platform}? This will remove all associated data.`
      );
      
      if (!shouldDisconnect) return;

      // Delete social account
      const { error: accountError } = await supabase
        .from('social_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform);

      if (accountError) {
        console.error('Error disconnecting platform:', accountError);
        alert('Failed to disconnect platform. Please try again.');
        return;
      }

      // Delete platform config
      await supabase
        .from('platform_configs')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform);

      // Refresh user data
      await refreshUserData();
      
      alert(`Successfully disconnected from ${platform}!`);
      
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      alert('Failed to disconnect platform. Please try again.');
    }
  };

  // In production, you would handle the OAuth callback here
  const handleOAuthCallback = async (platform: string, code: string) => {
    try {
      // Exchange code for access token
      // This would be done on your backend for security
      const response = await fetch('/api/oauth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, code }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await refreshUserData();
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
    }
  };

  // Helper function to check if a platform is connected
  const isPlatformConnected = (platform: string) => {
    return user?.socialAccounts?.some(account => account.platform === platform) || false;
  };

  // Helper function to get platform account info
  const getPlatformAccount = (platform: string) => {
    return user?.socialAccounts?.find(account => account.platform === platform);
  };
    
  // Add these helper functions to the context value
  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    connectPlatform,
    disconnectPlatform,
    refreshUserData,
    isPlatformConnected,
    getPlatformAccount,
    handleOAuthCallback,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};