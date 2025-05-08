
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  assigned_to?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  sender?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}
