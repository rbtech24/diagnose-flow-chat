
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

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: User;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  score: number;
  votes: FeatureRequestVote[];
  comments: FeatureRequestComment[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}
