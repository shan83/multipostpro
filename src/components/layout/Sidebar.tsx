import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PenSquare, 
  Calendar, 
  BarChart2, 
  Image, 
  Settings, 
  X,
  Youtube, 
  Facebook, 
  Instagram, 
  Twitter 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Content', href: '/create', icon: PenSquare },
    { name: 'Content Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Media Library', href: '/media', icon: Image },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const platformIcons = {
    youtube: Youtube,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
  };

  const connectedPlatforms = user?.connectedPlatforms || {};

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <SidebarContent navigation={navigation} location={location} connectedPlatforms={connectedPlatforms} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <SidebarContent navigation={navigation} location={location} connectedPlatforms={connectedPlatforms} />
        </div>
      </div>
    </>
  );
};

interface SidebarContentProps {
  navigation: { name: string; href: string; icon: React.FC<any> }[];
  location: { pathname: string };
  connectedPlatforms: Record<string, boolean | undefined>;
}

const SidebarContent = ({ navigation, location, connectedPlatforms }: SidebarContentProps) => {
  const platformIcons: Record<string, React.FC<any>> = {
    youtube: Youtube,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
  };

  return (
    <>
      <div className="flex flex-shrink-0 items-center px-4 py-3">
        <Link to="/" className="flex items-center">
          <svg
            className="h-8 w-8 text-blue-700 dark:text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 6 12 12 18 18 12 12 6" fill="currentColor" stroke="none" />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SocialSync</span>
        </Link>
      </div>
      <div className="mt-5 flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Connected Platforms
            </h3>
            <div className="mt-2 flex flex-wrap gap-2 px-2">
              {Object.entries(connectedPlatforms).map(([platform, isConnected]) => {
                if (!isConnected) return null;
                
                const Icon = platformIcons[platform as keyof typeof platformIcons];
                if (!Icon) return null;
                
                return (
                  <div 
                    key={platform} 
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700"
                    title={`Connected to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                  >
                    <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                );
              })}
              
              {Object.values(connectedPlatforms).filter(Boolean).length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                  No platforms connected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;