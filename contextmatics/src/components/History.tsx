import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ContentItem {
  id: string;
  title: string;
  format: string;
  content: string;
  createdAt: Date;
  status: 'success' | 'failed';
  icon: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');

  // Mock history data
  const historyItems: ContentItem[] = [
    {
      id: '1',
      title: 'AI Revolution Blog Post',
      format: 'Blog Post',
      content: 'The future of AI is here and it\'s transforming how we work...',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success',
      icon: '📝'
    },
    {
      id: '2',
      title: 'Product Launch Thread',
      format: 'Twitter Thread',
      content: '🚀 Excited to announce our new product! Here\'s what you need to know...',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'success',
      icon: '🐦'
    },
    {
      id: '3',
      title: 'Weekly Newsletter',
      format: 'Email Newsletter',
      content: 'This week in tech: Major breakthroughs and industry updates...',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'success',
      icon: '📧'
    },
    {
      id: '4',
      title: 'LinkedIn Thought Leadership',
      format: 'LinkedIn Post',
      content: 'Leadership in the digital age requires adaptability and vision...',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'success',
      icon: '💼'
    },
    {
      id: '5',
      title: 'Content Summary',
      format: 'Summary',
      content: 'Key takeaways from the quarterly report...',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'success',
      icon: '📊'
    }
  ];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterFormat === 'all' || item.format === filterFormat;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view history.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <span className="text-white font-bold text-base sm:text-lg">C</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900 hidden sm:inline">ContextMatics</span>
            </button>
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm font-medium px-2 sm:px-3 py-2"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="hidden sm:inline-block text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium px-3 py-2"
              >
                Settings
              </button>
              <button
                onClick={logout}
                className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-100 transition-all text-xs sm:text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Content History</h1>
            <p className="text-base sm:text-lg text-gray-600">View and manage all your generated content</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filter */}
              <select
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="all">All Formats</option>
                <option value="Blog Post">Blog Posts</option>
                <option value="Twitter Thread">Twitter Threads</option>
                <option value="Email Newsletter">Newsletters</option>
                <option value="LinkedIn Post">LinkedIn Posts</option>
                <option value="Summary">Summaries</option>
              </select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{historyItems.length}</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Items</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">5</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">This Week</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">3.2k</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Words Generated</div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                              {item.format}
                            </span>
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold self-start ${
                          item.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'success' ? '✓ Success' : '✗ Failed'}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">{item.content}</p>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all text-xs sm:text-sm font-medium">
                          📋 Copy
                        </button>
                        <button className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-all text-xs sm:text-sm font-medium">
                          📤 Export
                        </button>
                        <button className="bg-purple-50 border border-purple-200 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-all text-xs sm:text-sm font-medium">
                          🔄 Regenerate
                        </button>
                        <button className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all text-xs sm:text-sm font-medium">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
