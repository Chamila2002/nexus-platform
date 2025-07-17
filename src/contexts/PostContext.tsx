import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Post } from '../types';
import { mockPosts, createPost } from '../data/mockPosts';

interface PostContextType {
  posts: Post[];
  addPost: (content: string, userId: string) => void;
  likePost: (postId: string, userId: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  isLoading: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);

  const addPost = async (content: string, userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newPost = createPost(userId, content);
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (error) {
      console.error('Failed to add post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const likePost = (postId: string, userId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + 1,
              likedBy: [...post.likedBy, userId],
            }
          : post
      )
    );
  };

  const unlikePost = (postId: string, userId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: Math.max(0, post.likes - 1),
              likedBy: post.likedBy.filter(id => id !== userId),
            }
          : post
      )
    );
  };

  const value: PostContextType = {
    posts,
    addPost,
    likePost,
    unlikePost,
    isLoading,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = (): PostContextType => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};