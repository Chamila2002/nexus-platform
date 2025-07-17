export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  bio?: string;
  avatar?: string;
  followers: number;
  following: number;
  verified: boolean;
  createdAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  likedBy: string[];
  imageUrl?: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}