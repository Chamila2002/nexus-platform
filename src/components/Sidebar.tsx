import React from 'react';
import { Home, Compass, Bell, MessageCircle, User, Plus, MoreHorizontal } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Compass, label: 'Explore', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: MessageCircle, label: 'Messages', active: false },
    { icon: User, label: 'Profile', active: false },
    { icon: MoreHorizontal, label: 'More', active: false },
  ];

  return (
    <aside className="w-64 bg-white h-screen sticky top-0 border-r border-gray-200 hidden lg:block overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full opacity-80"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Nexus
              </h1>
              <p className="text-xs text-gray-500 font-medium">Connect & Share</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map(({ icon: Icon, label, active }) => (
              <li key={label}>
                <button
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 shadow-sm border border-purple-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100' 
                      : 'group-hover:bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 transition-all duration-200 ${
                      active ? 'text-purple-600' : 'text-gray-600 group-hover:text-gray-800'
                    }`} />
                  </div>
                  <span className="font-medium text-base">{label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Create Post Button */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">@johndoe</p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;