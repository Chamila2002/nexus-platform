import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Post, User } from '../types';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext'; // keeps your like/share UI logic
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';
import PostTimestamp from './PostTimestamp';
import { Users, Posts as PostsApi } from '../services/api';

interface PostFeedProps {
  posts?: Post[]; // optional: if not provided, we fetch from backend
}

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  const { user } = useUser();
  const { likePost, unlikePost, sharePost } = usePosts();

  const [fetchedPosts, setFetchedPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, User>>({});
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedSharePost, setSelectedSharePost] = useState<Post | null>(null);

  const sourcePosts = posts ?? fetchedPosts;

  // Fetch posts if not provided by parent
  useEffect(() => {
    if (posts?.length) return;
    (async () => {
      const res = await PostsApi.list(1, 20);
      setFetchedPosts(res.items);
    })();
  }, [posts]);

  // Load users once for author display
  useEffect(() => {
    (async () => {
      const list = await Users.list();
      const map: Record<string, User> = {};
      list.forEach((u) => (map[u.id] = u));
      setAuthors(map);
    })();
  }, []);

  const getUserById = (userId: string) => authors[userId];

  const handleLike = (post: Post) => {
    if (!user) return;
    const isLiked = post.likedBy.includes(user.id);
    if (isLiked) unlikePost(post.id, user.id);
    else likePost(post.id, user.id);
  };

  const handleCommentClick = (post: Post) => setSelectedPost(post);
  const closeCommentModal = () => setSelectedPost(null);
  const handleShareClick = (post: Post) => setSelectedSharePost(post);
  const closeShareModal = () => setSelectedSharePost(null);
  const handleShare = (postId: string) => sharePost(postId);

  const formatPostContent = (content: string) =>
    content
      .replace(/@(\w+)/g, '<span class="text-purple-600 dark:text-purple-400 font-semibold cursor-pointer hover:underline transition-colors">@$1</span>')
      .replace(/#(\w+)/g, '<span class="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline transition-colors">#$1</span>');

  if (sourcePosts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sourcePosts.map((post) => {
        const author = getUserById(post.userId);
        const isLiked = user ? post.likedBy.includes(user.id) : false;
        const commentCount = post.comments ?? 0;

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
                  src={author.avatar || `https://ui-avatars.com/api/?name=${author.displayName}&background=6366f1&color=fff&size=48`}
                  alt={author.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{author.displayName}</h3>
                    {author.verified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">@{author.username}</span>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <PostTimestamp timestamp={post.timestamp} />
                  </div>

                  {/* Content */}
                  <div className="mt-2">
                    <p
                      className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatPostContent(post.content) }}
                    />
                    {post.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
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
                        isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full transition-colors ${
                          isLiked ? 'bg-red-50 dark:bg-red-900/30' : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
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

      {selectedPost && (
        <CommentModal post={selectedPost} isOpen={!!selectedPost} onClose={closeCommentModal} />
      )}

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
