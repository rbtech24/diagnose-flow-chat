
import { CommunityPost, CommunityComment } from "@/types/community";

// Mock current user - should be replaced with actual auth context
export const currentUser = {
  id: "",
  name: "",
  email: "",
  role: "tech",
  avatarUrl: ""
};

// Mock posts - should be replaced with real data from database
export const mockPosts: CommunityPost[] = [];

export const mockComments: CommunityComment[] = [];

// TODO: These should be replaced with real API calls to Supabase
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  console.warn('getCommunityPosts: Using mock data - implement real database fetching');
  return mockPosts;
};

export const getCommunityComments = async (postId: string): Promise<CommunityComment[]> => {
  console.warn('getCommunityComments: Using mock data - implement real database fetching');
  return mockComments.filter(comment => comment.postId === postId);
};
