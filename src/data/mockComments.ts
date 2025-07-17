import { Comment } from '../types';

export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    postId: '1',
    content: 'Great work on the new feature! The TypeScript integration looks solid. 🚀',
    likes: 3,
    likedBy: ['1', '3'],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '2',
    userId: '3',
    postId: '1',
    content: 'I love how clean the component architecture is. Any plans to open source this?',
    likes: 1,
    likedBy: ['1'],
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '3',
    userId: '4',
    postId: '1',
    content: 'This is exactly what I needed for my project. Thanks for sharing! 💯',
    likes: 2,
    likedBy: ['1', '2'],
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: '4',
    userId: '1',
    postId: '2',
    content: 'Absolutely stunning shot! The lighting is perfect. What camera did you use?',
    likes: 5,
    likedBy: ['2', '3', '4', '5'],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: '5',
    userId: '5',
    postId: '2',
    content: 'This makes me want to visit the beach right now! 🌊',
    likes: 2,
    likedBy: ['1', '2'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '6',
    userId: '4',
    postId: '3',
    content: 'Design systems are so important for consistency. Looking forward to seeing the final result!',
    likes: 4,
    likedBy: ['1', '2', '3', '5'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
];

let commentIdCounter = 7;

export const createComment = (userId: string, postId: string, content: string): Comment => {
  const newComment: Comment = {
    id: commentIdCounter.toString(),
    userId,
    postId,
    content,
    likes: 0,
    likedBy: [],
    createdAt: new Date(),
  };
  
  commentIdCounter++;
  return newComment;
};