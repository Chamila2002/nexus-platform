import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '../types';
import PostFeed from './PostFeed';
import LoadingSpinner from './LoadingSpinner';

interface InfiniteScrollPostsProps {
  posts: Post[];
  postsPerPage?: number;
}

const InfiniteScrollPosts: React.FC<InfiniteScrollPostsProps> = ({ 
  posts, 
  postsPerPage = 5 
}) => {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Initialize with first page
  useEffect(() => {
    const initialPosts = posts.slice(0, postsPerPage);
    setDisplayedPosts(initialPosts);
    setHasMore(posts.length > postsPerPage);
    setCurrentPage(1);
  }, [posts, postsPerPage]);

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = posts.slice(startIndex, endIndex);
    
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setDisplayedPosts(prev => [...prev, ...newPosts]);
      setCurrentPage(prev => prev + 1);
      setHasMore(endIndex < posts.length);
    }
    
    setIsLoading(false);
  }, [posts, currentPage, postsPerPage, isLoading, hasMore]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  return (
    <div>
      <PostFeed posts={displayedPosts} />
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            <LoadingSpinner size="md" color="gray" />
            <span>Loading more posts...</span>
          </div>
        </div>
      )}
      
      {!hasMore && displayedPosts.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>You've reached the end! 🎉</p>
          <p className="text-sm mt-1">No more posts to load.</p>
        </div>
      )}
      
      {displayedPosts.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No posts to display.</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollPosts;