import React from 'react';
import { User } from '../types';
import { CheckCircle, Calendar, Users, UserPlus } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  isCurrentUser = false, 
  onFollow, 
  onMessage 
}) => {
  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover/Header Section */}
      <div className="h-32 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 relative">
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
        {!isCurrentUser && (
          <div className="flex justify-end space-x-3 mb-4">
            <button
              onClick={onMessage}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Message
            </button>
            <button
              onClick={onFollow}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Follow</span>
            </button>
          </div>
        )}

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
            <div className="flex items-center space-x-1">
              <span className="font-bold text-gray-900">{formatNumber(user.following)}</span>
              <span className="text-gray-500 text-sm">Following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-gray-900">{formatNumber(user.followers)}</span>
              <span className="text-gray-500 text-sm">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;