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

  const value: UserContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    switchUser,
    getAllUsers,
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