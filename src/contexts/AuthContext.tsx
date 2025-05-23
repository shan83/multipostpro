import { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  connectedPlatforms: {
    youtube?: boolean;
    facebook?: boolean;
    instagram?: boolean;
    twitter?: boolean;
    tiktok?: boolean;
  };
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock functions for authentication - would be replaced with real API calls
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock user data - in a real app, this would come from an API
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        avatar: 'https://i.pravatar.cc/150?u=demo',
        connectedPlatforms: {
          youtube: true,
          facebook: true,
          instagram: false,
          twitter: true,
          tiktok: false,
        },
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock registration - in a real app, this would be an API call
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        connectedPlatforms: {},
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const connectPlatform = async (platform: string) => {
    if (!user) return;
    
    // In a real app, this would initiate OAuth flow with the platform
    setUser({
      ...user,
      connectedPlatforms: {
        ...user.connectedPlatforms,
        [platform]: true,
      },
    });
  };

  const disconnectPlatform = async (platform: string) => {
    if (!user) return;
    
    const updatedPlatforms = { ...user.connectedPlatforms };
    updatedPlatforms[platform as keyof typeof updatedPlatforms] = false;
    
    setUser({
      ...user,
      connectedPlatforms: updatedPlatforms,
    });
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