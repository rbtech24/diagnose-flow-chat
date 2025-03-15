
import { SupportTicket, TicketStatus, TicketPriority, TicketMessage } from "@/components/support/SupportTicket";

// Mock user data
const mockUsers = {
  admin1: {
    id: "admin1",
    name: "Admin User",
    role: "Administrator",
    avatarUrl: "https://i.pravatar.cc/150?u=admin1"
  },
  company1: {
    id: "company1",
    name: "John Smith",
    role: "Company Owner",
    avatarUrl: "https://i.pravatar.cc/150?u=company1"
  },
  tech1: {
    id: "tech1",
    name: "Mike Johnson",
    role: "Technician",
    avatarUrl: "https://i.pravatar.cc/150?u=tech1"
  }
};

// Generate a mock ticket message
const createMockMessage = (
  id: string,
  ticketId: string,
  content: string,
  sender: typeof mockUsers.admin1,
  daysAgo: number
): TicketMessage => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    id,
    ticketId,
    content,
    sender,
    createdAt: date
  };
};

// Generate a mock ticket
const createMockTicket = (
  id: string,
  title: string,
  description: string,
  status: TicketStatus,
  priority: TicketPriority,
  createdBy: typeof mockUsers.company1,
  assignedTo: typeof mockUsers.admin1 | undefined,
  daysAgo: number,
  messages: TicketMessage[] = []
): SupportTicket => {
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const updatedDate = new Date();
  updatedDate.setDate(updatedDate.getDate() - (daysAgo > 1 ? daysAgo - 1 : 0));
  
  return {
    id,
    title,
    description,
    status,
    priority,
    createdAt: createdDate,
    updatedAt: updatedDate,
    createdBy,
    assignedTo,
    messages
  };
};

// Create mock tickets
export const mockTickets: SupportTicket[] = [
  createMockTicket(
    "ticket1",
    "Can't Access Workflow Editor",
    "I'm trying to access the workflow editor but keep getting an error message saying 'Access Denied'. I should have permission as a company owner.",
    "open",
    "high",
    mockUsers.company1,
    undefined,
    2,
    []
  ),
  createMockTicket(
    "ticket2",
    "App Crashing on Mobile",
    "The app keeps crashing when I try to view repair history on my iPhone 13. This started happening after the latest update.",
    "in-progress",
    "medium",
    mockUsers.tech1,
    mockUsers.admin1,
    5,
    [
      createMockMessage(
        "message1",
        "ticket2",
        "Thanks for reporting this. What version of iOS are you running?",
        mockUsers.admin1,
        4
      ),
      createMockMessage(
        "message2",
        "ticket2",
        "I'm running iOS 16.5. I've tried reinstalling the app but still having the same issue.",
        mockUsers.tech1,
        3
      ),
      createMockMessage(
        "message3",
        "ticket2",
        "We're looking into this issue. It appears to be related to a recent update. We'll get back to you soon with more information.",
        mockUsers.admin1,
        2
      )
    ]
  ),
  createMockTicket(
    "ticket3",
    "Need Additional User Licenses",
    "We've hired three new technicians and need to add them to our account. Our current plan only allows for 5 technicians.",
    "resolved",
    "low",
    mockUsers.company1,
    mockUsers.admin1,
    8,
    [
      createMockMessage(
        "message4",
        "ticket3",
        "I can help you upgrade your plan. Would you like to move to our Premium plan which supports up to 10 technicians?",
        mockUsers.admin1,
        7
      ),
      createMockMessage(
        "message5",
        "ticket3",
        "Yes, that would be great. How much would that cost?",
        mockUsers.company1,
        6
      ),
      createMockMessage(
        "message6",
        "ticket3",
        "The Premium plan is $99/month, which is a $30 increase from your current plan. I can process this upgrade immediately if you'd like.",
        mockUsers.admin1,
        5
      ),
      createMockMessage(
        "message7",
        "ticket3",
        "That sounds good. Please proceed with the upgrade.",
        mockUsers.company1,
        4
      ),
      createMockMessage(
        "message8",
        "ticket3",
        "I've upgraded your account to Premium. You can now add up to 10 technicians. The new charge will appear on your next billing statement. Let me know if you need anything else!",
        mockUsers.admin1,
        3
      )
    ]
  ),
  createMockTicket(
    "ticket4",
    "Feature Request: Export to PDF",
    "It would be really helpful if we could export repair reports to PDF format to share with customers.",
    "closed",
    "low",
    mockUsers.tech1,
    mockUsers.admin1,
    15,
    [
      createMockMessage(
        "message9",
        "ticket4",
        "Thanks for the suggestion! We've added this to our feature request list. We're planning to implement PDF exports in our next major update.",
        mockUsers.admin1,
        14
      ),
      createMockMessage(
        "message10",
        "ticket4",
        "Great to hear! Any idea when the next major update will be released?",
        mockUsers.tech1,
        13
      ),
      createMockMessage(
        "message11",
        "ticket4",
        "We're targeting next quarter for the release. I'll mark this ticket as closed for now, but we'll notify all users when the feature becomes available.",
        mockUsers.admin1,
        12
      )
    ]
  )
];

// Current user info (would normally come from auth context)
export const currentUser = mockUsers.admin1;
