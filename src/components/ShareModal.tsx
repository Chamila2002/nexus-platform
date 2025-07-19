import React, { useState, useRef, useEffect } from 'react';
import { X, Link, Twitter, Facebook, MessageCircle, Mail, Copy, Check } from 'lucide-react';
import { Post } from '../types';
import { useUser } from '../contexts/UserContext';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose, onShare }) => {
  const { getAllUsers } = useUser();
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const allUsers = getAllUsers();
  
  const postAuthor = allUsers.find(user => user.id === post.userId);
  const postUrl = `https://nexus.app/post/${post.id}`;

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare();
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (platform: string) => {
    const text = `Check out this post by ${postAuthor?.displayName}: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Check out this post')}&body=${encodeURIComponent(`${text}\n\n${postUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onShare();
      onClose();
    }
  };

  if (!isOpen || !postAuthor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Share Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex space-x-3">
            <img
              src={postAuthor.avatar || `https://ui-avatars.com/api/?name=${postAuthor.displayName}&background=6366f1&color=fff&size=40`}
              alt={postAuthor.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {postAuthor.displayName}
                </h3>
                <span className="text-gray-500 text-sm">@{postAuthor.username}</span>
              </div>
              <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </p>
                <p className="text-sm text-gray-500">
                  {copied ? 'Link copied to clipboard' : 'Copy link to share anywhere'}
                </p>
              </div>
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Twitter className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Share on Twitter</p>
                <p className="text-sm text-gray-500">Share with your Twitter followers</p>
              </div>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Facebook className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Share on Facebook</p>
                <p className="text-sm text-gray-500">Share with your Facebook friends</p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Share via Email</p>
                <p className="text-sm text-gray-500">Send via email</p>
              </div>
            </button>

            {/* Direct Message */}
            <button
              onClick={() => {
                onShare();
                onClose();
              }}
              className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Send via Direct Message</p>
                <p className="text-sm text-gray-500">Share privately with someone</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;