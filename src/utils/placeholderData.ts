
import { User } from "@/types/user";
import { FeatureRequest } from "@/types/feature-request";
import { KnowledgeArticle } from "@/hooks/useKnowledgeBaseData";
import { SupportTicket } from "@/types/support-ticket";

// Empty user object
export const placeholderUser: User = {
  id: "",
  name: "",
  email: "",
  role: "tech",
  phone: "",
  avatarUrl: "",
  status: "active"
};

// Empty array for feature requests
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

// Empty array for knowledge articles
export const emptyKnowledgeArticles: CompanyKnowledgeBaseArticle[] = [];

// Empty array for support tickets with the required messages array
export const emptyTickets: SupportTicket[] = [];
