
import { FeatureRequest } from "@/types/feature-request";
import { currentUser } from "./mockTickets";

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: "fr-1",
    title: "Mobile app for technicians",
    description: "Create a mobile app for technicians to manage repairs on the go",
    status: "pending",
    priority: "high",
    createdAt: new Date(2023, 9, 15),
    updatedAt: new Date(2023, 9, 15),
    createdBy: {
      id: "tech1",
      name: "John Smith",
      email: "john@example.com",
      role: "tech", // Fixed: Changed from string to specific union type
      avatarUrl: "/avatar-1.png",
    },
    votes: [
      {
        id: "vote-1",
        userId: "tech2",
        featureRequestId: "fr-1",
        createdAt: new Date(2023, 9, 16),
        user: {
          id: "tech2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "tech", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-2.png",
        },
      },
      {
        id: "vote-2",
        userId: "company1",
        featureRequestId: "fr-1",
        createdAt: new Date(2023, 9, 17),
        user: {
          id: "company1",
          name: "Acme Corp",
          email: "info@acme.com",
          role: "company", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-3.png",
        },
      }
    ],
    score: 2,
    comments: [
      {
        id: "comment-1",
        featureRequestId: "fr-1",
        content: "This would be very helpful for our field technicians",
        createdAt: new Date(2023, 9, 18),
        createdBy: {
          id: "company1",
          name: "Acme Corp",
          email: "info@acme.com",
          role: "company", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-3.png",
        },
      }
    ]
  },
  {
    id: "fr-2",
    title: "Integration with inventory systems",
    description: "Allow integration with popular inventory management systems",
    status: "approved",
    priority: "medium",
    createdAt: new Date(2023, 9, 10),
    updatedAt: new Date(2023, 9, 14),
    createdBy: {
      id: "company1",
      name: "Acme Corp",
      email: "info@acme.com",
      role: "company", // Fixed: Changed from string to specific union type
      avatarUrl: "/avatar-3.png",
    },
    votes: [
      {
        id: "vote-3",
        userId: "tech1",
        featureRequestId: "fr-2",
        createdAt: new Date(2023, 9, 11),
        user: {
          id: "tech1",
          name: "John Smith",
          email: "john@example.com",
          role: "tech", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-1.png",
        },
      }
    ],
    score: 1,
    comments: []
  },
  {
    id: "fr-3",
    title: "Better repair workflow automation",
    description: "Add more automation to the repair workflow to reduce manual steps",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(2023, 8, 20),
    updatedAt: new Date(2023, 9, 5),
    createdBy: currentUser,
    votes: [
      {
        id: "vote-4",
        userId: "company1",
        featureRequestId: "fr-3",
        createdAt: new Date(2023, 8, 25),
        user: {
          id: "company1",
          name: "Acme Corp",
          email: "info@acme.com",
          role: "company", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-3.png",
        },
      },
      {
        id: "vote-5",
        userId: "company2",
        featureRequestId: "fr-3",
        createdAt: new Date(2023, 8, 26),
        user: {
          id: "company2",
          name: "TechFix Inc",
          email: "info@techfix.com",
          role: "company", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-4.png",
        },
      },
      {
        id: "vote-6",
        userId: "tech2",
        featureRequestId: "fr-3",
        createdAt: new Date(2023, 8, 27),
        user: {
          id: "tech2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "tech", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-2.png",
        },
      }
    ],
    score: 3,
    comments: [
      {
        id: "comment-2",
        featureRequestId: "fr-3",
        content: "This would save us a lot of time",
        createdAt: new Date(2023, 8, 28),
        createdBy: {
          id: "tech2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          role: "tech", // Fixed: Changed from string to specific union type
          avatarUrl: "/avatar-2.png",
        },
      },
      {
        id: "comment-3",
        featureRequestId: "fr-3",
        content: "We're currently working on implementing this feature",
        createdAt: new Date(2023, 9, 5),
        createdBy: currentUser,
      }
    ]
  },
  {
    id: "fr-4",
    title: "Customer feedback system",
    description: "Add a system for customers to leave feedback on repairs",
    status: "rejected",
    priority: "low",
    createdAt: new Date(2023, 7, 15),
    updatedAt: new Date(2023, 8, 1),
    createdBy: {
      id: "company2",
      name: "TechFix Inc",
      email: "info@techfix.com",
      role: "company", // Fixed: Changed from string to specific union type
      avatarUrl: "/avatar-4.png",
    },
    votes: [],
    score: 0,
    comments: [
      {
        id: "comment-4",
        featureRequestId: "fr-4",
        content: "This feature is outside the scope of our current roadmap",
        createdAt: new Date(2023, 8, 1),
        createdBy: currentUser,
      }
    ]
  }
];
