
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
