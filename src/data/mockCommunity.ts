
import { CommunityPost } from '@/types/community-enhanced';
import { User } from '@/types/user';

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'technician',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 'user-2', 
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b08a?w=32&h=32&fit=crop&crop=face'
  }
];

export const mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Best practices for diagnosing refrigerator compressor issues',
    content: 'I\'ve been working on refrigerator repairs for 5 years and wanted to share some tips...',
    type: 'discussion',
    authorId: 'user-1',
    author: mockUsers[0],
    attachments: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    upvotes: 12,
    views: 156,
    tags: ['refrigerator', 'compressor', 'diagnosis'],
    isSolved: false,
    isFulfilled: false,
    comments: []
  },
  {
    id: 'post-2',
    title: 'Washing machine not draining - troubleshooting steps?',
    content: 'Customer has a front-load washer that\'s not draining properly. Water remains in the drum after cycle completion...',
    type: 'question',
    authorId: 'user-2',
    author: mockUsers[1],
    attachments: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    upvotes: 8,
    views: 89,
    tags: ['washing-machine', 'drainage', 'troubleshooting'],
    isSolved: true,
    isFulfilled: false,
    comments: []
  }
];

export const mockComments = [
  {
    id: 'comment-1',
    content: 'Great tips! I\'ve found that checking the start relay first saves a lot of time.',
    postId: 'post-1',
    authorId: 'user-2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    upvotes: 3,
    isAnswer: false,
    attachments: []
  }
];

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts;
}

export async function createCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'views' | 'comments'>): Promise<CommunityPost> {
  const newPost: CommunityPost = {
    ...post,
    id: `post-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    upvotes: 0,
    views: 0,
    comments: []
  };
  
  mockPosts.unshift(newPost);
  return newPost;
}
