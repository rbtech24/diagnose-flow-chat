
export type FeatureRequestStatus = "pending" | "approved" | "rejected" | "in-progress" | "completed" | "submitted";
export type FeatureRequestPriority = "low" | "medium" | "high" | "critical";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  avatar_url?: string;
}

// Updated to match the Supabase database structure
export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority?: FeatureRequestPriority;
  company_id?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  
  // These are added by client-side counting or joins
  votes_count?: number;
  user_has_voted?: boolean;
  comments_count?: number;
  
  // This is a relationship field
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
  user_id: string;
  content: string;
  created_at: string;
  
  // This is a relationship field
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export interface FeatureVote {
  id: string;
  feature_id: string;
  user_id: string;
  created_at: string;
  user?: User;
}
