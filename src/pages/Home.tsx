import React from 'react';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext.tsx';
import PostCreator from '../components/PostCreator.tsx';
import PostFeed from '../components/PostFeed.tsx';

const Home: React.FC = () => {
  const { currentUser } = useUser();
  const { posts, addPost } = usePosts();

  const handleCreatePost = (content: string) => {
    if (currentUser) {
      addPost(content, currentUser.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Post Creator */}
      <PostCreator onPost={handleCreatePost} />

      {/* Post Feed */}
      <PostFeed posts={posts} />
    </div>
  );
};

export default Home;