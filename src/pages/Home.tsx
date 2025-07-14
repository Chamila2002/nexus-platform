import React from 'react';
import { Plus, Image, Video, Calendar, Users, Compass } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Create Post Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">U</span>
            </div>
            <input
              type="text"
              placeholder="What's on your mind?"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Image className="h-5 w-5" />
                <span className="text-sm font-medium">Photo</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Video className="h-5 w-5" />
                <span className="text-sm font-medium">Video</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">Event</span>
              </button>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nexus</h2>
        <p className="text-gray-600 mb-6">
          Connect with friends, share your moments, and discover what's happening in your world.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Connect</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <Image className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Share</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Compass className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Discover</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;