
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportTicketMessage } from "@/types/support";

/**
 * Fetch support tickets
 * @param status Filter by ticket status (optional)
 * @param companyId Filter by company ID (optional)
 * @returns Array of support tickets
 */
export async function fetchSupportTickets(
  status?: string, 
  companyId?: string
): Promise<SupportTicket[]> {
  let query = supabase.from('support_tickets').select(`
    *,
    created_by_user:user_id(
      name,
      email,
      avatar_url,
      role
    )
  `);
  
  // Apply filters if provided
  if (status) {
    query = query.eq('status', status);
  }
  
  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  
  // Order by created_at timestamp (newest first)
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
  
  return data as unknown as SupportTicket[];
}

/**
 * Fetch a single support ticket by ID
 * @param ticketId Ticket ID
 * @returns Support ticket object
 */
export async function fetchSupportTicketById(ticketId: string): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from('support_tickets')
    .select(`
      *,
      created_by_user:user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .eq('id', ticketId)
    .single();
  
  if (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    throw error;
  }
  
  return data as unknown as SupportTicket;
}

/**
 * Fetch messages for a specific support ticket
 * @param ticketId Ticket ID
 * @returns Array of support ticket messages
 */
export async function fetchTicketMessages(ticketId: string): Promise<SupportTicketMessage[]> {
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
    .order('created_at');
  
  if (error) {
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    throw error;
  }
  
  return data as unknown as SupportTicketMessage[];
}

/**
 * Create a new support ticket
 * @param ticketData Ticket data to create
 * @returns Created support ticket
 */
export async function createSupportTicket(ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
  // Make sure required fields are present
  if (!ticketData.title || !ticketData.description) {
    throw new Error('Missing required fields for ticket creation');
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert([ticketData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
  
  return data as SupportTicket;
}

/**
 * Add a message to a support ticket
 * @param messageData Message data to add
 * @returns Created message
 */
export async function addTicketMessage(messageData: Partial<SupportTicketMessage>): Promise<SupportTicketMessage> {
  // Make sure required fields are present
  if (!messageData.content || !messageData.ticket_id) {
    throw new Error('Missing required fields for message creation');
  }

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding message to ticket:', error);
    throw error;
  }
  
  return data as SupportTicketMessage;
}

/**
 * Update a support ticket
 * @param ticketId Ticket ID to update
 * @param updateData Data to update
 * @returns Updated ticket
 */
export async function updateSupportTicket(
  ticketId: string, 
  updateData: Partial<SupportTicket>
): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from('support_tickets')
    .update(updateData)
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
  
  return data as SupportTicket;
}
