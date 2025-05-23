
export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: FeatureRequestPriority;
  company_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  votes_count: number;
  user_has_voted: boolean;
  comments_count: number;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: "admin" | "company" | "tech";
  };
}

export type FeatureRequestStatus = 'pending' | 'submitted' | 'approved' | 'in-progress' | 'completed' | 'rejected';
export type FeatureRequestPriority = 'low' | 'medium' | 'high' | 'critical';

export interface FeatureComment {
  id: string;
  feature_id: string;
  user_id: string;
  content: string;
  created_at: string;
  created_by_user?: {
    name: string;
    email: string;
    role: "admin" | "company" | "tech";
    avatar_url?: string;
  };
}
