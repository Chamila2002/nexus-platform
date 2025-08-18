import React from 'react';
import { useState } from 'react';
import { User } from '../types';
import { CheckCircle, Calendar, Users, UserPlus, UserMinus, MessageCircle, Settings } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import PostFeed from './PostFeed';
import EditProfileModal from './EditProfileModal';

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  isCurrentUser = false
}) => {
  const { followUser, unfollowUser, isFollowing } = useUser();
  const { posts } = usePosts();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  
  const isUserFollowed = isFollowing(user.id);
  const userPosts = posts.filter(post => post.userId === user.id);

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleFollowToggle = () => {
    if (isUserFollowed) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover/Header Section */}
        <div className="h-48 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=128`}
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 p-6">
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mb-4">
            {isCurrentUser ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full transition-all font-medium flex items-center space-x-2 ${
                    isUserFollowed
                      ? 'border border-red-300 text-red-600 hover:bg-red-50'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  }`}
                >
                  {isUserFollowed ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
                {user.verified && (
                  <CheckCircle className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {user.bio && (
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            )}

            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Joined {formatJoinDate(user.createdAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-1 cursor-pointer hover:underline">
                <span className="font-bold text-gray-900">{formatNumber(user.following)}</span>
                <span className="text-gray-500 text-sm">Following</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer hover:underline">
                <span className="font-bold text-gray-900">{formatNumber(user.followers)}</span>
                <span className="text-gray-500 text-sm">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'posts', label: 'Posts', count: userPosts.length },
              { key: 'replies', label: 'Replies', count: 0 },
              { key: 'media', label: 'Media', count: userPosts.filter(p => p.imageUrl).length },
              { key: 'likes', label: 'Likes', count: 0 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {userPosts.length > 0 ? (
                <PostFeed posts={userPosts} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">
                    {isCurrentUser ? "You haven't posted anything yet." : `${user.displayName} hasn't posted anything yet.`}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'replies' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No replies yet</h3>
              <p className="text-gray-500">Replies will appear here when available.</p>
            </div>
          )}
          
          {activeTab === 'media' && (
            <div>
              {userPosts.filter(p => p.imageUrl).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userPosts
                    .filter(p => p.imageUrl)
                    .map((post) => (
                      <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt="Media post"
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No media yet</h3>
                  <p className="text-gray-500">Photos and videos will appear here.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No likes yet</h3>
              <p className="text-gray-500">Liked posts will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;