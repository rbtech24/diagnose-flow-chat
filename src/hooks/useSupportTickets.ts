import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchSupportTickets, 
  fetchSupportTicketById, 
  fetchTicketMessages, 
  createSupportTicket, 
  updateSupportTicket, 
  addTicketMessage 
} from '@/api/supportTicketsApi';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  userId: string;
  companyId?: string;
  user_id: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  content: string;
  userId: string;
  createdAt: Date;
  ticket_id: string;
  user_id: string;
  created_at: string;
  sender?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

// Helper function to validate and cast status
function validateStatus(status: string): SupportTicket['status'] {
  const validStatuses: SupportTicket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  return validStatuses.includes(status as SupportTicket['status']) 
    ? (status as SupportTicket['status']) 
    : 'open';
}

// Helper function to validate and cast priority
function validatePriority(priority: string): SupportTicket['priority'] {
  const validPriorities: SupportTicket['priority'][] = ['low', 'medium', 'high', 'urgent'];
  return validPriorities.includes(priority as SupportTicket['priority']) 
    ? (priority as SupportTicket['priority']) 
    : 'medium';
}

export function useSupportTickets(initialStatus?: string, companyId?: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTickets = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSupportTickets(status, companyId, {
        page: 1,
        limit: 50,
        sortOrder: 'desc'
      });

      const formattedTickets: SupportTicket[] = result.tickets.map((ticket: any) => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: validateStatus(ticket.status),
        priority: validatePriority(ticket.priority),
        category: 'General',
        createdAt: new Date(ticket.created_at),
        updatedAt: new Date(ticket.updated_at),
        assignedTo: ticket.assigned_to,
        userId: ticket.user_id,
        companyId: ticket.company_id,
        user_id: ticket.user_id,
        created_by_user_id: ticket.created_by_user_id,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        created_by_user: ticket.created_by_user || null
      }));

      setTickets(formattedTickets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching tickets';
      setError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<SupportTicket | null> => {
    try {
      const data = await fetchSupportTicketById(id);

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: validateStatus(data.status),
        priority: validatePriority(data.priority),
        category: 'General',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        assignedTo: data.assigned_to,
        userId: data.user_id,
        companyId: data.company_id,
        user_id: data.user_id,
        created_by_user_id: data.created_by_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by_user: data.created_by_user || null
      };
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch ticket ${id}`);
    }
  };

  const getTicketMessages = async (ticketId: string): Promise<SupportTicketMessage[]> => {
    try {
      const data = await fetchTicketMessages(ticketId);

      return data.map((message: any) => ({
        id: message.id,
        ticketId: message.ticket_id,
        content: message.content,
        userId: message.user_id,
        createdAt: new Date(message.created_at),
        ticket_id: message.ticket_id,
        user_id: message.user_id,
        created_at: message.created_at,
        sender: message.sender || null
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch messages for ticket ${ticketId}`);
    }
  };

  const createTicket = async (ticketData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const data = await createSupportTicket({
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority || 'medium',
        companyId: ticketData.companyId
      });

      const newTicket: SupportTicket = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: validateStatus(data.status),
        priority: validatePriority(data.priority),
        category: 'General',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        userId: data.user_id,
        companyId: data.company_id,
        user_id: data.user_id,
        created_by_user_id: data.created_by_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by_user: data.created_by_user || null
      };

      loadTickets(initialStatus);
      return newTicket;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create ticket');
    }
  };

  const updateTicket = async (ticketId: string, updateData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const data = await updateSupportTicket(ticketId, {
        title: updateData.title,
        description: updateData.description,
        status: updateData.status,
        priority: updateData.priority,
        assignedTo: updateData.assignedTo
      });

      const updatedTicket: SupportTicket = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: validateStatus(data.status),
        priority: validatePriority(data.priority),
        category: 'General',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        assignedTo: data.assigned_to,
        userId: data.user_id,
        companyId: data.company_id,
        user_id: data.user_id,
        created_by_user_id: data.created_by_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by_user: data.created_by_user || null
      };

      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId ? updatedTicket : ticket
        )
      );

      return updatedTicket;
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to update ticket ${ticketId}`);
    }
  };

  const addMessage = async (messageData: { content: string; ticket_id: string }): Promise<SupportTicketMessage> => {
    try {
      const data = await addTicketMessage(messageData);

      return {
        id: data.id,
        ticketId: data.ticket_id,
        content: data.content,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        ticket_id: data.ticket_id,
        user_id: data.user_id,
        created_at: data.created_at,
        sender: data.sender || null
      };
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add message');
    }
  };

  useEffect(() => {
    loadTickets(initialStatus);
  }, [initialStatus, companyId]);

  return {
    tickets,
    isLoading,
    error,
    loadTickets,
    getTicketById,
    getTicketMessages,
    createTicket,
    updateTicket,
    addMessage
  };
}
