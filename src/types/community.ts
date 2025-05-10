
import { User } from "./user";

export type CommunityPostType = 'question' | 'tech-sheet-request' | 'wire-diagram-request' | 'discussion';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: CommunityPostType;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  views: number;
  isSolved: boolean;
  tags: string[];
  comments: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isAnswer: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
}
