
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, SupportTicketStatus, TicketPriority, TicketComment } from '@/types/support';
import { toast } from 'sonner';
import { mockSupportTickets } from '@/data/mockSupportTickets';

interface SupportTicketsOptions {
  companyId?: string;
  userId?: string;
  status?: SupportTicketStatus;
  limit?: number;
}

export function useSupportTickets(options: SupportTicketsOptions = {}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using mock data for now to avoid database integration issues
      // Later this will be replaced with actual Supabase queries
      let filteredTickets = [...mockSupportTickets];
      
      if (options.companyId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.company_id === options.companyId);
      }
      
      if (options.userId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.user_id === options.userId);
      }
      
      if (options.status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === options.status);
      }
      
      if (options.limit) {
        filteredTickets = filteredTickets.slice(0, options.limit);
      }
      
      setTickets(filteredTickets);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError('Failed to load support tickets');
      toast.error('Error loading support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [options.companyId, options.userId, options.status, options.limit]);

  const fetchTicketDetails = async (ticketId: string): Promise<SupportTicket & { comments: TicketComment[] }> => {
    try {
      // For now, return mock data
      const ticket = mockSupportTickets.find(t => t.id === ticketId);
      
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      
      // Mock comments
      const mockComments: TicketComment[] = [
        {
          id: `comment-${Date.now()}-1`,
          ticket_id: ticketId,
          user_id: 'user-1',
          content: 'This is a mock comment for the ticket.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_internal: false,
          attachments: [],
          created_by_user: {
            name: 'Support Agent',
            email: 'support@example.com',
            role: 'admin',
            avatar_url: 'https://i.pravatar.cc/150?u=support'
          }
        }
      ];
      
      return {
        ...ticket,
        comments: mockComments
      };
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      toast.error('Error loading ticket details');
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicketStatus) => {
    try {
      // For now, update only the local state
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updated_at: new Date().toISOString() } 
            : ticket
        )
      );
      
      toast.success(`Ticket status updated to ${status}`);
      return true;
    } catch (err) {
      console.error('Error updating ticket status:', err);
      toast.error('Error updating ticket status');
      return false;
    }
  };

  const addComment = async (
    ticketId: string, 
    content: string, 
    isInternal: boolean = false,
    attachments: Array<{ id: string; filename: string; url: string }> = []
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Create a mock comment
      const newComment: TicketComment = {
        id: `comment-${Date.now()}`,
        ticket_id: ticketId,
        user_id: user.id,
        content,
        is_internal: isInternal,
        attachments,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by_user: {
          name: 'Current User',
          email: user.email || '',
          role: 'user',
          avatar_url: ''
        }
      };
      
      toast.success('Comment added');
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Error adding comment');
      throw err;
    }
  };

  return { 
    tickets, 
    isLoading, 
    error, 
    fetchTickets, 
    fetchTicketDetails,
    updateTicketStatus,
    addComment
  };
}
