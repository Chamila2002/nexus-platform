import React from 'react';
import { Home, Compass, Heart, Bookmark, Settings, Users, TrendingUp } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Compass, label: 'Explore', active: false },
    { icon: Heart, label: 'Liked', active: false },
    { icon: Bookmark, label: 'Saved', active: false },
    { icon: Users, label: 'Friends', active: false },
    { icon: TrendingUp, label: 'Trending', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-white h-screen sticky top-16 border-r border-gray-200 hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(({ icon: Icon, label, active }) => (
            <li key={label}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  active
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;