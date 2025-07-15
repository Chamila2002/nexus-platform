import React from 'react';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <UserProvider>
      <Layout>
        <Home />
      </Layout>
    </UserProvider>
  );
}

export default App;