import { createContext, useState, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, SocialAccount, PlatformConfig } from '../types/database';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile: Profile;
  socialAccounts: SocialAccount[];
  platformConfigs: PlatformConfig[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  connectPlatform: (platform: string) => Promise<void>;
  disconnectPlatform: (platform: string) => Promise<void>;
  updatePlatformConfig: (platform: string, config: Partial<PlatformConfig>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (userId: string) => {
    const [profileResponse, socialAccountsResponse, platformConfigsResponse] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('social_accounts').select('*').eq('user_id', userId),
      supabase.from('platform_configs').select('*').eq('user_id', userId),
    ]);

    if (profileResponse.error) throw profileResponse.error;
    if (socialAccountsResponse.error) throw socialAccountsResponse.error;
    if (platformConfigsResponse.error) throw platformConfigsResponse.error;

    return {
      profile: profileResponse.data,
      socialAccounts: socialAccountsResponse.data,
      platformConfigs: platformConfigsResponse.data,
    };
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('No user returned from login');

      const userData = await fetchUserData(user.id);
      
      setUser({
        id: user.id,
        name: userData.profile.name || '',
        email: user.email || '',
        avatar: userData.profile.avatar_url || undefined,
        profile: userData.profile,
        socialAccounts: userData.socialAccounts,
        platformConfigs: userData.platformConfigs,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      if (!user) throw new Error('No user returned from registration');

      const userData = await fetchUserData(user.id);
      
      setUser({
        id: user.id,
        name: userData.profile.name || '',
        email: user.email || '',
        avatar: userData.profile.avatar_url || undefined,
        profile: userData.profile,
        socialAccounts: userData.socialAccounts,
        platformConfigs: userData.platformConfigs,
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const connectPlatform = async (platform: string) => {
    // This would be replaced with actual OAuth flow
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .insert([
          {
            user_id: user?.id,
            platform,
            platform_username: `demo_${platform}`,
            platform_display_name: `Demo ${platform} Account`,
            follower_count: 1000,
            business_account: platform === 'instagram',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setUser(prev => prev ? {
        ...prev,
        socialAccounts: [...prev.socialAccounts, data],
      } : null);
    } catch (error) {
      console.error('Platform connection failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectPlatform = async (platform: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform);

      if (error) throw error;

      setUser(prev => prev ? {
        ...prev,
        socialAccounts: prev.socialAccounts.filter(account => account.platform !== platform),
      } : null);
    } catch (error) {
      console.error('Platform disconnection failed:', error);
      throw error;
    }
  };

  const updatePlatformConfig = async (platform: string, config: Partial<PlatformConfig>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('platform_configs')
        .upsert({
          user_id: user.id,
          platform,
          ...config,
        })
        .select()
        .single();

      if (error) throw error;

      setUser(prev => prev ? {
        ...prev,
        platformConfigs: [
          ...prev.platformConfigs.filter(pc => pc.platform !== platform),
          data,
        ],
      } : null);
    } catch (error) {
      console.error('Platform config update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        connectPlatform,
        disconnectPlatform,
        updatePlatformConfig,
      }}
    >
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