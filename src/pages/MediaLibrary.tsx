import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  File, 
  MoreHorizontal, 
  Grid, 
  List, 
  Plus, 
  Search,
  Filter,
  Download,
  Share2,
  Trash,
  Edit,
  X,
  CheckCircle2
} from 'lucide-react';

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Mock media items data
  const mediaItems = [
    { 
      id: 1, 
      type: 'image', 
      name: 'product-banner.jpg', 
      url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      size: '1.2 MB',
      dimensions: '1920 x 1080',
      uploadedAt: '2025-05-15', 
      usedIn: ['Instagram', 'Facebook'],
      tags: ['product', 'banner', 'summer']
    },
    { 
      id: 2, 
      type: 'image', 
      name: 'team-photo.jpg', 
      url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      size: '2.4 MB',
      dimensions: '2400 x 1600',
      uploadedAt: '2025-05-18', 
      usedIn: ['Website', 'Twitter'],
      tags: ['team', 'company', 'people']
    },
    { 
      id: 3, 
      type: 'video', 
      name: 'product-demo.mp4', 
      url: 'https://example.com/video1.mp4', 
      thumbnail: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      size: '24.8 MB',
      duration: '1:42',
      uploadedAt: '2025-05-20', 
      usedIn: ['YouTube', 'Instagram'],
      tags: ['demo', 'product', 'tutorial']
    },
    { 
      id: 4, 
      type: 'image', 
      name: 'lifestyle-photo.jpg', 
      url: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      size: '1.8 MB',
      dimensions: '2000 x 1333',
      uploadedAt: '2025-05-22', 
      usedIn: ['Instagram'],
      tags: ['lifestyle', 'product']
    },
    { 
      id: 5, 
      type: 'document', 
      name: 'social-media-guidelines.pdf', 
      url: 'https://example.com/document1.pdf', 
      size: '0.8 MB',
      uploadedAt: '2025-05-25', 
      usedIn: [],
      tags: ['guidelines', 'internal']
    },
    { 
      id: 6, 
      type: 'image', 
      name: 'product-closeup.jpg', 
      url: 'https://images.pexels.com/photos/4394857/pexels-photo-4394857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      size: '1.5 MB',
      dimensions: '1800 x 1200',
      uploadedAt: '2025-05-28', 
      usedIn: ['Facebook', 'Website'],
      tags: ['product', 'detail']
    },
    { 
      id: 7, 
      type: 'video', 
      name: 'customer-testimonial.mp4', 
      url: 'https://example.com/video2.mp4', 
      thumbnail: 'https://images.pexels.com/photos/7433822/pexels-photo-7433822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      size: '18.2 MB',
      duration: '2:15',
      uploadedAt: '2025-05-30', 
      usedIn: ['YouTube', 'Website'],
      tags: ['testimonial', 'customer']
    },
    { 
      id: 8, 
      type: 'image', 
      name: 'social-post-template.jpg', 
      url: 'https://images.pexels.com/photos/8470861/pexels-photo-8470861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 
      size: '0.9 MB',
      dimensions: '1080 x 1080',
      uploadedAt: '2025-06-01', 
      usedIn: ['Instagram', 'Facebook', 'Twitter'],
      tags: ['template', 'social']
    },
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleMediaSelection = (id: number) => {
    if (selectedMediaIds.includes(id)) {
      setSelectedMediaIds(selectedMediaIds.filter(mediaId => mediaId !== id));
    } else {
      setSelectedMediaIds([...selectedMediaIds, id]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedMediaIds.length === filteredMedia.length) {
      setSelectedMediaIds([]);
    } else {
      setSelectedMediaIds(filteredMedia.map(item => item.id));
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      case 'document':
        return <File className="w-4 h-4 text-orange-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDeleteSelected = () => {
    // In a real app, this would delete the selected items
    alert(`Deleting ${selectedMediaIds.length} items`);
    setSelectedMediaIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your media assets for all platforms
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Media
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search by name or tag..."
              />
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none pl-8 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-md flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedMediaIds.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedMediaIds.length} item{selectedMediaIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30">
                Download
              </button>
              <button 
                onClick={handleDeleteSelected}
                className="px-3 py-1 text-xs text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Delete
              </button>
              <button 
                onClick={() => setSelectedMediaIds([])}
                className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="p-4">
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No media found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className={`group relative rounded-lg overflow-hidden border ${
                    selectedMediaIds.includes(item.id)
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:border-blue-500 dark:hover:border-blue-400 transition-colors`}
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <File className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <button
                        onClick={() => toggleMediaSelection(item.id)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedMediaIds.includes(item.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                        } transition-colors`}
                      >
                        {selectedMediaIds.includes(item.id) && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMediaId(activeMediaId === item.id ? null : item.id)}
                          className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {activeMediaId === item.id && (
                          <div className="absolute right-0 top-full mt-1 z-10 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                            <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                              <Download className="w-3 h-3 mr-2" />
                              Download
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                              <Share2 className="w-3 h-3 mr-2" />
                              Share
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                              <Edit className="w-3 h-3 mr-2" />
                              Rename
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                              <Trash className="w-3 h-3 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-start space-x-1">
                      {getMediaTypeIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.size} • {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMediaIds.length === filteredMedia.length && filteredMedia.length > 0}
                          onChange={toggleAllSelection}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Used In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMediaIds.includes(item.id)}
                          onChange={() => toggleMediaSelection(item.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : item.type === 'video' ? (
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center">
                                <File className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            {item.dimensions && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{item.dimensions}</div>
                            )}
                            {item.duration && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">{item.duration}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMediaTypeIcon(item.type)}
                          <span className="ml-1.5 text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.usedIn.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.usedIn.map((platform) => (
                              <span
                                key={platform}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">Not used yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => setActiveMediaId(activeMediaId === item.id ? null : item.id)} 
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          
                          {activeMediaId === item.id && (
                            <div className="absolute right-0 z-10 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                              <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <Download className="w-3 h-3 mr-2" />
                                Download
                              </button>
                              <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <Share2 className="w-3 h-3 mr-2" />
                                Share
                              </button>
                              <button className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <Edit className="w-3 h-3 mr-2" />
                                Rename
                              </button>
                              <button className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
                                <Trash className="w-3 h-3 mr-2" />
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
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl mx-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upload Media</h2>
              <button onClick={() => setIsUploadModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    Supports images, videos, and documents up to 50MB
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                    Select Files
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Add Tags (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    placeholder="e.g. product, banner, summer (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content Usage Rights
                  </label>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="rights-checkbox"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="rights-checkbox" className="text-sm text-gray-500 dark:text-gray-400">
                      I confirm that I have the right to use this content across all platforms and it doesn't violate any copyright laws or platform guidelines.
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;