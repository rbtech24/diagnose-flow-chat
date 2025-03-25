
import { CommunityPost } from "@/types/community";
import { FeatureRequest } from "@/types/feature-request";
import { SupportTicket } from "@/components/support/SupportTicket";
import { User } from "@/types/user";

// Empty arrays instead of mock data
export const emptyPosts: CommunityPost[] = [];
export const emptyFeatureRequests: FeatureRequest[] = [];
export const emptyTickets: SupportTicket[] = [];

// Current user placeholder - now with configurable role
export const placeholderUser: User = {
  id: "current-user",
  name: "Current User",
  email: "user@example.com",
  role: "tech", // This will be overridden if a role is stored in localStorage
  avatarUrl: ""
};

// Empty service records array
export const emptyServiceRecords: any[] = [];

// Empty knowledge articles array
export const emptyKnowledgeArticles: any[] = [];
