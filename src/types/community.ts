
import { User } from './user';

export type CommunityPostType = 'question' | 'discussion' | 'tech-sheet-request' | 'wire-diagram-request';

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt?: Date;
  uploadedBy?: string;
}

export interface CommunityPostComment {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email?: string; // Make email optional
    role?: 'admin' | 'company' | 'tech';
    avatarUrl?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isAnswer?: boolean;
  upvotes?: number; // Add upvotes property
  attachments?: Attachment[]; // Add attachments property
  postId?: string; // Add postId for reference
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: CommunityPostType;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'company' | 'tech';
    avatarUrl?: string;
  };
  attachments: {
    id: string;
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  upvotes: number;
  views: number;
  isSolved?: boolean;
  isFulfilled?: boolean;
  knowledgeBaseArticleId?: string; // Link to KB article if this request was fulfilled
  comments: CommunityPostComment[];
}
