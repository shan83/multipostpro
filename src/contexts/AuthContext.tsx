import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateAuthUrl, generateState, isPlatformConfigured } from '../lib/oauth';
import { OAuthService } from '../services/oauthService';
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
  refreshPlatformToken: (platform: string) => Promise<boolean>;
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
    console.log('🔍 fetchUserProfile called for:', supabaseUser.email);
    try {
      // Fetch user profile
      let profile = null;
      let profileError = null;
      
      try {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        profile = result.data;
        profileError = result.error;
      } catch (dbError) {
        console.error('Database query failed:', dbError);
        profileError = dbError;
      }

      // If profile doesn't exist, try to create it
      if (profileError && (profileError as any).code === 'PGRST116') {
        try {
          await supabase
            .from('profiles')
            .insert([
              {
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.name || '',
                avatar_url: supabaseUser.user_metadata?.avatar_url,
              }
            ]);
        } catch (createError) {
          console.error('Failed to create profile:', createError);
        }
      }

      // Fetch social accounts (with error handling)
      let socialAccounts = [];
      try {
        const { data, error: socialError } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', supabaseUser.id);
        
        if (socialError) {
          console.error('Error fetching social accounts:', socialError);
        } else {
          socialAccounts = data || [];
        }
      } catch (error) {
        console.error('Social accounts query failed:', error);
      }

      // Fetch platform configs (with error handling)
      let platformConfigs = [];
      try {
        const { data, error: configError } = await supabase
          .from('platform_configs')
          .select('*')
          .eq('user_id', supabaseUser.id);

        if (configError) {
          console.error('Error fetching platform configs:', configError);
        } else {
          platformConfigs = data || [];
        }
      } catch (error) {
        console.error('Platform configs query failed:', error);
      }

      // Create connected platforms map
      const connectedPlatforms: Record<string, boolean> = {};
      socialAccounts?.forEach(account => {
        connectedPlatforms[account.platform] = true;
      });

      // Always create user object, even if some queries failed
      const userObj = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || '',
        email: supabaseUser.email || '',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
        socialAccounts: socialAccounts || [],
        platformConfigs: platformConfigs || [],
        connectedPlatforms,
      };
      
      console.log('✅ Setting user state:', { email: userObj.email, name: userObj.name });
      setUser(userObj);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Create a basic user object even if everything fails
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        email: supabaseUser.email || '',
        avatar: supabaseUser.user_metadata?.avatar_url,
        socialAccounts: [],
        platformConfigs: [],
        connectedPlatforms: {},
      });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // If login is successful, immediately fetch user profile to ensure state is updated
      if (data.user) {
        await fetchUserProfile(data.user);
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
    console.log('🔗 Attempting to connect platform:', platform);
    
    if (!user) {
      console.error('🔗 No user found');
      alert('Please log in first to connect platforms.');
      return;
    }
    
    try {
      // Check if platform is already connected
      const existingAccount = user.socialAccounts?.find(account => account.platform === platform);
      if (existingAccount) {
        console.log('🔗 Platform already connected:', platform);
        alert('Platform already connected!');
        return;
      }

      // Check if OAuth is configured for this platform
      if (!isPlatformConfigured(platform)) {
        console.warn(`🔗 OAuth not configured for ${platform}, using demo mode...`);
        
        // Fallback to demo mode if OAuth not configured
        const shouldConnect = window.confirm(
          `OAuth not configured for ${platform}. Create a demo connection instead?`
        );
        
        if (!shouldConnect) {
          console.log('🔗 User cancelled demo connection');
          return;
        }

        // Create demo connection (existing logic)
        const mockAccount = {
          id: `demo_${platform}_${Date.now()}`,
          user_id: user.id,
          platform: platform,
          platform_user_id: `demo_${platform}_${Date.now()}`,
          username: `demo_${platform}`,
          display_name: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
          follower_count: Math.floor(Math.random() * 10000) + 1000,
          is_business_account: platform === 'instagram' ? Math.random() > 0.5 : false,
          access_token: 'demo_access_token',
          refresh_token: 'demo_refresh_token',
          token_expires_at: new Date(Date.now() + 3600000).toISOString(),
          scopes: ['basic_info', 'publish_content'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Update user state directly (demo mode)
        const updatedUser = {
          ...user,
          socialAccounts: [...(user.socialAccounts || []), mockAccount],
          connectedPlatforms: {
            ...user.connectedPlatforms,
            [platform]: true,
          },
        };
        
        setUser(updatedUser);
        alert(`Demo connection created for ${platform}! Configure OAuth for real connections.`);
        return;
      }

      // Generate OAuth authorization URL
      console.log('🔗 Generating OAuth authorization URL...');
      const state = generateState(platform, user.id);
      const authUrl = generateAuthUrl(platform, state);
      
      console.log('🔗 Redirecting to OAuth authorization...', authUrl);
      
      // Store the state in sessionStorage for validation
      sessionStorage.setItem(`oauth_state_${platform}`, state);
      
      // Redirect to OAuth authorization page
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('🔗 Connection error:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Failed to connect to ${platform}: ${errorMessage}`);
    }
  };

  const refreshPlatformToken = async (platform: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Find the social account for this platform
      const socialAccount = user.socialAccounts?.find(account => account.platform === platform);
      if (!socialAccount) {
        console.error(`No social account found for platform: ${platform}`);
        return false;
      }

      // Check if refresh token exists
      if (!socialAccount.refresh_token) {
        console.error(`No refresh token available for platform: ${platform}`);
        return false;
      }

      // Check if token needs refreshing
      if (!socialAccount.token_expires_at || !OAuthService.isTokenExpired(socialAccount.token_expires_at)) {
        console.log(`Token for ${platform} is still valid`);
        return true;
      }

      console.log(`Refreshing token for platform: ${platform}`);
      
      // Refresh the token using OAuth service
      const tokenResponse = await OAuthService.refreshToken(platform, socialAccount.refresh_token);
      
      if (!tokenResponse.access_token) {
        throw new Error('Failed to refresh token - no access token received');
      }

      // Calculate new expiration date
      const newExpiresAt = tokenResponse.expires_in 
        ? OAuthService.calculateExpirationDate(tokenResponse.expires_in)
        : new Date(Date.now() + 3600000).toISOString(); // Default 1 hour

      // Update the token in database
      const { error } = await supabase
        .from('social_accounts')
        .update({
          access_token: tokenResponse.access_token,
          refresh_token: tokenResponse.refresh_token || socialAccount.refresh_token,
          token_expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', socialAccount.id);

      if (error) {
        console.error('Failed to update token in database:', error);
        return false;
      }

      // Refresh user data to get updated tokens
      await refreshUserData();
      
      console.log(`Successfully refreshed token for ${platform}`);
      return true;
      
    } catch (error) {
      console.error(`Error refreshing token for ${platform}:`, error);
      return false;
    }
  };

  const disconnectPlatform = async (platform: string) => {
    if (!user) return;
    
    try {
      const shouldDisconnect = window.confirm(
        `Are you sure you want to disconnect from ${platform}? This will remove all associated data.`
      );
      
      if (!shouldDisconnect) return;

      // Find the social account to get the access token
      const socialAccount = user.socialAccounts?.find(account => account.platform === platform);
      
      // Revoke the access token if available
      if (socialAccount?.access_token) {
        try {
          await OAuthService.revokeToken(platform, socialAccount.access_token);
          console.log(`Successfully revoked token for ${platform}`);
        } catch (revokeError) {
          console.warn(`Failed to revoke token for ${platform}:`, revokeError);
          // Continue with disconnection even if token revocation fails
        }
      }

      // Delete social account from database
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
    refreshPlatformToken,
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