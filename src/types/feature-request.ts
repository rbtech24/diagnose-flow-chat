
import { Database } from "@/integrations/supabase/types";

export type FeatureRequestStatus = "pending" | "approved" | "rejected" | "in-progress" | "completed";
export type FeatureRequestPriority = "low" | "medium" | "high" | "critical";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  avatarUrl?: string;
}

export type FeatureRequest = Database["public"]["Tables"]["feature_requests"]["Row"] & {
  votes_count: number;
  user_has_voted?: boolean;
  comments_count: number;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
};

export type FeatureComment = Database["public"]["Tables"]["feature_comments"]["Row"] & {
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
};

export type FeatureVote = Database["public"]["Tables"]["feature_votes"]["Row"];
