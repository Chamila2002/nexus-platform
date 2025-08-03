import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import { useComments } from '../contexts/CommentContext';
import { formatDate } from '../utils/formatters';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

interface PostFeedProps {
  posts: Post[];
}

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  const { currentUser, getAllUsers } = useUser();
  const { likePost, unlikePost, sharePost } = usePosts();
  const { getCommentsByPostId } = useComments();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedSharePost, setSelectedSharePost] = useState<Post | null>(null);
  const allUsers = getAllUsers();

  const getUserById = (userId: string) => {
    return allUsers.find((user) => user.id === userId);
  };

  const handleLike = (post: Post) => {
    if (!currentUser) return;
    const isLiked = post.likedBy.includes(currentUser.id);
    if (isLiked) {
      unlikePost(post.id, currentUser.id);
    } else {
      likePost(post.id, currentUser.id);
    }
  };

  const handleCommentClick = (post: Post) => setSelectedPost(post);
  const closeCommentModal = () => setSelectedPost(null);
  const handleShareClick = (post: Post) => setSelectedSharePost(post);
  const closeShareModal = () => setSelectedSharePost(null);
  const handleShare = (postId: string) => sharePost(postId);

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400">
          No posts yet. Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const author = getUserById(post.userId);
        const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
        const commentCount = getCommentsByPostId(post.id).length;

        if (!author) return null;

        return (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start space-x-3">
                <img
                  src={
                    author.avatar ||
                    `https://ui-avatars.com/api/?name=${author.displayName}&background=6366f1&color=fff&size=48`
                  }
                  alt={author.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {author.displayName}
                    </h3>
                    {author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      @{author.username}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(post.timestamp)}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mt-2">
                    <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Image */}
                    {post.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between mt-4 max-w-md">
                    <button
                      onClick={() => handleCommentClick(post)}
                      className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                      <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm">{commentCount}</span>
                    </button>

                    <button
                      onClick={() => handleShareClick(post)}
                      className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
                    >
                      <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors">
                        <Share className="h-5 w-5" />
                      </div>
                      <span className="text-sm">{post.shares}</span>
                    </button>

                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center space-x-2 transition-colors group ${
                        isLiked
                          ? 'text-red-500'
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full transition-colors ${
                          isLiked
                            ? 'bg-red-50 dark:bg-red-900/30'
                            : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                        />
                      </div>
                      <span className="text-sm">{post.likes}</span>
                    </button>

                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Comment Modal */}
      {selectedPost && (
        <CommentModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={closeCommentModal}
        />
      )}

      {/* Share Modal */}
      {selectedSharePost && (
        <ShareModal
          post={selectedSharePost}
          isOpen={!!selectedSharePost}
          onClose={closeShareModal}
          onShare={() => handleShare(selectedSharePost.id)}
        />
      )}
    </div>
  );
};

export default PostFeed;
