import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Comment } from '../types';
import { mockComments, createComment } from '../data/mockComments';

interface CommentContextType {
  comments: Comment[];
  getCommentsByPostId: (postId: string) => Comment[];
  addComment: (postId: string, content: string, userId: string) => void;
  likeComment: (commentId: string, userId: string) => void;
  unlikeComment: (commentId: string, userId: string) => void;
  isLoading: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

interface CommentProviderProps {
  children: ReactNode;
}

export const CommentProvider: React.FC<CommentProviderProps> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isLoading, setIsLoading] = useState(false);

  const getCommentsByPostId = (postId: string): Comment[] => {
    return comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const addComment = async (postId: string, content: string, userId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newComment = createComment(userId, postId, content);
      setComments(prevComments => [newComment, ...prevComments]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const likeComment = (commentId: string, userId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes + 1,
              likedBy: [...comment.likedBy, userId],
            }
          : comment
      )
    );
  };

  const unlikeComment = (commentId: string, userId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: Math.max(0, comment.likes - 1),
              likedBy: comment.likedBy.filter(id => id !== userId),
            }
          : comment
      )
    );
  };

  const value: CommentContextType = {
    comments,
    getCommentsByPostId,
    addComment,
    likeComment,
    unlikeComment,
    isLoading,
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};