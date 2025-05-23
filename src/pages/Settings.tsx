import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Users,
  HelpCircle,
  Check,
  X,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  AlertCircle,
  Trash,
  Save,
  Moon,
  Sun
} from 'lucide-react';

const Settings = () => {
  const { user, connectPlatform, disconnectPlatform } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'security', name: 'Security & Privacy', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'platforms', name: 'Connected Platforms', icon: Globe },
    { id: 'team', name: 'Team Members', icon: Users },
    { id: 'billing', name: 'Billing', icon: Shield },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  const platforms = [
    { 
      key: 'youtube', 
      name: 'YouTube', 
      icon: Youtube, 
      color: 'text-red-600', 
      description: 'Connect your YouTube channel to publish videos directly and retrieve analytics.' 
    },
    { 
      key: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'text-blue-600', 
      description: 'Link your Facebook page to post updates, images, and retrieve engagement metrics.' 
    },
    { 
      key: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'text-pink-600', 
      description: 'Connect your Instagram business account to post images and videos.' 
    },
    { 
      key: 'twitter', 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'text-blue-400', 
      description: 'Link your Twitter account to post tweets and engage with your audience.' 
    },
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your account details and profile picture
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-1 bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    placeholder="Your company"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="role"
                    placeholder="Your role"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Write a short bio about yourself"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize the look and feel of your interface
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
              ) : (
                <Sun className="h-5 w-5 text-amber-500 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme Setting</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === 'dark' ? 'Currently using dark mode' : 'Currently using light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none"
              style={{ backgroundColor: theme === 'dark' ? '#4f46e5' : '#d1d5db' }}
            >
              <span
                className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Danger Zone</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Permanently delete your account and all of your content
          </p>
        </div>
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Delete Account</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    Once you delete your account, there is no going back. All of your content and data will be permanently removed.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Social Media Platforms</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect your social media accounts to publish content directly
          </p>
        </div>
        <div className="p-6 space-y-6">
          {platforms.map((platform) => {
            const isConnected = user?.connectedPlatforms?.[platform.key as keyof typeof user.connectedPlatforms];
            
            return (
              <div key={platform.key} className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700 last:pb-0 last:border-b-0">
                <div className="flex items-start">
                  <platform.icon className={`h-8 w-8 ${platform.color} mt-1 mr-4 flex-shrink-0`} />
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{platform.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{platform.description}</p>
                    <div className="mt-2 flex items-center">
                      {isConnected ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <X className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Not connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  {isConnected ? (
                    <button
                      onClick={() => disconnectPlatform(platform.key)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => connectPlatform(platform.key)}
                      className={`px-4 py-2 bg-${platform.key === 'youtube' ? 'red' : platform.key === 'facebook' ? 'blue' : platform.key === 'instagram' ? 'pink' : 'blue'}-600 text-white rounded-md hover:bg-${platform.key === 'youtube' ? 'red' : platform.key === 'facebook' ? 'blue' : platform.key === 'instagram' ? 'pink' : 'blue'}-700 transition-colors`}
                      style={{ 
                        backgroundColor: platform.key === 'youtube' ? '#dc2626' : 
                                        platform.key === 'facebook' ? '#2563eb' : 
                                        platform.key === 'instagram' ? '#db2777' : 
                                        '#38bdf8',
                        color: 'white'
                      }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Default Posting Settings</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure your default posting preferences for each platform
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Post Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Optimize for each platform</option>
                <option>Same content for all platforms</option>
                <option>Custom per platform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Scheduling Time
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Optimal time per platform</option>
                <option>Same time for all platforms</option>
                <option>Custom per platform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Image Quality
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>High (original)</option>
                <option>Medium (optimized)</option>
                <option>Low (faster uploading)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hashtag Strategy
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option>Optimized per platform</option>
                <option>Same hashtags for all platforms</option>
                <option>No hashtags</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'platforms':
        return renderPlatformSettings();
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This settings section is under development and will be available soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 dark:border-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="md:col-span-3">
          {renderContent()}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-medium">Confirm Account Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="mt-4">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    I understand that this action is permanent and cannot be reversed
                  </span>
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;