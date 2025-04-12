
import { User as AppUser } from './user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface FeatureRequestComment {
  id: string;
  featureRequestId: string;
  content: string;
  createdAt: Date;
  createdBy: User;
}

export interface FeatureRequestVote {
  id: string;
  featureRequestId: string;
  userId: string;
  createdAt?: Date;
  user?: User;
}

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

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: FeatureRequestPriority;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  user?: User; // Adding this for backward compatibility
  userId?: string; // Some components might use this
  comments: FeatureRequestComment[];
  votes: FeatureRequestVote[];
  category?: string;
  assignedTo?: User;
}

// Helper function to convert AppUser to FeatureRequest User
export function convertToFeatureRequestUser(user: AppUser): User {
  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || '',
    status: (user.status || 'active') as 'active' | 'inactive' | 'pending'
  };
}
