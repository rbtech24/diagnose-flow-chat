
import { User } from "@/types/user";
import { FeatureRequest } from "@/types/feature-request";
import { KnowledgeArticle } from "@/hooks/useKnowledgeBaseData";
import { SupportTicket } from "@/types/support-ticket";

export const placeholderUser: User = {
  id: "user-123",
  name: "Demo User",
  email: "demo@example.com",
  role: "tech",
  phone: "(555) 123-4567",
  avatarUrl: "https://i.pravatar.cc/300",
  status: "active"
};

// Add empty arrays for feature requests
export const emptyFeatureRequests: FeatureRequest[] = [];

// Add empty arrays for knowledge articles
export const emptyKnowledgeArticles: KnowledgeArticle[] = [];

// Add empty arrays for support tickets
export const emptyTickets: SupportTicket[] = [];
