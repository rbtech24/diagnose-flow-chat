
export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

// Updated to match Supabase database structure
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: TicketPriority;
  user_id: string;
  company_id?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  // Add optional properties for relations that might not be available from Supabase
  creator?: { 
    name: string; 
    email: string; 
    avatar_url?: string;
  };
  assignee?: { 
    name: string; 
    email: string; 
    avatar_url?: string;
  };
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}
