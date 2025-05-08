
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority, FeatureComment, FeatureVote } from "@/types/feature-request";

// Helper function to create dates relative to now
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper function to create empty vote arrays
const createVotes = (userId: string, count: number): FeatureVote[] => {
  const votes: FeatureVote[] = [];
  for (let i = 0; i < count; i++) {
    votes.push({
      id: `vote-${userId}-${i}`,
      feature_id: userId,
      user_id: `user-${i}`,
      created_at: daysAgo(Math.floor(Math.random() * 30)).toISOString(),
    });
  }
  return votes;
};

// Mock feature requests data
export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "fr-123",
    title: "Implement dark mode",
    description: "Users have been requesting a dark mode to reduce eye strain in low-light environments.",
    status: "pending" as FeatureRequestStatus,
    priority: "high" as FeatureRequestPriority,
    created_at: daysAgo(30).toISOString(),
    updated_at: daysAgo(30).toISOString(),
    created_by: "u-123",
    company_id: null,
    votes_count: 63,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "Alice Johnson",
      email: "alice@techsolutions.com",
      role: "tech",
      avatar_url: "https://i.pravatar.cc/150?img=4"
    }
  },
  {
    id: "fr-456",
    title: "Mobile app improvements",
    description: "The mobile app needs better performance and a more intuitive UI.",
    status: "in-progress" as FeatureRequestStatus,
    priority: "medium" as FeatureRequestPriority,
    created_at: daysAgo(22).toISOString(),
    updated_at: daysAgo(22).toISOString(),
    created_by: "u-456",
    company_id: null,
    votes_count: 51,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "Bob Williams",
      email: "bob@acme.com",
      role: "company",
      avatar_url: "https://i.pravatar.cc/150?img=11"
    }
  },
  {
    id: "fr-789",
    title: "Add support for multiple languages",
    description: "Our user base is growing internationally, and we need to support multiple languages.",
    status: "approved" as FeatureRequestStatus,
    priority: "high" as FeatureRequestPriority,
    created_at: daysAgo(18).toISOString(),
    updated_at: daysAgo(18).toISOString(),
    created_by: "u-789",
    company_id: null,
    votes_count: 38,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "Carlos Rodriguez",
      role: "admin",
      email: "carlos@globaltech.com",
      avatar_url: "https://i.pravatar.cc/150?img=27"
    }
  },
  {
    id: "fr-12345",
    title: "Add batch processing for workflows",
    description: "Would be great to have the ability to process multiple workflows at once.",
    status: "pending" as FeatureRequestStatus,
    priority: "medium" as FeatureRequestPriority,
    created_at: daysAgo(15).toISOString(),
    updated_at: daysAgo(15).toISOString(),
    created_by: "u-789",
    company_id: null,
    votes_count: 42,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "John Smith",
      role: "company",
      email: "john@acmerepair.com",
      avatar_url: "https://i.pravatar.cc/150?img=58"
    }
  },
  {
    id: "fr-67890",
    title: "Improve search functionality",
    description: "The current search is too slow and doesn't provide accurate results.",
    status: "pending" as FeatureRequestStatus,
    priority: "high" as FeatureRequestPriority,
    created_at: daysAgo(8).toISOString(),
    updated_at: daysAgo(8).toISOString(),
    created_by: "u-1011",
    company_id: null,
    votes_count: 28,
    user_has_voted: false,
    comments_count: 2,
    created_by_user: {
      name: "Emily White",
      role: "tech",
      email: "emily@techfix.com",
      avatar_url: "https://i.pravatar.cc/150?img=39"
    }
  }
];

// Export a function to get feature requests
export const getFeatureRequests = () => {
  return mockFeatureRequests;
};

// Export a function to get a specific feature request by ID
export const getFeatureRequestById = (id: string) => {
  return mockFeatureRequests.find(request => request.id === id);
};
