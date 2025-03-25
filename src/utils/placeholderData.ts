
import { CommunityPost } from "@/types/community";
import { FeatureRequest } from "@/types/feature-request";
import { SupportTicket } from "@/components/support/SupportTicket";
import { User } from "@/types/user";

// Empty arrays instead of mock data
export const emptyPosts: CommunityPost[] = [];
export const emptyFeatureRequests: FeatureRequest[] = [];
export const emptyTickets: SupportTicket[] = [];

// Get role from localStorage if available, otherwise default to 'tech'
const getUserRoleFromStorage = (): 'admin' | 'company' | 'tech' => {
  const storedRole = localStorage.getItem('userRole');
  if (storedRole === 'admin' || storedRole === 'company' || storedRole === 'tech') {
    return storedRole;
  }
  return 'tech'; // Default role if none is stored
};

// Current user placeholder with role from localStorage
export const placeholderUser: User = {
  id: "current-user",
  name: "Current User",
  email: "user@example.com",
  role: getUserRoleFromStorage(),
  avatarUrl: ""
};

// Empty service records array
export const emptyServiceRecords: any[] = [];

// Empty knowledge articles array
export const emptyKnowledgeArticles: any[] = [];
