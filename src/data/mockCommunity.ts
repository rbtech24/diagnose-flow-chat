
import { CommunityPost } from '@/types/community';
import { User } from '@/types/user';

const mockUser: User = {
  id: 'user-1',
  name: 'John Smith',
  email: 'john@example.com',
  role: 'tech'
};

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How to diagnose intermittent electrical issues?',
    content: 'I\'m dealing with a washing machine that occasionally trips the circuit breaker. The issue happens randomly and I can\'t seem to reproduce it consistently. Any tips on systematic diagnosis?',
    type: 'question',
    authorId: 'user-1',
    author: mockUser,
    attachments: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    upvotes: 8,
    views: 45,
    tags: ['electrical', 'washing-machine', 'troubleshooting'],
    isSolved: false,
    comments: []
  }
];

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCommunityPosts;
}
