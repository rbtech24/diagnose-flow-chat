
import { User } from './user';

export type FeatureRequestStatus = 
  | 'pending'
  | 'approved' 
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'planned'
  | 'implemented'
  | 'under-review';

export type FeatureRequestPriority = 'low' | 'medium' | 'high' | 'critical';

// Simplified User type for feature requests
export interface FeatureRequestUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface FeatureRequestVote {
  id: string;
  userId: string;
  featureRequestId: string;
  createdAt: Date;
  user: FeatureRequestUser;
}

export interface FeatureRequestComment {
  id: string;
  featureRequestId: string;
  content: string;
  createdAt: Date;
  createdBy: FeatureRequestUser;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: FeatureRequestPriority;
  score: number;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: FeatureRequestUser;
  votes: FeatureRequestVote[];
  comments: FeatureRequestComment[];
}

// Helper function to convert a User to a FeatureRequestUser
export function convertToFeatureRequestUser(user: User): FeatureRequestUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    status: (user.status === 'archived' || user.status === 'deleted') ? 
      'inactive' : (user.status as 'active' | 'inactive' | 'pending')
  };
}
