
export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: TicketPriority;
  user_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  created_by_user: {
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
  };
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  sender: {
    name: string;
    email: string;
    role?: string;
    avatar_url?: string;
  };
}
