
import { SupportTicket, SupportTicketStatus, TicketPriority, SupportTicketMessage } from "@/types/support";

// Mock user data
const mockUsers = {
  admin1: {
    id: "admin1",
    name: "Admin User",
    role: "Administrator",
    email: "admin@example.com",
    avatar_url: "https://i.pravatar.cc/150?u=admin1"
  },
  company1: {
    id: "company1",
    name: "John Smith",
    role: "Company Owner",
    email: "john@company.com",
    avatar_url: "https://i.pravatar.cc/150?u=company1"
  },
  tech1: {
    id: "tech1",
    name: "Mike Johnson",
    role: "Technician",
    email: "mike@tech.com",
    avatar_url: "https://i.pravatar.cc/150?u=tech1"
  }
};

// Generate a mock ticket message
const createMockMessage = (
  id: string,
  ticket_id: string,
  content: string,
  sender_id: string,
  daysAgo: number
): SupportTicketMessage => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    id,
    ticket_id,
    content,
    sender_id,
    created_at: date.toISOString(),
    sender: mockUsers[sender_id as keyof typeof mockUsers]
  };
};

// Generate a mock ticket
const createMockTicket = (
  id: string,
  title: string,
  description: string,
  status: SupportTicketStatus,
  priority: TicketPriority,
  created_by: string,
  assigned_to: string | null,
  daysAgo: number
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
    created_at: createdDate.toISOString(),
    updated_at: updatedDate.toISOString(),
    created_by,
    assigned_to,
    company_id: null,
    creator: mockUsers[created_by as keyof typeof mockUsers],
    assignee: assigned_to ? mockUsers[assigned_to as keyof typeof mockUsers] : undefined
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
    "company1",
    null,
    2
  ),
  createMockTicket(
    "ticket2",
    "App Crashing on Mobile",
    "The app keeps crashing when I try to view repair history on my iPhone 13. This started happening after the latest update.",
    "in-progress",
    "medium",
    "tech1",
    "admin1",
    5
  ),
  createMockTicket(
    "ticket3",
    "Need Additional User Licenses",
    "We've hired three new technicians and need to add them to our account. Our current plan only allows for 5 technicians.",
    "resolved",
    "low",
    "company1",
    "admin1",
    8
  ),
  createMockTicket(
    "ticket4",
    "Feature Request: Export to PDF",
    "It would be really helpful if we could export repair reports to PDF format to share with customers.",
    "closed",
    "low",
    "tech1",
    "admin1",
    15
  )
];

// Current user info (would normally come from auth context)
export const currentUser = mockUsers.admin1;
