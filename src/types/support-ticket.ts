
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  comments?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    createdBy: {
      id: string;
      name: string;
    };
  }>;
  messages: Array<{
    id: string;
    ticketId: string;
    content: string;
    createdAt: Date;
    sender: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatarUrl?: string;
    };
  }>;
}
