import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, BarChart2, Calendar, Activity, Zap, Share2, Plus, Check, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, connectPlatform, disconnectPlatform } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for dashboard
  const recentPosts = [
    { id: 1, title: 'Summer Sale Announcement', platforms: ['instagram', 'facebook'], status: 'published', date: '2025-06-01', engagement: 1245 },
    { id: 2, title: 'New Product Launch Video', platforms: ['youtube', 'facebook', 'instagram'], status: 'scheduled', date: '2025-06-05', engagement: 0 },
    { id: 3, title: 'Customer Testimonial', platforms: ['twitter', 'facebook'], status: 'draft', date: '', engagement: 0 },
  ];

  const stats = [
    { name: 'Total Posts', value: '24', icon: Activity, change: '+12%', changeType: 'increase' },
    { name: 'Total Engagement', value: '8,492', icon: Zap, change: '+18%', changeType: 'increase' },
    { name: 'Scheduled Posts', value: '7', icon: Calendar, change: '-3', changeType: 'decrease' },
    { name: 'Cross-Platform Shares', value: '16', icon: Share2, change: '+6', changeType: 'increase' },
  ];

  const platformPerformance = [
    { name: 'Instagram', followers: 3240, engagement: 1872, growth: '+5.2%' },
    { name: 'Facebook', followers: 5650, engagement: 983, growth: '+2.1%' },
    { name: 'Twitter', followers: 2180, engagement: 1342, growth: '+8.7%' },
    { name: 'YouTube', followers: 1205, engagement: 4520, growth: '+12.3%' },
  ];

  const availablePlatforms = [
    { 
      key: 'youtube', 
      name: 'YouTube', 
      description: 'Upload videos and reach millions of viewers',
      color: 'bg-red-600',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
      bgDark: 'bg-red-900/20',
      icon: '📺'
    },
    { 
      key: 'facebook', 
      name: 'Facebook', 
      description: 'Share posts, images, and videos with your audience',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      icon: '📘'
    },
    { 
      key: 'instagram', 
      name: 'Instagram', 
      description: 'Post photos, stories, and reels',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-pink-600',
      bgLight: 'bg-pink-50',
      bgDark: 'bg-pink-900/20',
      icon: '📷'
    },
    { 
      key: 'twitter', 
      name: 'Twitter', 
      description: 'Share thoughts and engage in conversations',
      color: 'bg-blue-400',
      textColor: 'text-blue-400',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      icon: '🐦'
    },
    { 
      key: 'tiktok', 
      name: 'TikTok', 
      description: 'Create short-form videos and go viral',
      color: 'bg-black',
      textColor: 'text-gray-900',
      bgLight: 'bg-gray-50',
      bgDark: 'bg-gray-900/20',
      icon: '🎵'
    },
    { 
      key: 'linkedin', 
      name: 'LinkedIn', 
      description: 'Share professional content and network',
      color: 'bg-blue-700',
      textColor: 'text-blue-700',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      icon: '💼'
    }
  ];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Scheduled
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">
            In
          </span>
        );
      case 'facebook':
        return <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">Fb</span>;
      case 'twitter':
        return <span className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs">Tw</span>;
      case 'youtube':
        return <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">Yt</span>;
      case 'tiktok':
        return <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-xs">Tk</span>;
      default:
        return null;
    }
  };

  const handleConnectPlatform = async (platformKey: string) => {
    setIsLoading(true);
    try {
      await connectPlatform(platformKey);
    } catch (error) {
      console.error('Failed to connect platform:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectPlatform = async (platformKey: string) => {
    setIsLoading(true);
    try {
      await disconnectPlatform(platformKey);
    } catch (error) {
      console.error('Failed to disconnect platform:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <Link
          to="/create"
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PenSquare className="w-4 h-4 mr-2" />
          Create New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900">
                <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'increase'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Connections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Connected Platforms</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your social media accounts to start publishing content
            </p>
          </div>
          <Link 
            to="/settings" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            Manage all <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map((platform) => {
              const isConnected = user?.socialAccounts?.some(account => account.platform === platform.key);
              const connectedAccount = user?.socialAccounts?.find(account => account.platform === platform.key);
              
              return (
                <div 
                  key={platform.key} 
                  className={`relative border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                    isConnected 
                      ? `border-green-200 dark:border-green-800 ${platform.bgLight} dark:${platform.bgDark}` 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {isConnected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{platform.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {platform.description}
                      </p>
                      
                      {isConnected && connectedAccount && (
                        <div className="mt-2 space-y-1">
                          {connectedAccount.username && (
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              @{connectedAccount.username}
                            </p>
                          )}
                          {connectedAccount.follower_count && (
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {connectedAccount.follower_count.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-3">
                        {isConnected ? (
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Connected
                            </span>
                            <button
                              onClick={() => handleDisconnectPlatform(platform.key)}
                              disabled={isLoading}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Disconnect
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConnectPlatform(platform.key)}
                            disabled={isLoading}
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors disabled:opacity-50 ${platform.color} hover:opacity-90`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {user?.socialAccounts?.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No platforms connected</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Connect your social media accounts to start publishing content across multiple platforms.
              </p>
              <Link
                to="/settings"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Settings
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Content</h2>
            <Link to="/calendar" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View all <Calendar className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Platforms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-1">
                        {post.platforms.map((platform) => (
                          <div key={platform}>{getPlatformIcon(platform)}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.date || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.engagement > 0 ? post.engagement.toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Platform Performance</h2>
            <Link to="/analytics" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              Full analytics <BarChart2 className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="p-4">
            {platformPerformance.map((platform) => (
              <div key={platform.name} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{platform.name}</span>
                  <span className="text-sm text-green-600 dark:text-green-400">{platform.growth}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(platform.engagement / 5000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{platform.followers.toLocaleString()} followers</span>
                  <span>{platform.engagement.toLocaleString()} engagement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                <PenSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Create Content</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Start creating new content for your platforms
              </p>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Schedule Posts</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Plan and schedule your content calendar
              </p>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Check performance across all platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;