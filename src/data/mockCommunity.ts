
import { CommunityPost, CommunityComment, Attachment } from "@/types/community";

export const currentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  role: "tech",
  avatarUrl: "/lovable-uploads/0fb2afe9-44dd-487d-b13a-f6a2c630c477.png"
} as const;

export const mockAttachments: Attachment[] = [
  {
    id: "attachment-1",
    fileName: "refrigerator-schematic.pdf",
    fileUrl: "/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png",
    fileType: "application/pdf",
    fileSize: 2500000,
    uploadedAt: new Date(2023, 10, 15),
    uploadedBy: "user-2"
  },
  {
    id: "attachment-2",
    fileName: "washing-machine-error-codes.jpg",
    fileUrl: "/lovable-uploads/7e681dc0-4482-451f-9178-70944b120422.png",
    fileType: "image/jpeg",
    fileSize: 1200000,
    uploadedAt: new Date(2023, 11, 5),
    uploadedBy: "user-3"
  },
  {
    id: "attachment-3",
    fileName: "dishwasher-wiring-diagram.pdf",
    fileUrl: "/lovable-uploads/83ff694d-eb6c-4d23-9e13-2f1b96f3258e.png",
    fileType: "application/pdf",
    fileSize: 3100000,
    uploadedAt: new Date(2023, 11, 20),
    uploadedBy: "user-4"
  }
];

export const mockComments: CommunityComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    content: "Have you checked the compressor relay? That's often the issue with these models.",
    authorId: "user-2",
    author: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "tech",
      avatarUrl: "/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png"
    },
    attachments: [],
    createdAt: new Date(2023, 11, 1, 14, 30),
    updatedAt: new Date(2023, 11, 1, 14, 30),
    upvotes: 5,
    isAnswer: false
  },
  {
    id: "comment-2",
    postId: "post-1",
    content: "I had the same issue last week. It was the defrost timer that failed. I've attached the service bulletin that helped me diagnose it.",
    authorId: "user-3",
    author: {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "tech",
      avatarUrl: ""
    },
    attachments: [mockAttachments[0]],
    createdAt: new Date(2023, 11, 1, 16, 45),
    updatedAt: new Date(2023, 11, 1, 16, 45),
    upvotes: 12,
    isAnswer: true
  }
];

export const mockPosts: CommunityPost[] = [
  {
    id: "post-1",
    title: "Samsung RF28 refrigerator not cooling properly",
    content: "I'm working on a Samsung RF28 refrigerator that's not cooling properly. The freezer section works fine, but the refrigerator section stays warm. I've checked the damper and it seems to be working. Any suggestions?",
    type: "question",
    authorId: "user-1",
    author: currentUser,
    attachments: [],
    createdAt: new Date(2023, 11, 1, 10, 15),
    updatedAt: new Date(2023, 11, 1, 10, 15),
    upvotes: 8,
    views: 120,
    isSolved: true,
    tags: ["Samsung", "Refrigerator", "Cooling Issue"],
    comments: mockComments
  },
  {
    id: "post-2",
    title: "Need tech sheet for LG WM3500 washing machine",
    content: "I'm looking for the technical sheet for an LG WM3500 washing machine. Anyone have it or know where I can find it?",
    type: "tech-sheet-request",
    authorId: "user-3",
    author: {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "tech",
      avatarUrl: ""
    },
    attachments: [],
    createdAt: new Date(2023, 11, 2, 9, 0),
    updatedAt: new Date(2023, 11, 2, 9, 0),
    upvotes: 3,
    views: 45,
    tags: ["LG", "Washing Machine", "Tech Sheet"],
    comments: []
  },
  {
    id: "post-3",
    title: "Wire diagram for GE Profile dishwasher PDT845",
    content: "Could someone share the wiring diagram for a GE Profile dishwasher model PDT845? I'm troubleshooting a control board issue.",
    type: "wire-diagram-request",
    authorId: "user-2",
    author: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "tech",
      avatarUrl: "/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png"
    },
    attachments: [],
    createdAt: new Date(2023, 11, 3, 13, 20),
    updatedAt: new Date(2023, 11, 3, 13, 20),
    upvotes: 6,
    views: 78,
    tags: ["GE", "Dishwasher", "Wiring Diagram"],
    comments: [
      {
        id: "comment-3",
        postId: "post-3",
        content: "I've got that diagram! Attaching it here.",
        authorId: "user-4",
        author: {
          id: "user-4",
          name: "Alice Brown",
          email: "alice@example.com",
          role: "tech",
          avatarUrl: "/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png"
        },
        attachments: [mockAttachments[2]],
        createdAt: new Date(2023, 11, 3, 14, 5),
        updatedAt: new Date(2023, 11, 3, 14, 5),
        upvotes: 8,
        isAnswer: true
      }
    ]
  }
];
