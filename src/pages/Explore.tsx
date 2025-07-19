import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, Hash, Sparkles } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { useUser } from '../contexts/UserContext';
import PostFeed from '../components/PostFeed';
import SearchBar from '../components/SearchBar';

interface SearchResult {
  type: 'post' | 'user';
  data: any;
}

const Explore: React.FC = () => {
  const { posts } = usePosts();
  const { getAllUsers } = useUser();
  const [activeTab, setActiveTab] = useState<'trending' | 'latest' | 'people' | 'media'>('trending');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const allUsers = getAllUsers();

  // Calculate trending posts (posts with high engagement)
  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const scoreA = a.likes * 2 + a.comments * 3 + a.shares * 4;
        const scoreB = b.likes * 2 + b.comments * 3 + b.shares * 4;
        return scoreB - scoreA;
      })
      .slice(0, 10);
  }, [posts]);

  // Latest posts
  const latestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }, [posts]);

  // Posts with media
  const mediaPosts = useMemo(() => {
    return posts.filter(post => post.imageUrl);
  }, [posts]);

  // Suggested users (users with most followers)
  const suggestedUsers = useMemo(() => {
    return [...allUsers]
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 5);
  }, [allUsers]);

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  const getPostsForTab = () => {
    if (isSearching) {
      return searchResults
        .filter(result => result.type === 'post')
        .map(result => result.data);
    }

    switch (activeTab) {
      case 'trending':
        return trendingPosts;
      case 'latest':
        return latestPosts;
      case 'media':
        return mediaPosts;
      default:
        return trendingPosts;
    }
  };

  const tabs = [
    { key: 'trending', label: 'Trending', icon: TrendingUp, count: trendingPosts.length },
    { key: 'latest', label: 'Latest', icon: Sparkles, count: latestPosts.length },
    { key: 'people', label: 'People', icon: Users, count: suggestedUsers.length },
    { key: 'media', label: 'Media', icon: Hash, count: mediaPosts.length },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-600">Discover trending posts and connect with new people</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearchResults={handleSearchResults}
          placeholder="Search posts, people, and topics..."
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setIsSearching(false);
                  setSearchResults([]);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.key && !isSearching
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {isSearching ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({searchResults.length})
              </h2>
              
              {/* User Results */}
              {searchResults.filter(r => r.type === 'user').length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    People
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults
                      .filter(result => result.type === 'user')
                      .map((result, index) => {
                        const user = result.data;
                        return (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=48`}
                              alt={user.displayName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-gray-900 truncate">
                                  {user.displayName}
                                </p>
                                {user.verified && (
                                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">@{user.username}</p>
                              <p className="text-sm text-gray-600">{user.followers.toLocaleString()} followers</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {/* Post Results */}
              {searchResults.filter(r => r.type === 'post').length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Posts</h3>
                  <PostFeed posts={getPostsForTab()} />
                </div>
              )}
            </div>
          ) : activeTab === 'people' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested People</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=64`}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {user.displayName}
                          </h3>
                          {user.verified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{user.bio}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{user.followers.toLocaleString()} followers</span>
                        <span>{user.following.toLocaleString()} following</span>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
                        Follow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'media' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts with Media</h2>
              {mediaPosts.length > 0 ? (
                <PostFeed posts={mediaPosts} />
              ) : (
                <div className="text-center py-12">
                  <Hash className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No media posts found</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'trending' ? 'Trending Posts' : 'Latest Posts'}
              </h2>
              <PostFeed posts={getPostsForTab()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;