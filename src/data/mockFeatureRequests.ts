
import { FeatureRequest, FeatureRequestComment, FeatureRequestPriority, FeatureRequestStatus, FeatureRequestVote } from "@/types/feature-request";
import { User } from "@/types/user";

// Helper function to create dates relative to now
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper function to create empty vote arrays
const createVotes = (userId: string, count: number): FeatureRequestVote[] => {
  const votes: FeatureRequestVote[] = [];
  for (let i = 0; i < count; i++) {
    votes.push({
      id: `vote-${userId}-${i}`,
      userId: `user-${i}`,
      featureRequestId: userId,
      createdAt: daysAgo(Math.floor(Math.random() * 30)),
      user: {
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: i % 3 === 0 ? "tech" : i % 3 === 1 ? "company" : "admin",
        avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`
      }
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
    votes: createVotes("fr-123", 63),
    score: 63,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
    createdBy: {
      id: "u-123",
      name: "Alice Johnson",
      role: "tech",
      email: "alice@techsolutions.com",
      avatarUrl: "https://i.pravatar.cc/150?img=4"
    },
    comments: [
      {
        id: "c-1",
        featureRequestId: "fr-123",
        content: "Yes, please! My eyes hurt at night.",
        createdAt: daysAgo(29),
        createdBy: {
          id: "u-456",
          name: "Bob Williams",
          role: "company",
          email: "bob@acme.com",
          avatarUrl: "https://i.pravatar.cc/150?img=11"
        }
      },
      {
        id: "c-2",
        featureRequestId: "fr-123",
        content: "We'll look into it!",
        createdAt: daysAgo(28),
        createdBy: {
          id: "u-789",
          name: "Admin User",
          role: "admin",
          email: "admin@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=12"
        }
      }
    ]
  },
  {
    id: "fr-456",
    title: "Mobile app improvements",
    description: "The mobile app needs better performance and a more intuitive UI.",
    status: "in-progress" as FeatureRequestStatus,
    priority: "medium" as FeatureRequestPriority,
    votes: createVotes("fr-456", 51),
    score: 51,
    createdAt: daysAgo(22),
    updatedAt: daysAgo(22),
    createdBy: {
      id: "u-456",
      name: "Bob Williams",
      role: "company",
      email: "bob@acme.com",
      avatarUrl: "https://i.pravatar.cc/150?img=11"
    },
    comments: [
      {
        id: "c-3",
        featureRequestId: "fr-456",
        content: "The app crashes frequently on my device.",
        createdAt: daysAgo(21),
        createdBy: {
          id: "u-123",
          name: "Alice Johnson",
          role: "tech",
          email: "alice@techsolutions.com",
          avatarUrl: "https://i.pravatar.cc/150?img=4"
        }
      },
      {
        id: "c-4",
        featureRequestId: "fr-456",
        content: "We're working on a fix for the crashes.",
        createdAt: daysAgo(20),
        createdBy: {
          id: "u-789",
          name: "Admin User",
          role: "admin",
          email: "admin@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=12"
        }
      }
    ]
  },
  {
    id: "fr-789",
    title: "Add support for multiple languages",
    description: "Our user base is growing internationally, and we need to support multiple languages.",
    status: "approved" as FeatureRequestStatus,
    priority: "high" as FeatureRequestPriority,
    votes: createVotes("fr-789", 38),
    score: 38,
    createdAt: daysAgo(18),
    updatedAt: daysAgo(18),
    createdBy: {
      id: "u-789",
      name: "Carlos Rodriguez",
      role: "admin",
      email: "carlos@globaltech.com",
      avatarUrl: "https://i.pravatar.cc/150?img=27"
    },
    comments: [
      {
        id: "c-5",
        featureRequestId: "fr-789",
        content: "This is essential for our expansion!",
        createdAt: daysAgo(17),
        createdBy: {
          id: "u-456",
          name: "Bob Williams",
          role: "company",
          email: "bob@acme.com",
          avatarUrl: "https://i.pravatar.cc/150?img=11"
        }
      },
      {
        id: "c-6",
        featureRequestId: "fr-789",
        content: "We're planning to start with Spanish and French.",
        createdAt: daysAgo(16),
        createdBy: {
          id: "u-789",
          name: "Carlos Rodriguez",
          role: "admin",
          email: "carlos@globaltech.com",
          avatarUrl: "https://i.pravatar.cc/150?img=27"
        }
      }
    ]
  },
  {
    id: "fr-12345",
    title: "Add batch processing for workflows",
    description: "Would be great to have the ability to process multiple workflows at once.",
    status: "pending" as FeatureRequestStatus,
    priority: "medium" as FeatureRequestPriority,
    votes: createVotes("fr-12345", 42),
    score: 42,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
    createdBy: {
      id: "u-789",
      name: "John Smith",
      role: "company",
      email: "john@acmerepair.com",
      avatarUrl: "https://i.pravatar.cc/150?img=58"
    },
    comments: [
      {
        id: "c-123",
        featureRequestId: "fr-12345",
        content: "This would save us so much time!",
        createdAt: daysAgo(14),
        createdBy: {
          id: "u-456",
          name: "Sarah Johnson",
          role: "tech",
          email: "sarah@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=23"
        }
      },
      {
        id: "c-456",
        featureRequestId: "fr-12345",
        content: "We're looking into this feature. It's high on our priority list.",
        createdAt: daysAgo(10),
        createdBy: {
          id: "u-999",
          name: "Admin User",
          role: "admin",
          email: "admin@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=15"
        }
      }
    ]
  },
  {
    id: "fr-67890",
    title: "Improve search functionality",
    description: "The current search is too slow and doesn't provide accurate results.",
    status: "pending" as FeatureRequestStatus,
    priority: "high" as FeatureRequestPriority,
    votes: createVotes("fr-67890", 28),
    score: 28,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
    createdBy: {
      id: "u-1011",
      name: "Emily White",
      role: "tech",
      email: "emily@techfix.com",
      avatarUrl: "https://i.pravatar.cc/150?img=39"
    },
    comments: [
      {
        id: "c-789",
        featureRequestId: "fr-67890",
        content: "I can never find what I'm looking for!",
        createdAt: daysAgo(7),
        createdBy: {
          id: "u-1213",
          name: "David Lee",
          role: "company",
          email: "david@premier.com",
          avatarUrl: "https://i.pravatar.cc/150?img=42"
        }
      },
      {
        id: "c-101",
        featureRequestId: "fr-67890",
        content: "We're analyzing the search algorithms to improve performance.",
        createdAt: daysAgo(5),
        createdBy: {
          id: "u-999",
          name: "Admin User",
          role: "admin",
          email: "admin@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=15"
        }
      }
    ]
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
