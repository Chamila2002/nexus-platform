import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import { CommentProvider } from './contexts/CommentContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'explore'>('home');

  return (
    <UserProvider>
      <PostProvider>
        <CommentProvider>
          <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
            {currentPage === 'home' ? <Home /> : <Explore />}
          </Layout>
        </CommentProvider>
      </PostProvider>
    </UserProvider>
  );
}

export default App;