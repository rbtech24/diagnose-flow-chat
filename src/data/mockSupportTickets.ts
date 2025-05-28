
import { SupportTicket } from "@/types/support";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation
export const getSupportTickets = async (
  status?: string,
  companyId?: string
): Promise<SupportTicket[]> => {
  try {
    console.log('Fetching support tickets from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      let query = supabase
        .from('support_tickets')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          user_id,
          company_id,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      return await query;
    });

    if (!result.success) {
      console.error('Failed to fetch support tickets:', result.error);
      return [];
    }

    // Transform database data to SupportTicket type
    const tickets: SupportTicket[] = (result.data || []).map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed',
      priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent',
      userId: ticket.user_id,
      companyId: ticket.company_id,
      createdAt: new Date(ticket.created_at),
      updatedAt: new Date(ticket.updated_at)
    }));

    console.log(`Successfully fetched ${tickets.length} support tickets`);
    return tickets;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }
};

// Real-time subscription for support tickets
export const subscribeSupportTicketsUpdates = (
  companyId: string,
  onUpdate: (tickets: SupportTicket[]) => void
) => {
  console.log('Setting up real-time subscription for support tickets...');
  
  return SupabaseIntegration.handleRealtimeSubscription(
    'support_tickets',
    async () => {
      const updatedTickets = await getSupportTickets(undefined, companyId);
      onUpdate(updatedTickets);
    }
  );
};
