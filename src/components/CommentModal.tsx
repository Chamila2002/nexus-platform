import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';
import { useUser } from '../contexts/UserContext';
import { useComments } from '../contexts/CommentContext';
import { formatDate } from '../utils/formatters';

interface CommentModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, isOpen, onClose }) => {
  const { currentUser, getAllUsers } = useUser();
  const { getCommentsByPostId, addComment, likeComment, unlikeComment, isLoading } = useComments();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const allUsers = getAllUsers();
  const comments = getCommentsByPostId(post.id);
  const postAuthor = allUsers.find(user => user.id === post.userId);

  const CHARACTER_LIMIT = 280;
  const remainingChars = CHARACTER_LIMIT - commentContent.length;
  const isOverLimit = remainingChars < 0;
  const isEmpty = commentContent.trim().length === 0;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [commentContent]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmitComment = async () => {
    if (isEmpty || isOverLimit || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      await addComment(post.id, commentContent.trim(), currentUser.id);
      setCommentContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentLike = (commentId: string, isLiked: boolean) => {
    if (!currentUser) return;
    
    if (isLiked) {
      unlikeComment(commentId, currentUser.id);
    } else {
      likeComment(commentId, currentUser.id);
    }
  };

  const getUserById = (userId: string) => {
    return allUsers.find(user => user.id === userId);
  };

  if (!isOpen || !postAuthor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Post Comments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(90vh-80px)]">
          {/* Original Post */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex space-x-3">
              <img
                src={postAuthor.avatar || `https://ui-avatars.com/api/?name=${postAuthor.displayName}&background=6366f1&color=fff&size=48`}
                alt={postAuthor.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {postAuthor.displayName}
                  </h3>
                  {postAuthor.verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-gray-500 text-sm">@{postAuthor.username}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 text-sm">{formatDate(post.timestamp)}</span>
                </div>
                
                <div className="mt-2">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  
                  {post.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt="Post content"
                        className="w-full h-auto max-h-64 object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Post Stats */}
                <div className="flex items-center space-x-6 mt-4 text-gray-500 text-sm">
                  <span>{post.comments} comments</span>
                  <span>{post.likes} likes</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          {currentUser && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex space-x-3">
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=6366f1&color=fff&size=40`}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Post your reply..."
                    className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 bg-transparent min-h-[40px] max-h-[120px]"
                  />
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-400">
                      {remainingChars < 20 && (
                        <span className={remainingChars < 0 ? 'text-red-500' : 'text-yellow-500'}>
                          {remainingChars} characters remaining
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleSubmitComment}
                      disabled={isEmpty || isOverLimit || isSubmitting}
                      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                        isEmpty || isOverLimit
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isSubmitting ? 'Replying...' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No comments yet. Be the first to reply!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {comments.map((comment) => {
                  const commentAuthor = getUserById(comment.userId);
                  const isLiked = currentUser ? comment.likedBy.includes(currentUser.id) : false;
                  
                  if (!commentAuthor) return null;

                  return (
                    <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex space-x-3">
                        <img
                          src={commentAuthor.avatar || `https://ui-avatars.com/api/?name=${commentAuthor.displayName}&background=6366f1&color=fff&size=40`}
                          alt={commentAuthor.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {commentAuthor.displayName}
                            </h4>
                            {commentAuthor.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <span className="text-gray-500 text-sm">@{commentAuthor.username}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                          </div>
                          
                          <p className="text-gray-900 mt-1 leading-relaxed">
                            {comment.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <button
                              onClick={() => handleCommentLike(comment.id, isLiked)}
                              className={`flex items-center space-x-1 text-sm transition-colors ${
                                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                              {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;