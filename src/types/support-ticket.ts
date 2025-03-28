
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date | string;
  updatedAt: Date | string;
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
    createdAt: Date | string;
    createdBy: {
      id: string;
      name: string;
    };
  }>;
  // Add the messages property required by the SupportTicketComponent
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
