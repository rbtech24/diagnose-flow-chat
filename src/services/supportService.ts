import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportTicketMessage, SupportTicketStatus } from "@/types/support";
import { useUserManagementStore } from "@/store/userManagementStore";

export async function fetchSupportTickets() {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        id, 
        title, 
        description, 
        status, 
        priority, 
        user_id, 
        assigned_to, 
        company_id, 
        created_at, 
        updated_at,
        user_id (
          raw_user_meta_data
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format tickets to match our interface
    const formattedTickets: SupportTicket[] = data.map(ticket => {
      const userData = ticket.user_id?.raw_user_meta_data || {};
      
      return {
        ...ticket,
        created_by_user: {
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          avatar_url: userData.avatar_url,
          role: userData.role || 'user'
        }
      };
    });

    return formattedTickets;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    throw error;
  }
}

export async function fetchTicketById(ticketId: string) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        id, 
        title, 
        description, 
        status, 
        priority, 
        user_id, 
        assigned_to, 
        company_id, 
        created_at, 
        updated_at,
        user_id (
          raw_user_meta_data
        )
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;

    // Format ticket to match our interface
    const userData = data.user_id?.raw_user_meta_data || {};
    
    const ticket: SupportTicket = {
      ...data,
      created_by_user: {
        name: userData.name || 'Unknown User',
        email: userData.email || '',
        avatar_url: userData.avatar_url,
        role: userData.role || 'user'
      }
    };

    return ticket;
  } catch (error) {
    console.error("Error fetching support ticket:", error);
    throw error;
  }
}

export async function fetchTicketMessages(ticketId: string) {
  try {
    const { data, error } = await supabase
      .from('support_ticket_messages')
      .select(`
        id, 
        ticket_id, 
        content, 
        user_id, 
        created_at,
        user_id (
          raw_user_meta_data
        )
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format messages
    const messages: SupportTicketMessage[] = data.map(message => {
      const userData = message.user_id?.raw_user_meta_data || {};
      
      return {
        id: message.id,
        ticket_id: message.ticket_id,
        content: message.content,
        user_id: message.user_id,
        created_at: message.created_at,
        sender: {
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          avatar_url: userData.avatar_url,
          role: userData.role || 'user'
        }
      };
    });

    return messages;
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    throw error;
  }
}

export async function createSupportTicket(title: string, description: string, priority: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // Get user's company ID if they have one
    let companyId = null;
    const { data: technicianData } = await supabase
      .from('technicians')
      .select('company_id')
      .eq('id', userData.user.id)
      .maybeSingle();
    
    if (technicianData) {
      companyId = technicianData.company_id;
    }
    
    const ticketData = {
      title,
      description,
      priority,
      user_id: userData.user.id,
      company_id: companyId,
      status: 'open'
    };
    
    const { data, error } = await supabase
      .from('support_tickets')
      .insert(ticketData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
}

export async function addTicketMessage(ticketId: string, content: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const messageData = {
      ticket_id: ticketId,
      content,
      user_id: userData.user.id
    };
    
    const { data, error } = await supabase
      .from('support_ticket_messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error adding ticket message:", error);
    throw error;
  }
}

export async function updateTicketStatus(ticketId: string, status: SupportTicketStatus) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
}
