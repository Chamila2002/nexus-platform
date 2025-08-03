import React, { useState, useRef, useEffect } from 'react';
import { Image, Video, Calendar, MapPin, Smile, Bold, Italic } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import LoadingSpinner from './LoadingSpinner';

interface PostCreatorProps {
  onPost: (content: string) => void;
  placeholder?: string;
}

const PostCreator: React.FC<PostCreatorProps> = ({ 
  onPost, 
  placeholder = "What's happening?" 
}) => {
  const { currentUser } = useUser();
  const { success, error } = useToast();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const CHARACTER_LIMIT = 280;
  const remainingChars = CHARACTER_LIMIT - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars > 0;
  const isEmpty = content.trim().length === 0;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = async () => {
    if (isEmpty || isOverLimit || !currentUser) return;
    
    setIsPosting(true);
    try {
      onPost(content.trim());
      success('Post created!', 'Your post has been shared successfully.');
      setContent('');
    } catch (err) {
      error('Failed to create post', 'Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getCharacterCountColor = () => {
    if (isOverLimit) return 'text-red-500';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getProgressColor = () => {
    if (isOverLimit) return 'stroke-red-500';
    if (isNearLimit) return 'stroke-yellow-500';
    return 'stroke-purple-500';
  };

  const progressPercentage = Math.min((content.length / CHARACTER_LIMIT) * 100, 100);

  if (!currentUser) return null;

  return (
    <div className="card mb-6 animate-fade-in">
      <div className="p-6">
        {/* User Avatar and Input */}
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=6366f1&color=fff&size=48`}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 dark:ring-purple-800 transition-all duration-200 hover:ring-purple-300 dark:hover:ring-purple-600"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full resize-none border-none outline-none text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-gray-100 min-h-[60px] max-h-[200px] transition-colors duration-200"
              style={{ lineHeight: '1.4' }}
            />
          </div>
        </div>

        {/* Formatting Options */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Media Options */}
            <div className="flex items-center space-x-3">
              <button 
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Add photo"
              >
                <Image className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Add video"
              >
                <Video className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Add location"
              >
                <MapPin className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {/* Formatting Options */}
            <div className="hidden sm:flex items-center space-x-2 border-l border-gray-200 pl-4">
              <button 
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button 
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200 hover:scale-110"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Character Count and Post Button */}
          <div className="flex items-center space-x-4">
            {/* Character Counter */}
            {content.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200 dark:text-gray-600"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - progressPercentage / 100)}`}
                      className={`transition-all duration-200 ${getProgressColor()}`}
                    />
                  </svg>
                  {isNearLimit || isOverLimit ? (
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${getCharacterCountColor()}`}>
                      {remainingChars}
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            {/* Post Button */}
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

        {/* Character limit warning */}
        {isOverLimit && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-bounce-in">
            <p className="text-sm text-red-600 dark:text-red-400">
              Your post is {Math.abs(remainingChars)} characters over the limit. Please shorten it to continue.
            </p>
          </div>
        )}

        {/* Keyboard shortcut hint */}
        <div className="mt-3 text-xs text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">⌘ + Enter</kbd> to post
        </div>
      </div>
    </div>
  );
};

export default PostCreator;