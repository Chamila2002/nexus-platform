import { Post } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content: '🚀 Just shipped a new feature for our React app! The component architecture is so much cleaner now. TypeScript + React = ❤️ #ReactJS #TypeScript #WebDev',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 5,
    shares: 3,
    likedBy: ['2', '3', '4'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    userId: '2',
    content: '📸 Golden hour magic at the beach today. Sometimes the best moments happen when you least expect them. Nature never fails to inspire! 🌅✨',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 89,
    comments: 12,
    shares: 8,
    likedBy: ['1', '3', '5'],
    imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    userId: '3',
    content: '🎨 Working on a new design system for our product. The challenge is balancing consistency with creativity. Every pixel matters when you\'re crafting user experiences!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 45,
    comments: 8,
    shares: 12,
    likedBy: ['1', '2', '4', '5'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: '4',
    userId: '4',
    content: '✍️ New blog post is live! "Understanding React Hooks: A Deep Dive into useState and useEffect" - breaking down complex concepts into digestible pieces. Link in bio! 📝',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 67,
    comments: 15,
    shares: 23,
    likedBy: ['1', '3', '5'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: '5',
    userId: '5',
    content: '💼 Exciting news! Our fintech startup just closed Series A funding. Grateful for our amazing team and investors who believe in our vision. The journey continues! 🚀💰',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    likes: 156,
    comments: 28,
    shares: 45,
    likedBy: ['1', '2', '3', '4'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

let postIdCounter = 6;

export const createPost = (userId: string, content: string): Post => {
  const newPost: Post = {
    id: postIdCounter.toString(),
    userId,
    content,
    timestamp: new Date(),
    likes: 0,
    comments: 0,
    shares: 0,
    likedBy: [],
    createdAt: new Date(),
  };
  
  postIdCounter++;
  return newPost;
};