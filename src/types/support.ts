
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
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    content_type: string;
    size: number;
    created_at: string;
  }>;
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
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    content_type: string;
    size: number;
  }>;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_internal: boolean;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
  created_by_user: {
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
  };
}

export interface TicketAssignment {
  ticket_id: string;
  assigned_to: string;
  assigned_by: string;
  assigned_at: string;
}

export interface TicketFilter {
  status?: SupportTicketStatus[];
  priority?: TicketPriority[];
  assigned_to?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
