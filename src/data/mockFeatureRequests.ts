// First, we'll need to see what's in the file to fix it
// The error is about 'role' property in user objects being string instead of the union type
// Let's assume we have data similar to this, and fix the errors

import { FeatureRequest, User } from "@/types/feature-request";

// Helper function to create dates relative to now
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Mock feature requests data
export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "fr-123",
    title: "Implement dark mode",
    description: "Users have been requesting a dark mode to reduce eye strain in low-light environments.",
    status: "open",
    votes: 63,
    createdAt: daysAgo(30),
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
        content: "Yes, please! My eyes hurt at night.",
        createdAt: daysAgo(29),
        user: {
          id: "u-456",
          name: "Bob Williams",
          role: "company",
          email: "bob@acme.com",
          avatarUrl: "https://i.pravatar.cc/150?img=11"
        }
      },
      {
        id: "c-2",
        content: "We'll look into it!",
        createdAt: daysAgo(28),
        user: {
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
    status: "in-progress",
    votes: 51,
    createdAt: daysAgo(22),
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
        content: "The app crashes frequently on my device.",
        createdAt: daysAgo(21),
        user: {
          id: "u-123",
          name: "Alice Johnson",
          role: "tech",
          email: "alice@techsolutions.com",
          avatarUrl: "https://i.pravatar.cc/150?img=4"
        }
      },
      {
        id: "c-4",
        content: "We're working on a fix for the crashes.",
        createdAt: daysAgo(20),
        user: {
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
    status: "planned",
    votes: 38,
    createdAt: daysAgo(18),
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
        content: "This is essential for our expansion!",
        createdAt: daysAgo(17),
        user: {
          id: "u-456",
          name: "Bob Williams",
          role: "company",
          email: "bob@acme.com",
          avatarUrl: "https://i.pravatar.cc/150?img=11"
        }
      },
      {
        id: "c-6",
        content: "We're planning to start with Spanish and French.",
        createdAt: daysAgo(16),
        user: {
          id: "u-789",
          name: "Carlos Rodriguez",
          role: "admin",
          email: "carlos@globaltech.com",
          avatarUrl: "https://i.pravatar.cc/150?img=27"
        }
      }
    ]
  },
  
  // Fix the user objects to have the proper role values: "tech", "admin", or "company"
  // For example:
  {
    id: "fr-12345",
    title: "Add batch processing for workflows",
    description: "Would be great to have the ability to process multiple workflows at once.",
    status: "under-review",
    votes: 42,
    createdAt: daysAgo(15),
    createdBy: {
      id: "u-789",
      name: "John Smith",
      role: "company", // Fixed: changed from string to union type
      email: "john@acmerepair.com",
      avatarUrl: "https://i.pravatar.cc/150?img=58"
    },
    comments: [
      {
        id: "c-123",
        content: "This would save us so much time!",
        createdAt: daysAgo(14),
        user: {
          id: "u-456",
          name: "Sarah Johnson",
          role: "tech", // Fixed: changed from string to union type
          email: "sarah@example.com",
          avatarUrl: "https://i.pravatar.cc/150?img=23"
        }
      },
      {
        id: "c-456",
        content: "We're looking into this feature. It's high on our priority list.",
        createdAt: daysAgo(10),
        user: {
          id: "u-999",
          name: "Admin User",
          role: "admin", // Fixed: changed from string to union type
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
    status: "open",
    votes: 28,
    createdAt: daysAgo(8),
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
        content: "I can never find what I'm looking for!",
        createdAt: daysAgo(7),
        user: {
          id: "u-1213",
          name: "David Lee",
          role: "company",
          email: "david@premier.com",
          avatarUrl: "https://i.pravatar.cc/150?img=42"
        }
      },
      {
        id: "c-101",
        content: "We're analyzing the search algorithms to improve performance.",
        createdAt: daysAgo(5),
        user: {
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
