import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';
import { CommentProvider } from './contexts/CommentContext';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <UserProvider>
      <PostProvider>
        <CommentProvider>
          <Layout>
            <Home />
          </Layout>
        </CommentProvider>
      </PostProvider>
    </UserProvider>
  );
}

export default App;