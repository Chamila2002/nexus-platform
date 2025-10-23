import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  XCircle,
} from 'lucide-react';
import { Post, Comment as CommentType, User } from '../types';
import { useUser } from '../contexts/UserContext';
import { Users, Posts } from '../services/api';
import { formatDate } from '../utils/formatters';

interface CommentModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, isOpen, onClose }) => {
  const { user } = useUser();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // actions state
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const CHARACTER_LIMIT = 280;
  const remainingChars = CHARACTER_LIMIT - commentContent.length;
  const isOverLimit = remainingChars < 0;
  const isEmpty = commentContent.trim().length === 0;

  // Load users once
  useEffect(() => {
    Users.list().then(setAllUsers).catch(() => {});
  }, []);

  // Load comments when opened
  useEffect(() => {
    if (!isOpen) return;
    Posts.comments.list(post.id).then(setComments).catch(() => {});
  }, [isOpen, post.id]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [commentContent]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
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
    if (isEmpty || isOverLimit || !user) return;
    setIsSubmitting(true);
    try {
      const created = await Posts.comments.create(post.id, {
        authorId: user.id,
        content: commentContent.trim(),
      });
      // newest first (matches backend sort: createdAt desc)
      setComments((prev) => [created, ...prev]);
      setCommentContent('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Local like toggle (no backend endpoint provided)
  const handleCommentLike = (commentId: string, isLiked: boolean) => {
    if (!user) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const likedBy = new Set(c.likedBy);
        if (isLiked) likedBy.delete(user.id);
        else likedBy.add(user.id);
        return { ...c, likedBy: Array.from(likedBy), likes: Array.from(likedBy).length };
      })
    );
  };

  // --- edit/delete helpers ---
  const startEdit = (c: CommentType) => {
    setEditingId(c.id);
    setEditingText(c.content);
    setMenuOpenFor(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async (c: CommentType) => {
    if (!editingText.trim()) return;
    try {
      const updated = await Posts.comments.update(post.id, c.id, { content: editingText.trim() });
      setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, ...updated } : x)));
      setEditingId(null);
      setEditingText('');
    } catch (e) {
      console.error('Failed to update comment', e);
    }
  };

  const deleteComment = async (c: CommentType) => {
    const ok = confirm('Delete this comment?');
    if (!ok) return;
    try {
      await Posts.comments.remove(post.id, c.id);
      setComments((prev) => prev.filter((x) => x.id !== c.id));
      setMenuOpenFor(null);
    } catch (e) {
      console.error('Failed to delete comment', e);
    }
  };

  const getUserById = (userId: string) => allUsers.find((u) => u.id === userId);
  const postAuthor = getUserById(post.userId);

  if (!isOpen || !postAuthor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Post Comments</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col max-h-[calc(90vh-80px)]">
          {/* Original Post */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex space-x-3">
              <img
                src={postAuthor.avatar || `https://ui-avatars.com/api/?name=${postAuthor.displayName}&background=6366f1&color=fff&size=48`}
                alt={postAuthor.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{postAuthor.displayName}</h3>
                  {postAuthor.verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-gray-500 dark:text-gray-400 text-sm">@{postAuthor.username}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(post.createdAt ?? post.timestamp)}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  {post.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                      <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-64 object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6 mt-4 text-gray-500 dark:text-gray-400 text-sm">
                  <span>{post.comments} comments</span>
                  <span>{post.likes} likes</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          {user && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex space-x-3">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=40`}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Post your reply..."
                    className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 dark:placeholder-gray-400 bg-transparent min-h-[40px] max-h-[120px] text-gray-900 dark:text-gray-100"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
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
                          ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
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

          {/* Comments */}
          <div className="flex-1 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No comments yet. Be the first to reply!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {comments.map((comment) => {
                  const commentAuthor = allUsers.find((u) => u.id === comment.userId);
                  const isLiked = user ? comment.likedBy.includes(user.id) : false;
                  const isOwner = user?.id === comment.userId;
                  if (!commentAuthor) return null;

                  const isEditing = editingId === comment.id;

                  return (
                    <div key={comment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex space-x-3">
                        <img
                          src={
                            commentAuthor.avatar ||
                            `https://ui-avatars.com/api/?name=${commentAuthor.displayName}&background=6366f1&color=fff&size=40`
                          }
                          alt={commentAuthor.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                              {commentAuthor.displayName}
                            </h4>
                            {commentAuthor.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <span className="text-gray-500 dark:text-gray-400 text-sm">@{commentAuthor.username}</span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {formatDate(comment.createdAt)}
                            </span>

                            {/* Actions menu (owner only) */}
                            {isOwner && (
                              <div className="ml-auto relative">
                                <button
                                  onClick={() => setMenuOpenFor((v) => (v === comment.id ? null : comment.id))}
                                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                                {menuOpenFor === comment.id && (
                                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                    <button
                                      onClick={() => startEdit(comment)}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                                    >
                                      <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    <button
                                      onClick={() => deleteComment(comment)}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Content / Edit box */}
                          {!isEditing ? (
                            <p className="text-gray-900 dark:text-gray-100 mt-1 leading-relaxed">{comment.content}</p>
                          ) : (
                            <div className="mt-2">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full border rounded-lg p-2 bg-transparent text-gray-900 dark:text-gray-100"
                                rows={3}
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => saveEdit(comment)}
                                  disabled={!editingText.trim()}
                                  className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-sm disabled:opacity-50 inline-flex items-center gap-1"
                                >
                                  <Check className="h-4 w-4" /> Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 rounded-full border text-sm inline-flex items-center gap-1"
                                >
                                  <XCircle className="h-4 w-4" /> Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Like */}
                          <div className="flex items-center space-x-4 mt-2">
                            <button
                              onClick={() => handleCommentLike(comment.id, isLiked)}
                              className={`flex items-center space-x-1 text-sm transition-colors ${
                                isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-600'
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
