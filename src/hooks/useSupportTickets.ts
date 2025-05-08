
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket, SupportTicketStatus, TicketPriority, TicketComment } from '@/types/support';
import { toast } from 'sonner';

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
      const query = supabase
        .from('support_tickets')
        .select('*, created_by_user:profiles(id, full_name, email, role, avatar_url)')
        .order('created_at', { ascending: false });
        
      if (options.companyId) {
        query.eq('company_id', options.companyId);
      }
      
      if (options.userId) {
        query.eq('user_id', options.userId);
      }
      
      if (options.status) {
        query.eq('status', options.status);
      }
      
      if (options.limit) {
        query.limit(options.limit);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Format the data to match our SupportTicket type
      const formattedTickets: SupportTicket[] = data?.map(ticket => {
        // Ensure status is a valid SupportTicketStatus
        let status: SupportTicketStatus = 'open';
        if (ticket.status === 'open' || 
            ticket.status === 'in_progress' || 
            ticket.status === 'resolved' || 
            ticket.status === 'closed') {
          status = ticket.status as SupportTicketStatus;
        }
        
        // Ensure priority is a valid TicketPriority
        let priority: TicketPriority = 'medium';
        if (ticket.priority === 'low' || 
            ticket.priority === 'medium' || 
            ticket.priority === 'high' || 
            ticket.priority === 'critical') {
          priority = ticket.priority as TicketPriority;
        }
        
        // Get the user data if available
        const user = ticket.created_by_user || {
          id: ticket.user_id,
          full_name: 'Unknown User',
          email: '',
          role: 'user',
          avatar_url: ''
        };
        
        return {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          status: status,
          priority: priority,
          user_id: ticket.user_id,
          company_id: ticket.company_id,
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
          assigned_to: ticket.assigned_to,
          created_by_user: {
            name: user.full_name || 'Unknown User',
            email: user.email || '',
            role: user.role || 'user',
            avatar_url: user.avatar_url
          },
          attachments: ticket.attachments || []
        };
      }) || [];
      
      setTickets(formattedTickets);
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
      // Fetch the ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*, created_by_user:profiles(id, full_name, email, role, avatar_url)')
        .eq('id', ticketId)
        .single();
        
      if (ticketError) throw ticketError;

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('ticket_comments')
        .select('*, created_by_user:profiles(id, full_name, email, role, avatar_url)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (commentsError) throw commentsError;

      // Format the ticket with type safety
      // Ensure status is a valid SupportTicketStatus
      let status: SupportTicketStatus = 'open';
      if (ticketData.status === 'open' || 
          ticketData.status === 'in_progress' || 
          ticketData.status === 'resolved' || 
          ticketData.status === 'closed') {
        status = ticketData.status as SupportTicketStatus;
      }
      
      // Ensure priority is a valid TicketPriority
      let priority: TicketPriority = 'medium';
      if (ticketData.priority === 'low' || 
          ticketData.priority === 'medium' || 
          ticketData.priority === 'high' || 
          ticketData.priority === 'critical') {
        priority = ticketData.priority as TicketPriority;
      }
      
      // Format the user data
      const user = ticketData.created_by_user || {
        id: ticketData.user_id,
        full_name: 'Unknown User',
        email: '',
        role: 'user',
        avatar_url: ''
      };
      
      // Format comments with type safety
      const formattedComments: TicketComment[] = commentsData?.map(comment => {
        const commentUser = comment.created_by_user || {
          id: comment.user_id,
          full_name: 'Unknown User',
          email: '',
          role: 'user',
          avatar_url: ''
        };
        
        return {
          id: comment.id,
          ticket_id: comment.ticket_id,
          user_id: comment.user_id,
          content: comment.content,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          is_internal: comment.is_internal || false,
          attachments: comment.attachments || [],
          created_by_user: {
            name: commentUser.full_name || 'Unknown User',
            email: commentUser.email || '',
            role: commentUser.role || 'user',
            avatar_url: commentUser.avatar_url
          }
        };
      }) || [];

      // Return the formatted ticket with comments
      return {
        id: ticketData.id,
        title: ticketData.title,
        description: ticketData.description,
        status: status,
        priority: priority,
        user_id: ticketData.user_id,
        company_id: ticketData.company_id,
        created_at: ticketData.created_at,
        updated_at: ticketData.updated_at,
        assigned_to: ticketData.assigned_to,
        created_by_user: {
          name: user.full_name || 'Unknown User',
          email: user.email || '',
          role: user.role || 'user',
          avatar_url: user.avatar_url
        },
        attachments: ticketData.attachments || [],
        comments: formattedComments
      };
      
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      toast.error('Error loading ticket details');
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicketStatus) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ticketId);
        
      if (error) throw error;
      
      // Update local state
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
    attachments: Array<{ id: string, filename: string, url: string }> = []
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const newComment = {
        ticket_id: ticketId,
        user_id: user.id,
        content,
        is_internal: isInternal,
        attachments,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('ticket_comments')
        .insert(newComment)
        .select('*, created_by_user:profiles(id, full_name, email, role, avatar_url)')
        .single();
        
      if (error) throw error;
      
      // Format the comment for return
      const commentUser = data.created_by_user || {
        id: user.id,
        full_name: 'Current User',
        email: '',
        role: 'user',
        avatar_url: ''
      };
      
      const formattedComment: TicketComment = {
        id: data.id,
        ticket_id: data.ticket_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_internal: data.is_internal || false,
        attachments: data.attachments || [],
        created_by_user: {
          name: commentUser.full_name || 'Current User',
          email: commentUser.email || '',
          role: commentUser.role || 'user',
          avatar_url: commentUser.avatar_url
        }
      };
      
      toast.success('Comment added');
      return formattedComment;
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
