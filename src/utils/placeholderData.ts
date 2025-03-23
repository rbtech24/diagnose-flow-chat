
import { CommunityPost } from "@/types/community";
import { FeatureRequest } from "@/types/feature-request";
import { SupportTicket } from "@/components/support/SupportTicket";
import { User } from "@/types/user";

// Empty arrays for mock data
export const emptyPosts: CommunityPost[] = [];
export const emptyFeatureRequests: FeatureRequest[] = [];
export const emptyTickets: SupportTicket[] = [];

// Empty placeholder user
export const placeholderUser: User = {
  id: "",
  name: "",
  email: "",
  role: "tech",
  avatarUrl: ""
};

// Empty service records array
export const emptyServiceRecords: any[] = [];

// Empty knowledge articles array
export const emptyKnowledgeArticles: any[] = [];
