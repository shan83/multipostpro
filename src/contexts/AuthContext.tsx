import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type SocialAccount = {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id?: string;
  username?: string;
  display_name?: string;
  follower_count?: number;
  is_business_account?: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  scopes?: string[];
  created_at: string;
  updated_at: string;
};

type PlatformConfig = {
  id: string;
  user_id: string;
  platform: string;
  default_post_format: string;
  optimal_posting_times: string[];
  hashtag_strategy: string;
  image_quality: string;
  auto_publish: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  socialAccounts?: SocialAccount[];
  platformConfigs?: PlatformConfig[];
  connectedPlatforms?: Record<string, boolean>;
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
  const [loading, setLoading] = useState(true);

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

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Fetch social accounts
      const { data: socialAccounts, error: socialError } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', supabaseUser.id);

      if (socialError) {
        console.error('Error fetching social accounts:', socialError);
      }

      // Fetch platform configs
      const { data: platformConfigs, error: configError } = await supabase
        .from('platform_configs')
        .select('*')
        .eq('user_id', supabaseUser.id);

      if (configError) {
        console.error('Error fetching platform configs:', configError);
      }

      // Create connected platforms map
      const connectedPlatforms: Record<string, boolean> = {};
      socialAccounts?.forEach(account => {
        connectedPlatforms[account.platform] = true;
      });

      setUser({
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        socialAccounts: socialAccounts || [],
        platformConfigs: platformConfigs || [],
        connectedPlatforms,
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

  const connectPlatform = async (platform: string) => {
    if (!user) return;
    
    try {
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