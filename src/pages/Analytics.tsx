import { useState } from 'react';
import { BarChart2, TrendingUp, Users, Eye, ArrowUp, ArrowDown, Calendar, ChevronDown } from 'lucide-react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [platformFilter, setPlatformFilter] = useState('all');

  // Mock data for analytics
  const overviewStats = [
    { 
      name: 'Total Reach', 
      value: '158,423', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    { 
      name: 'Engagement', 
      value: '32,842', 
      change: '+18.2%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'green' 
    },
    { 
      name: 'Impressions', 
      value: '245,127', 
      change: '+8.7%', 
      trend: 'up',
      icon: Eye,
      color: 'purple'
    },
    { 
      name: 'Conversion Rate', 
      value: '3.2%', 
      change: '-0.5%', 
      trend: 'down',
      icon: BarChart2,
      color: 'orange'
    },
  ];

  const platformPerformance = [
    { 
      name: 'Instagram', 
      followers: 12540, 
      engagement: 4850, 
      posts: 24, 
      growth: '+5.2%',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Facebook', 
      followers: 28350, 
      engagement: 3240, 
      posts: 18, 
      growth: '+2.1%',
      color: 'from-blue-600 to-blue-500'
    },
    { 
      name: 'Twitter', 
      followers: 8920, 
      engagement: 2180, 
      posts: 32, 
      growth: '+8.7%',
      color: 'from-blue-400 to-blue-300'
    },
    { 
      name: 'YouTube', 
      followers: 5340, 
      engagement: 12450, 
      posts: 8, 
      growth: '+15.3%',
      color: 'from-red-600 to-red-500'
    },
  ];

  const topPosts = [
    { 
      id: 1, 
      title: 'Summer Collection Showcase', 
      platform: 'Instagram', 
      engagement: 3245, 
      reach: 15420, 
      date: '2025-05-15' 
    },
    { 
      id: 2, 
      title: 'Product Tutorial Video', 
      platform: 'YouTube', 
      engagement: 2876, 
      reach: 8540, 
      date: '2025-05-20' 
    },
    { 
      id: 3, 
      title: 'Customer Testimonial Series', 
      platform: 'Facebook', 
      engagement: 1564, 
      reach: 12380, 
      date: '2025-05-25' 
    },
    { 
      id: 4, 
      title: 'Limited Time Offer Announcement', 
      platform: 'Twitter', 
      engagement: 982, 
      reach: 7640, 
      date: '2025-05-28' 
    },
  ];

  // Mock chart data (simplified for this example)
  const chartData = {
    labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
    datasets: [
      {
        name: 'Engagement',
        data: [1200, 1900, 3000, 5000, 4000, 6500, 7000],
        color: 'blue',
      },
      {
        name: 'Reach',
        data: [4000, 5000, 8000, 12000, 9500, 15000, 16000],
        color: 'green',
      },
    ],
  };

  // Platform colors for visual indicators
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-blue-400';
      case 'youtube':
        return 'bg-red-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track performance across all your social platforms
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</h3>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  <p
                    className={`ml-2 text-sm font-medium ${
                      stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    } flex items-center`}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                    )}
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Performance Overview</h2>
          </div>
          <div className="p-4">
            {/* Simple chart representation - in a real app, use a chart library */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.labels.map((label, i) => (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                      style={{ 
                        height: `${(chartData.datasets[0].data[i] / Math.max(...chartData.datasets[0].data)) * 150}px` 
                      }}
                    ></div>
                    <div 
                      className="w-full bg-green-500 dark:bg-green-600 rounded-t mt-1"
                      style={{ 
                        height: `${(chartData.datasets[1].data[i] / Math.max(...chartData.datasets[1].data)) * 150}px` 
                      }}
                    ></div>
                  </div>
                  <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Reach</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Performing Posts</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</h3>
                      <div className="flex items-center mt-1">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getPlatformColor(post.platform)}`}
                        ></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{post.platform}</span>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{post.engagement.toLocaleString()}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">engagements</div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getPlatformColor(post.platform)}`}
                      style={{ width: `${(post.engagement / 5000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Platform Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Followers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Posts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Growth
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {platformPerformance.map((platform) => (
                <tr key={platform.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center text-white font-medium text-xs`}>
                        {platform.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{platform.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{platform.followers.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{platform.engagement.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {platform.posts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {platform.growth}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${platform.color}`}
                        style={{ width: `${(platform.engagement / 15000) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Audience Demographics</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Age Distribution</h3>
            <div className="space-y-4">
              {['18-24', '25-34', '35-44', '45-54', '55+'].map((age, index) => {
                const percentage = [15, 38, 24, 18, 5][index];
                return (
                  <div key={age}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{age}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 dark:bg-blue-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Gender & Geography */}
          <div className="space-y-6">
            {/* Gender Distribution */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Gender Distribution</h3>
              <div className="flex items-center">
                <div className="w-1/2 h-4 bg-blue-500 dark:bg-blue-600 rounded-l-full"></div>
                <div className="w-1/2 h-4 bg-pink-500 dark:bg-pink-600 rounded-r-full"></div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Male (48%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 dark:bg-pink-600 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Female (52%)</span>
                </div>
              </div>
            </div>
            
            {/* Top Locations */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Top Locations</h3>
              <div className="space-y-2">
                {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((country, index) => {
                  const percentage = [42, 18, 12, 8, 5][index];
                  return (
                    <div key={country} className="flex items-center">
                      <div className="w-32 text-sm text-gray-600 dark:text-gray-400">{country}</div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 dark:bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;