
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
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  attachments?: string[];
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
        .select(`
          *,
          comments:support_ticket_comments(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters based on user role and parameters
      if (userId && !companyId) {
        query = query.eq('user_id', userId);
      } else if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setIsLoading(false);
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
          category: ticketData.category,
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
      const { data, error } = await supabase
        .from('support_ticket_comments')
        .insert({
          content: commentData.content,
          ticket_id: commentData.ticket_id,
          user_id: userId,
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
    createTicket,
    updateTicketStatus,
    addComment,
    assignTicket,
  };
}
