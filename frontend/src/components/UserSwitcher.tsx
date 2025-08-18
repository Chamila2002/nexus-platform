import React, { useState } from 'react';
import { ChevronDown, LogOut, Users, CheckCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const UserSwitcher: React.FC = () => {
  const { currentUser, getAllUsers, switchUser, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const allUsers = getAllUsers();

  if (!currentUser) return null;

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={
            currentUser.avatar ||
            `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=6366f1&color=fff&size=40`
          }
          alt={currentUser.displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {currentUser.displayName}
            </p>
            {currentUser.verified && (
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{currentUser.username}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* Switch Account Header */}
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Switch Account</span>
            </div>
          </div>

          {/* User List */}
          <div className="max-h-60 overflow-y-auto">
            {allUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  user.id === currentUser.id
                    ? 'bg-purple-50 dark:bg-purple-900/30'
                    : ''
                }`}
              >
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=32`
                  }
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center space-x-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.displayName}
                    </p>
                    {user.verified && (
                      <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    @{user.username}
                  </p>
                </div>
                {user.id === currentUser.id && (
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwitcher;
