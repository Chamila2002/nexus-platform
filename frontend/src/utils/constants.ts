export const APP_NAME = 'Nexus';

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  EXPLORE: '/explore',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  POSTS: '/api/posts',
  USERS: '/api/users',
  COMMENTS: '/api/comments',
} as const;

export const COLORS = {
  primary: '#7C3AED',
  secondary: '#2563EB',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
} as const;