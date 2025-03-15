
import { User } from "./user";

export type FeatureRequestStatus = "pending" | "approved" | "rejected" | "in-progress" | "completed";

export type FeatureRequestPriority = "low" | "medium" | "high" | "critical";

export interface FeatureRequestVote {
  id: string;
  userId: string;
  featureRequestId: string;
  createdAt: Date;
  user: User;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  priority: FeatureRequestPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  votes: FeatureRequestVote[];
  score: number;
  comments: FeatureRequestComment[];
}

export interface FeatureRequestComment {
  id: string;
  featureRequestId: string;
  content: string;
  createdAt: Date;
  createdBy: User;
}
