import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Posts as PostsApi } from '../services/api';
import PostCreator from '../components/PostCreator';
import InfiniteScrollPosts from '../components/InfiniteScrollPosts';
import type { Post } from '../types';

const Home: React.FC = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // initial load
  useEffect(() => {
    (async () => {
      try {
        const res = await PostsApi.list(1, 50); // grab a page; InfiniteScrollPosts will paginate UI-side
        setPosts(res.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!user) return;
    // create on backend then prepend to local list to keep the feed snappy
    const created = await PostsApi.create({ authorId: user.id, content, imageUrl });
    setPosts(prev => [created, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <PostCreator onPost={handleCreatePost} />
      {loading ? null : <InfiniteScrollPosts posts={posts} postsPerPage={3} />}
    </div>
  );
};

export default Home;
