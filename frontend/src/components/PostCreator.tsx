import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, MapPin, Smile, Bold, Italic, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';
import { Users, Posts } from '../services/api';
import type { User as UserType } from '../types';

interface PostCreatorProps {
  onPost: (content: string, imageUrl?: string) => void;
  placeholder?: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({
  onPost,
  placeholder = "What's happening?",
}) => {
  const { user } = useUser();
  const { success, error } = useToast();

  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // mention support
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CHARACTER_LIMIT = 280;
  const remainingChars = CHARACTER_LIMIT - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars > 0;
  const isEmpty = content.trim().length === 0;

  // Load users for @mentions
  useEffect(() => {
    Users.list().then(setAllUsers).catch(() => {});
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  // Cmd/Ctrl + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isEmpty && !isOverLimit) {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content, isEmpty, isOverLimit]);

  const handleSubmit = async () => {
    if (isEmpty || isOverLimit || !user) return;
    setIsPosting(true);
    try {
      // Create on backend
      await Posts.create({
        authorId: user.id,
        content: content.trim(),
        imageUrl: imagePreview || undefined,
      });
      // Let parent refresh feed if needed
      onPost(content.trim(), imagePreview || undefined);

      success('Post created!', 'Your post has been shared successfully.');
      setContent('');
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      error('Failed to create post', 'Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('File too large', 'Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setContent(value);
    setCursorPosition(cursorPos);

    const beforeCursor = value.substring(0, cursorPos);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  const insertMention = (username: string) => {
    const beforeCursor = content.substring(0, cursorPosition);
    const afterCursor = content.substring(cursorPosition);
    const beforeMention = beforeCursor.replace(/@\w*$/, '');
    const newContent = `${beforeMention}@${username} ${afterCursor}`;
    setContent(newContent);
    setShowMentions(false);
    setMentionQuery('');
    // restore caret
    setTimeout(() => {
      textareaRef.current?.focus();
      const newCursorPos = beforeMention.length + username.length + 2;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const filteredUsers = allUsers
    .filter(
      (u) =>
        u.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        u.displayName.toLowerCase().includes(mentionQuery.toLowerCase())
    )
    .slice(0, 5);

  const getCharacterCountColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-gray-400 dark:text-gray-500';
  };
  const getProgressColor = () => {
    if (isOverLimit) return 'stroke-red-500';
    if (isNearLimit) return 'stroke-yellow-500';
    return 'stroke-purple-500';
  };
  const progressPercentage = Math.min((content.length / CHARACTER_LIMIT) * 100, 100);

  if (!user) return null;

  return (
    <div className="card mb-6 animate-fade-in">
      <div className="p-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=48`}
              alt={user.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 dark:ring-purple-800 transition-all duration-200 hover:ring-purple-300 dark:hover:ring-purple-600"
            />
          </div>

          <div className="flex-1 min-w-0 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder={placeholder}
              className="w-full resize-none border-none outline-none text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-gray-100 min-h-[60px] max-h-[200px] transition-colors duration-200"
              style={{ lineHeight: '1.4' }}
            />

            {showMentions && filteredUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-48 overflow-y-auto">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => insertMention(u.username)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${u.displayName}&background=6366f1&color=fff&size=32`}
                      alt={u.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{u.displayName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4 relative">
            <img src={imagePreview} alt="Upload preview" className="w-full max-h-64 object-cover rounded-xl" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Add photo"
              >
                <Image className="h-5 w-5" />
              </button>
              <button className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110" title="Add video">
                <Video className="h-5 w-5" />
              </button>
              <button className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110" title="Add location">
                <MapPin className="h-5 w-5" />
              </button>
              <button className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110" title="Add emoji">
                <Smile className="h-5 w-5" />
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 border-l border-gray-200 dark:border-gray-600 pl-4">
              <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110" title="Bold">
                <Bold className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110" title="Italic">
                <Italic className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {content.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-200 dark:text-gray-600" />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - Math.min((content.length / CHARACTER_LIMIT) * 100, 100) / 100)}`}
                      className={`transition-all duration-200 ${getProgressColor()}`}
                    />
                  </svg>
                  {(isNearLimit || isOverLimit) && (
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${getCharacterCountColor()}`}>
                      {remainingChars}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isEmpty || isOverLimit || isPosting}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                isEmpty || isOverLimit
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md'
              }`}
            >
              {isPosting ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Posting...</span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>

        {isOverLimit && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-bounce-in">
            <p className="text-sm text-red-600 dark:text-red-400">
              Your post is {Math.abs(remainingChars)} characters over the limit. Please shorten it to continue.
            </p>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">⌘ + Enter</kbd> to post
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
