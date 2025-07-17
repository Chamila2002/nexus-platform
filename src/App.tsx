import React from 'react';
import { UserProvider } from './contexts/UserContext.tsx';
import { PostProvider } from './contexts/PostContext.tsx';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <UserProvider>
      <PostProvider>
        <Layout>
          <Home />
        </Layout>
      </PostProvider>
    </UserProvider>
  );
}

export default App;