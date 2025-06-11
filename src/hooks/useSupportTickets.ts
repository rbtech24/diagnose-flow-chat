
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  user_id: string;
  assignedTo?: string;
  created_at: string;
  updated_at: string;
  company_id?: string;
  attachments?: string[];
  created_by_user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  attachments?: string[];
}

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

export interface CreateTicketData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  attachments?: File[];
}

export interface CreateCommentData {
  content: string;
  ticket_id: string;
  attachments?: File[];
}

export function useSupportTickets(userId?: string, companyId?: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters based on user role and parameters
      if (userId && !companyId) {
        query = query.eq('user_id', userId);
      } else if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface types
      const transformedTickets: SupportTicket[] = (data || []).map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed',
        priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: undefined, // Not available in current schema
        user_id: ticket.user_id,
        assignedTo: ticket.assigned_to,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        company_id: ticket.company_id,
        attachments: [], // Not available in current schema
        created_by_user: undefined // Not available in current schema - only have created_by_user_id
      }));
      
      setTickets(transformedTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketById = async (ticketId: string): Promise<SupportTicket | null> => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status as 'open' | 'in_progress' | 'resolved' | 'closed',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        category: undefined, // Not available in current schema
        user_id: data.user_id,
        assignedTo: data.assigned_to,
        created_at: data.created_at,
        updated_at: data.updated_at,
        company_id: data.company_id,
        attachments: [], // Not available in current schema
        created_by_user: undefined // Not available in current schema - only have created_by_user_id
      };
    } catch (err) {
      console.error('Error fetching ticket:', err);
      return null;
    }
  };

  const getTicketMessages = async (ticketId: string): Promise<SupportTicketMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching messages:', err);
      return [];
    }
  };

  const createTicket = async (ticketData: CreateTicketData) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          title: ticketData.title,
          description: ticketData.description,
          priority: ticketData.priority,
          user_id: userId,
          company_id: companyId,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchTickets();
      return data;
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw new Error('Failed to create ticket');
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchTickets();
      return data;
    } catch (err) {
      console.error('Error updating ticket status:', err);
      throw new Error('Failed to update ticket status');
    }
  };

  const addComment = async (commentData: CreateCommentData) => {
    try {
      // Since support_ticket_comments table doesn't exist, we'll use support_ticket_messages
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .insert({
          content: commentData.content,
          ticket_id: commentData.ticket_id,
          user_id: userId!,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchTickets();
      return data;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw new Error('Failed to add comment');
    }
  };

  const addMessage = async (messageData: { content: string; ticket_id: string }): Promise<SupportTicketMessage> => {
    try {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .insert({
          content: messageData.content,
          ticket_id: messageData.ticket_id,
          user_id: userId!,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding message:', err);
      throw new Error('Failed to add message');
    }
  };

  const assignTicket = async (ticketId: string, assigneeId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ assigned_to: assigneeId })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchTickets();
      return data;
    } catch (err) {
      console.error('Error assigning ticket:', err);
      throw new Error('Failed to assign ticket');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userId, companyId]);

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    getTicketById,
    getTicketMessages,
    createTicket,
    updateTicketStatus,
    addComment,
    addMessage,
    assignTicket,
  };
}
