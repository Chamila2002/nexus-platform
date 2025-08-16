import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save } from 'lucide-react';
import { User } from '../types';
import { useUser } from '../contexts/UserContext';

import { mockUsers } from '../data/mockUsers';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose }) => {
  const { currentUser } = useUser();
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    bio: user.bio || '',
    username: user.username,
  });
  const [isSaving, setIsSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  const BIO_LIMIT = 160;
  const remainingBioChars = BIO_LIMIT - formData.bio.length;
  const isBioOverLimit = remainingBioChars < 0;

  // Auto-resize bio textarea
  useEffect(() => {
    const textarea = bioTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [formData.bio]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (isBioOverLimit || !currentUser) return;
    
    setIsSaving(true);
    try {
      // Update the user in mockUsers array
      const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          displayName: formData.displayName,
          username: formData.username,
          bio: formData.bio,
        };
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = formData.displayName.trim().length > 0 && 
                     formData.username.trim().length > 0 && 
                     !isBioOverLimit;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all flex items-center space-x-2 ${
              !isFormValid || isSaving
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Cover Photo Section */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600 relative">
              <button className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-40 transition-colors group">
                <div className="bg-black bg-opacity-50 rounded-full p-3 group-hover:bg-opacity-70 transition-colors">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </button>
            </div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.displayName}&background=6366f1&color=fff&size=128`}
                  alt={user.displayName}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-colors group">
                  <div className="bg-black bg-opacity-50 rounded-full p-2 group-hover:bg-opacity-70 transition-colors">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="pt-20 p-6 space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                placeholder="Your display name"
                maxLength={50}
              />
              <div className="text-right text-sm text-gray-400 mt-1">
                {formData.displayName.length}/50
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                  placeholder="username"
                  maxLength={15}
                />
              </div>
              <div className="text-right text-sm text-gray-400 mt-1">
                {formData.username.length}/15
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                ref={bioTextareaRef}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none min-h-[80px] max-h-[120px]"
                placeholder="Tell people about yourself..."
                maxLength={BIO_LIMIT}
              />
              <div className={`text-right text-sm mt-1 ${
                isBioOverLimit ? 'text-red-500' : remainingBioChars <= 20 ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {remainingBioChars} characters remaining
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Profile Information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Joined:</span>
                  <span>{user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Followers:</span>
                  <span>{user.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Following:</span>
                  <span>{user.following.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;