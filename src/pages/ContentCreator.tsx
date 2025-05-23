import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  ListOrdered,
  Image as ImageIcon,
  Video,
  Save,
  Calendar,
  Send,
  X,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  CheckSquare,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Clock
} from 'lucide-react';

const ContentCreator = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    youtube: false,
    facebook: false,
    instagram: false,
    twitter: false,
  });

  const handlePlatformToggle = (platform: keyof typeof selectedPlatforms) => {
    setSelectedPlatforms({
      ...selectedPlatforms,
      [platform]: !selectedPlatforms[platform],
    });
  };

  const handleAddMedia = () => {
    // In a real app, this would open a media picker
    const mockMediaUrl = mediaType === 'image' 
      ? 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      : 'https://www.example.com/sample-video.mp4';
    
    setMediaUrls([...mediaUrls, mockMediaUrl]);
  };

  const handleRemoveMedia = (index: number) => {
    const newMediaUrls = [...mediaUrls];
    newMediaUrls.splice(index, 1);
    setMediaUrls(newMediaUrls);
  };

  const handleSave = () => {
    // Save as draft
    alert('Content saved as draft!');
  };

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime) {
      alert('Please select both date and time for scheduling');
      return;
    }
    
    // In a real app, this would save the scheduled post to the database
    const platformsList = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);
    
    if (platformsList.length === 0) {
      alert('Please select at least one platform');
      return;
    }
    
    alert(`Content scheduled for ${scheduledDate} at ${scheduledTime} on ${platformsList.join(', ')}`);
    setShowSchedule(false);
  };

  const handlePublishNow = () => {
    const platformsList = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);
    
    if (platformsList.length === 0) {
      alert('Please select at least one platform');
      return;
    }
    
    // In a real app, this would publish immediately to the selected platforms
    alert(`Content published to ${platformsList.join(', ')}`);
  };

  const platforms = [
    { key: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', tooltip: 'Optimize for YouTube' },
    { key: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', tooltip: 'Optimize for Facebook' },
    { key: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', tooltip: 'Optimize for Instagram' },
    { key: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400', tooltip: 'Optimize for Twitter' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Content</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Draft
          </button>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </button>
          <button
            onClick={handlePublishNow}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4 mr-1" />
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              />
            </div>
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap">
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Add Link">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Bullet List">
                <List className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="border-l border-gray-200 dark:border-gray-700 mx-1"></div>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                className="w-full h-64 bg-transparent border-none focus:outline-none focus:ring-0 resize-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Media</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMediaType('image')}
                  className={`p-1.5 rounded-md flex items-center text-sm ${
                    mediaType === 'image' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Image
                </button>
                <button
                  onClick={() => setMediaType('video')}
                  className={`p-1.5 rounded-md flex items-center text-sm ${
                    mediaType === 'video' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    {mediaType === 'image' ? (
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddMedia}
                  className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {mediaType === 'image' ? (
                    <>
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-sm">Add Image</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-8 h-8 mb-1" />
                      <span className="text-sm">Add Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview and Settings */}
        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Platforms</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select where to publish your content
              </p>
            </div>
            <div className="p-4 space-y-3">
              {platforms.map((platform) => (
                <div
                  key={platform.key}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handlePlatformToggle(platform.key as keyof typeof selectedPlatforms)}
                >
                  <div className="flex items-center">
                    <platform.icon className={`w-5 h-5 ${platform.color} mr-3`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {platform.name}
                    </span>
                  </div>
                  <div>
                    {selectedPlatforms[platform.key as keyof typeof selectedPlatforms] ? (
                      <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform-specific Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Platform Preview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How your content will appear on each platform
              </p>
            </div>
            <div className="p-4 flex flex-col items-center">
              {/* Sample mobile preview frame */}
              <div className="w-64 h-96 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg relative">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex justify-center items-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <div className="bg-white h-full pt-8 overflow-auto">
                  {/* Instagram-style post preview */}
                  <div className="p-2">
                    <div className="flex items-center p-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <div className="ml-2">
                        <p className="text-sm font-bold">yourbrand</p>
                      </div>
                    </div>
                    {mediaUrls.length > 0 && (
                      <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={mediaUrls[0]}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-2">
                      <div className="flex space-x-3 mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold">42 likes</p>
                      <p className="text-sm">
                        <span className="font-bold">yourbrand</span>{' '}
                        {content || 'Your post content will appear here...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.key}
                      className={`p-1.5 rounded-md flex items-center text-sm ${
                        platform.key === 'instagram' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                      }`}
                      title={platform.tooltip}
                    >
                      <platform.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Modal */}
          {showSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Schedule Post</h2>
                  <button onClick={() => setShowSchedule(false)}>
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md flex items-start">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Posts are scheduled based on each platform's time zone settings. Content will be published at the specified time in each platform's local time zone.
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSchedule}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCreator;