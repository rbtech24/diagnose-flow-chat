
import { CommunityPost, CommunityComment } from "@/types/community";

// Mock current user
export const currentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  role: "tech",
  avatarUrl: "/lovable-uploads/0fb2afe9-44dd-487d-b13a-f6a2c630c477.png"
};

// Generate a mock post
const createMockPost = (
  id: string, 
  title: string, 
  content: string, 
  type: "question" | "tech-sheet-request" | "wire-diagram-request" | "discussion", 
  tags: string[],
  comments: CommunityComment[] = []
): CommunityPost => {
  return {
    id,
    title,
    content,
    type,
    authorId: currentUser.id,
    author: currentUser,
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    upvotes: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 200),
    isSolved: false,
    tags,
    comments
  };
};

// Mock posts
export const mockPosts: CommunityPost[] = [
  createMockPost(
    "post-1",
    "How to diagnose a Samsung refrigerator that's not cooling?",
    "I've got a Samsung RF28HMEDBSR that's not cooling properly. I've checked the coils and they seem fine. Any suggestions on what to check next?",
    "question",
    ["samsung", "refrigerator", "cooling"]
  ),
  
  createMockPost(
    "post-2",
    "Looking for Whirlpool WTW5000DW tech sheet",
    "Does anyone have the technical sheet for a Whirlpool WTW5000DW washer? I need the diagnostic codes and test procedures.",
    "tech-sheet-request",
    ["whirlpool", "washer", "tech-sheet"]
  ),
  
  createMockPost(
    "post-3",
    "Need wire diagram for GE oven model JB645RKSS",
    "I'm replacing the control board on a GE oven model JB645RKSS and need the wire diagram. The one on the back panel is worn and unreadable.",
    "wire-diagram-request",
    ["ge", "oven", "wiring"],
    [
      {
        id: "comment-1",
        postId: "post-3",
        content: "I have this diagram. I'll send it to you.",
        authorId: "user-2",
        author: {
          id: "user-2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "tech",
          avatarUrl: "/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png"
        },
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 5,
        isAnswer: false
      }
    ]
  ),
];

export const mockComments: CommunityComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    content: "Have you checked the condenser fan? If it's not running, that could be your issue.",
    authorId: "user-2",
    author: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "tech",
      avatarUrl: "/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png"
    },
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    upvotes: 3,
    isAnswer: false
  },
  {
    id: "comment-2",
    postId: "post-1",
    content: "Check the start relay and compressor. Samsung models often have issues with those components.",
    authorId: "user-3",
    author: {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "tech",
      avatarUrl: "/lovable-uploads/c9eb6e16-d7c1-438f-86bb-eefa6fa5ad0e.png"
    },
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    upvotes: 7,
    isAnswer: true
  }
];

// Add comments to the first post
mockPosts[0].comments = mockComments;
