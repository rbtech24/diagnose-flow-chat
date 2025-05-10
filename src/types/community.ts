
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

// Feature request related types
export type FeatureRequestStatus = 'pending' | 'submitted' | 'approved' | 'in-progress' | 'completed' | 'rejected';
export type FeatureRequestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: FeatureRequestPriority;
  company_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  votes_count: number;
  user_has_voted: boolean;
  comments_count: number;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export interface FeatureComment {
  id: string;
  feature_id: string;
  content: string;
  user_id?: string;
  created_at: string;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}
