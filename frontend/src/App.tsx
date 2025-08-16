import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import { CommentProvider } from './contexts/CommentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'explore'>('home');

  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <PostProvider>
            <CommentProvider>
              <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
                <div className="animate-fade-in">
                  {currentPage === 'home' ? <Home /> : <Explore />}
                </div>
              </Layout>
            </CommentProvider>
          </PostProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;