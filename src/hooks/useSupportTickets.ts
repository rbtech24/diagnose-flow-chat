
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportTicket } from '@/types/support';
import { toast } from 'sonner';

export function useSupportTickets(companyId?: string, userId?: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the base query
      const query = supabase
        .from('support_tickets')
        .select(`
          *,
          created_by_user:user_id(
            id,
            name,
            email,
            role,
            avatar_url
          ),
          message_count:support_ticket_messages(count)
        `)
        .order('created_at', { ascending: false });
      
      // Add filters if provided
      if (companyId) {
        query.eq('company_id', companyId);
      }
      
      if (userId) {
        query.eq('user_id', userId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Format the data to match our SupportTicket type
      const formattedTickets: SupportTicket[] = data?.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        user_id: ticket.user_id,
        company_id: ticket.company_id,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        created_by_user: ticket.created_by_user || {
          name: 'Unknown User',
          email: 'unknown@example.com',
          role: 'user',
          avatar_url: ''
        }
      })) || [];
      
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
  }, [companyId, userId]);

  // Create a new ticket
  const createTicket = async (ticketData: {
    title: string;
    description: string;
    priority: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Get company ID if not provided
      let targetCompanyId = companyId;
      if (!targetCompanyId) {
        const { data: userData } = await supabase
          .from('technicians')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        targetCompanyId = userData?.company_id;
      }
      
      if (!targetCompanyId) throw new Error('Company ID not found');
      
      const newTicket = {
        ...ticketData,
        user_id: user.id,
        company_id: targetCompanyId,
        status: 'open'
      };
      
      const { data, error: insertError } = await supabase
        .from('support_tickets')
        .insert(newTicket)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Refresh tickets list
      fetchTickets();
      
      return data;
    } catch (err) {
      console.error('Error creating support ticket:', err);
      toast.error('Error creating support ticket');
      throw err;
    }
  };

  // Add a message to a ticket
  const addTicketMessage = async (ticketId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const message = {
        ticket_id: ticketId,
        user_id: user.id,
        content
      };
      
      const { error: insertError } = await supabase
        .from('support_ticket_messages')
        .insert(message);
        
      if (insertError) throw insertError;
      
      // Update the last updated timestamp on the ticket
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);
        
      return true;
    } catch (err) {
      console.error('Error adding message to ticket:', err);
      toast.error('Error adding message');
      return false;
    }
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId);
        
      if (error) throw error;
      
      // Update local state
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating ticket status:', err);
      toast.error('Error updating ticket status');
      return false;
    }
  };

  return { 
    tickets, 
    isLoading, 
    error, 
    refreshTickets: fetchTickets,
    createTicket,
    addTicketMessage,
    updateTicketStatus
  };
}
