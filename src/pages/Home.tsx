import React from 'react';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import { createPost } from '../data/mockPosts';
import PostCreator from '../components/PostCreator';
import InfiniteScrollPosts from '../components/InfiniteScrollPosts';

const Home: React.FC = () => {
  const { currentUser } = useUser();
  const { posts, addPost, setPosts } = usePosts();

  const handleCreatePost = (content: string, imageUrl?: string) => {
    if (currentUser) {
      if (imageUrl) {
        const postWithImage = createPost(currentUser.id, content);
        postWithImage.imageUrl = imageUrl;
        setPosts(prevPosts => [postWithImage, ...prevPosts]);
      } else {
        addPost(content, currentUser.id);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Post Creator */}
      <PostCreator onPost={handleCreatePost} />

      {/* Post Feed */}
      <InfiniteScrollPosts posts={posts} postsPerPage={3} />
    </div>
  );
};

export default Home;