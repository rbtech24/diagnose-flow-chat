
export type UserRole = 'admin' | 'company' | 'tech';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface FeatureRequestVote {
  id: string;
  userId: string;
  featureRequestId: string;
  createdAt: Date;
  user: User;
}

export interface FeatureRequestComment {
  id: string;
  featureRequestId: string;
  content: string;
  createdAt: Date;
  createdBy: User;
}

export type FeatureRequestStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'implemented'
  | 'planned'
  | 'in-progress'
  | 'completed'
  | 'under-review';

export type FeatureRequestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: User;
  user?: User; // Added for backward compatibility
  status: FeatureRequestStatus;
  score: number;
  votes: FeatureRequestVote[];
  comments: FeatureRequestComment[];
  priority: FeatureRequestPriority;
  category?: string;
  userId?: string;
}
