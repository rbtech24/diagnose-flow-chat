
import { User } from "./user";

export type FeatureRequestStatus = "pending" | "in-progress" | "planned" | "completed" | "rejected" | "approved" | "implemented" | "under-review";
export type FeatureRequestPriority = "low" | "medium" | "high" | "critical";

export interface FeatureRequestUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "company" | "tech";
  avatarUrl?: string;
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: FeatureRequestUser;
  votes: FeatureRequestVote[];
  score: number;
  comments: FeatureRequestComment[];
  category?: string; // Making category optional
}
