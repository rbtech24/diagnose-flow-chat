
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export function useSupportTickets(initialStatus?: string, companyId?: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTickets = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          created_by_user:created_by_user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw new Error(`Failed to fetch tickets: ${fetchError.message}`);
      }

      const formattedTickets: SupportTicket[] = (data || []).map((ticket: any) => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as SupportTicket['status'],
        priority: ticket.priority as SupportTicket['priority'],
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
        created_by_user: ticket.created_by_user
      }));

      setTickets(formattedTickets);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching tickets'));
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = async (id: string): Promise<SupportTicket | null> => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          created_by_user:created_by_user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch ticket: ${error.message}`);
      }

      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status as SupportTicket['status'],
        priority: data.priority as SupportTicket['priority'],
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
        created_by_user: data.created_by_user
      };
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch ticket ${id}`);
    }
  };

  const getTicketMessages = async (ticketId: string): Promise<SupportTicketMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select(`
          *,
          sender:user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }

      return (data || []).map((message: any) => ({
        id: message.id,
        ticketId: message.ticket_id,
        content: message.content,
        userId: message.user_id,
        createdAt: new Date(message.created_at),
        ticket_id: message.ticket_id,
        user_id: message.user_id,
        created_at: message.created_at,
        sender: message.sender
      }));
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch messages for ticket ${ticketId}`);
    }
  };

  const createTicket = async (ticketData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          priority: ticketData.priority || 'medium',
          status: 'open',
          user_id: user.id,
          created_by_user_id: user.id,
          company_id: ticketData.companyId
        })
        .select(`
          *,
          created_by_user:created_by_user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .single();

      if (error) {
        throw new Error(`Failed to create ticket: ${error.message}`);
      }

      const newTicket: SupportTicket = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: 'General',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        userId: data.user_id,
        companyId: data.company_id,
        user_id: data.user_id,
        created_by_user_id: data.created_by_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by_user: data.created_by_user
      };

      loadTickets(initialStatus);
      return newTicket;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create ticket');
    }
  };

  const updateTicket = async (ticketId: string, updateData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({
          title: updateData.title,
          description: updateData.description,
          status: updateData.status,
          priority: updateData.priority,
          assigned_to: updateData.assignedTo
        })
        .eq('id', ticketId)
        .select(`
          *,
          created_by_user:created_by_user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .single();

      if (error) {
        throw new Error(`Failed to update ticket: ${error.message}`);
      }

      const updatedTicket: SupportTicket = {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
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
        created_by_user: data.created_by_user
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: messageData.ticket_id,
          content: messageData.content,
          user_id: user.id
        })
        .select(`
          *,
          sender:user_id(
            name,
            email,
            avatar_url,
            role
          )
        `)
        .single();

      if (error) {
        throw new Error(`Failed to add message: ${error.message}`);
      }

      return {
        id: data.id,
        ticketId: data.ticket_id,
        content: data.content,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        ticket_id: data.ticket_id,
        user_id: data.user_id,
        created_at: data.created_at,
        sender: data.sender
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
