
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

// Define knowledge article type that matches the CompanyKnowledgeBase component's expectations
export interface CompanyKnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  type: 'guide' | 'manual' | 'faq' | 'link' | 'troubleshooting' | 'tech-sheet' | 'service-manual' | 'wire-diagram' | 'technical-alert' | 'misc-document';
  excerpt: string;
  fromCommunityPost?: string;
}

// Add empty arrays for knowledge articles
export const emptyKnowledgeArticles: CompanyKnowledgeBaseArticle[] = [];

// Add empty arrays for support tickets with the required messages array
export const emptyTickets: SupportTicket[] = [];
