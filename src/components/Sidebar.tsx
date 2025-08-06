import React from 'react';
import { Home, Compass, Bell, MessageCircle, User, Plus, MoreHorizontal } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import UserSwitcher from './UserSwitcher';

interface SidebarProps {
  currentPage?: string;
  onPageChange?: (page: 'home' | 'explore') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { currentUser } = useUser();
  
  const menuItems = [
    { icon: Home, label: 'Home', key: 'home' },
    { icon: Compass, label: 'Explore', key: 'explore' },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: MessageCircle, label: 'Messages', active: false },
    { icon: User, label: 'Profile', active: false },
    { icon: MoreHorizontal, label: 'More', active: false },
  ];

  const handleProfileClick = () => {
    console.log('Profile clicked - navigation would happen here');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen sticky top-0 border-r border-gray-200 dark:border-gray-700 hidden lg:block overflow-y-auto transition-colors duration-300">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full opacity-80 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Nexus
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Connect & Share</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map(({ icon: Icon, label, key, active }) => (
              <li key={label}>
                <button
                  onClick={() => {
                    if (key && onPageChange) {
                      onPageChange(key as 'home' | 'explore');
                    } else if (label === 'Profile') {
                      handleProfileClick();
                    }
                  }}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group transform hover:scale-105 ${
                    (key && currentPage === key) || active
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-100 dark:border-purple-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all duration-200 ${
                    (key && currentPage === key) || active
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50' 
                      : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-600'
                  }`}>
                    <Icon className={`h-5 w-5 transition-all duration-200 ${
                      (key && currentPage === key) || active ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                    }`} />
                  </div>
                  <span className="font-medium text-base">{label}</span>
                  {((key && currentPage === key) || active) && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Create Post Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Post</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <UserSwitcher />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;