
import { User } from './user';

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface CommunityComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  author: User;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isAnswer: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: 'question' | 'discussion' | 'resource';
  authorId: string;
  author: User;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  views: number;
  tags: string[];
  isSolved: boolean;
  isFulfilled: boolean;
  comments: CommunityComment[];
  knowledgeBaseArticleId?: string;
}
