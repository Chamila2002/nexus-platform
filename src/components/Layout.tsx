import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: 'home' | 'explore') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <div className="flex">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <main className="flex-1 min-h-screen lg:ml-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;