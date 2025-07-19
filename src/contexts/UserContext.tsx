import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers, getCurrentUser } from '../data/mockUsers';

interface UserContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => void;
  getAllUsers: () => User[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getUserById: (userId: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = () => {
      const storedUserId = localStorage.getItem('nexus_current_user_id');
      if (storedUserId) {
        const user = mockUsers.find(u => u.id === storedUserId);
        if (user) {
          setCurrentUser(user);
        }
      } else {
        // Default to first user for demo purposes
        setCurrentUser(getCurrentUser());
        localStorage.setItem('nexus_current_user_id', getCurrentUser().id);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('nexus_current_user_id', userId);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_current_user_id');
  };

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('nexus_current_user_id', userId);
    }
  };

  const getAllUsers = () => mockUsers;

  const followUser = (userId: string) => {
    if (!currentUser || userId === currentUser.id) return;
    
    // Update the target user's followers
    const targetUserIndex = mockUsers.findIndex(u => u.id === userId);
    if (targetUserIndex !== -1) {
      if (!mockUsers[targetUserIndex].followedBy.includes(currentUser.id)) {
        mockUsers[targetUserIndex].followedBy.push(currentUser.id);
        mockUsers[targetUserIndex].followers += 1;
      }
    }
    
    // Update current user's following count
    const currentUserIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (currentUserIndex !== -1) {
      mockUsers[currentUserIndex].following += 1;
      setCurrentUser({ ...mockUsers[currentUserIndex] });
    }
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser || userId === currentUser.id) return;
    
    // Update the target user's followers
    const targetUserIndex = mockUsers.findIndex(u => u.id === userId);
    if (targetUserIndex !== -1) {
      const followIndex = mockUsers[targetUserIndex].followedBy.indexOf(currentUser.id);
      if (followIndex !== -1) {
        mockUsers[targetUserIndex].followedBy.splice(followIndex, 1);
        mockUsers[targetUserIndex].followers = Math.max(0, mockUsers[targetUserIndex].followers - 1);
      }
    }
    
    // Update current user's following count
    const currentUserIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (currentUserIndex !== -1) {
      mockUsers[currentUserIndex].following = Math.max(0, mockUsers[currentUserIndex].following - 1);
      setCurrentUser({ ...mockUsers[currentUserIndex] });
    }
  };

  const isFollowing = (userId: string): boolean => {
    if (!currentUser) return false;
    const targetUser = mockUsers.find(u => u.id === userId);
    return targetUser ? targetUser.followedBy.includes(currentUser.id) : false;
  };

  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(u => u.id === userId);
  };

  const value: UserContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    switchUser,
    getAllUsers,
    followUser,
    unfollowUser,
    isFollowing,
    getUserById,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};