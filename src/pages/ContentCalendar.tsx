import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Calendar as CalendarIcon,
  Plus,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Post = {
  id: number;
  title: string;
  platforms: string[];
  status: 'published' | 'scheduled' | 'draft';
  date: string;
  time?: string;
};

const ContentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [activePostId, setActivePostId] = useState<number | null>(null);

  // Mock data for posts
  const posts: Post[] = [
    { id: 1, title: 'Summer Sale Announcement', platforms: ['instagram', 'facebook'], status: 'published', date: '2025-06-01', time: '09:00' },
    { id: 2, title: 'New Product Launch Video', platforms: ['youtube', 'facebook', 'instagram'], status: 'scheduled', date: '2025-06-05', time: '14:30' },
    { id: 3, title: 'Customer Testimonial', platforms: ['twitter', 'facebook'], status: 'scheduled', date: '2025-06-08', time: '11:15' },
    { id: 4, title: 'Summer Collection Showcase', platforms: ['instagram'], status: 'scheduled', date: '2025-06-12', time: '10:00' },
    { id: 5, title: 'Flash Sale Promotion', platforms: ['facebook', 'twitter'], status: 'scheduled', date: '2025-06-15', time: '16:45' },
    { id: 6, title: 'How-to Tutorial Video', platforms: ['youtube', 'instagram'], status: 'scheduled', date: '2025-06-18', time: '13:20' },
    { id: 7, title: 'Product Spotlight', platforms: ['instagram', 'facebook'], status: 'draft', date: '2025-06-22' },
    { id: 8, title: 'Customer Q&A Session', platforms: ['instagram', 'facebook', 'youtube'], status: 'draft', date: '2025-06-25' },
  ];

  const getMonthDays = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    
    // Add previous month's days to fill the first week
    const daysFromPrevMonth = dayOfWeek;
    const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() - 1, i),
        isCurrentMonth: false,
      });
    }
    
    // Add current month's days
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    for (let i = 1; i <= lastDayOfMonth; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        isCurrentMonth: true,
      });
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 7 - (days.length % 7 || 7);
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const days = getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(post => post.date === dateStr);
  };

  const getPlatformIndicator = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" title="Instagram"></div>;
      case 'facebook':
        return <div className="w-2 h-2 rounded-full bg-blue-600" title="Facebook"></div>;
      case 'twitter':
        return <div className="w-2 h-2 rounded-full bg-blue-400" title="Twitter"></div>;
      case 'youtube':
        return <div className="w-2 h-2 rounded-full bg-red-600" title="YouTube"></div>;
      default:
        return null;
    }
  };

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

  const renderMonthView = () => {
    return (
      <div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-100 dark:bg-gray-800 text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          {days.map((day, i) => {
            const postsForDay = getPostsForDate(day.date);
            const isToday = 
              day.date.getDate() === new Date().getDate() && 
              day.date.getMonth() === new Date().getMonth() && 
              day.date.getFullYear() === new Date().getFullYear();
            
            return (
              <div
                key={i}
                className={`min-h-[120px] p-2 ${
                  day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850 text-gray-400 dark:text-gray-500'
                } ${isToday ? 'ring-2 ring-inset ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                      isToday
                        ? 'bg-blue-500 text-white'
                        : day.isCurrentMonth
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                  {postsForDay.length > 0 && (
                    <div className="flex space-x-1">
                      {Array.from(new Set(postsForDay.flatMap(post => post.platforms))).slice(0, 3).map((platform) => (
                        getPlatformIndicator(platform)
                      ))}
                      {Array.from(new Set(postsForDay.flatMap(post => post.platforms))).length > 3 && (
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" title="More platforms"></div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                  {postsForDay.map((post) => (
                    <div
                      key={post.id}
                      className={`p-1 text-xs rounded truncate cursor-pointer relative group ${
                        post.status === 'published'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : post.status === 'scheduled'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                          : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                    >
                      {post.time && <span className="font-medium">{post.time} · </span>}
                      {post.title}
                      
                      {activePostId === post.id && (
                        <div className="absolute top-full left-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Post
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Platforms
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {posts
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                    {post.time && <span className="block text-xs">{post.time}</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-1">
                      {post.platforms.map((platform) => getPlatformIndicator(platform))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    <div className="relative inline-block">
                      <button 
                        onClick={() => setActivePostId(activePostId === post.id ? null : post.id)} 
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      
                      {activePostId === post.id && (
                        <div className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Post
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan and manage your content schedule
          </p>
        </div>
        <Link
          to="/create"
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="mx-4 text-lg font-semibold text-gray-900 dark:text-white">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={goToToday}
              className="ml-4 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Today
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md flex">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2" onClick={() => activePostId && setActivePostId(null)}>
          {viewMode === 'month' ? renderMonthView() : renderListView()}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Platform Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((platform) => {
            const count = posts.filter(post => post.platforms.includes(platform.toLowerCase())).length;
            const percentage = Math.round((count / posts.length) * 100) || 0;
            
            return (
              <div key={platform} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{platform}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{count} posts</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      platform === 'Instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      platform === 'Facebook' ? 'bg-blue-600' :
                      platform === 'Twitter' ? 'bg-blue-400' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;