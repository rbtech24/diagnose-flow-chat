import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportTicketMessage, SupportTicketStatus, TicketPriority } from "@/types/support";
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
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format tickets to match our interface
    const formattedTickets: SupportTicket[] = data.map(ticket => {
      return {
        ...ticket,
        // Ensure status is cast to the correct type
        status: ticket.status as SupportTicketStatus,
        // Ensure priority is cast to the correct type
        priority: ticket.priority as TicketPriority,
        // Add placeholder user data until we can fetch it properly
        created_by_user: {
          name: 'User',
          email: '',
          role: 'user'
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
        updated_at
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;

    // Format ticket to match our interface
    const ticket: SupportTicket = {
      ...data,
      // Ensure status is cast to the correct type
      status: data.status as SupportTicketStatus,
      // Ensure priority is cast to the correct type
      priority: data.priority as TicketPriority,
      // Add placeholder user data until we can fetch it properly
      created_by_user: {
        name: 'User',
        email: '',
        role: 'user'
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
        created_at
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format messages
    const messages: SupportTicketMessage[] = data.map(message => {
      return {
        id: message.id,
        ticket_id: message.ticket_id,
        content: message.content,
        user_id: message.user_id,
        created_at: message.created_at,
        // Add placeholder sender info
        sender: {
          name: 'User',
          email: '',
          role: 'user'
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

export async function addTicketMessage(ticketId: string, content: string, attachments: File[] = []) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    // First, upload any attachments
    const uploadedAttachments = [];
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `ticket-attachments/${ticketId}/${fileName}`;
        
        const { data: fileData, error: uploadError } = await supabase
          .storage
          .from('support-attachments')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase
          .storage
          .from('support-attachments')
          .getPublicUrl(filePath);
        
        uploadedAttachments.push({
          filename: file.name,
          url: urlData.publicUrl,
          content_type: file.type,
          size: file.size,
          path: filePath
        });
      }
    }
    
    const messageData = {
      ticket_id: ticketId,
      content,
      user_id: userData.user.id,
      attachments: uploadedAttachments.length ? uploadedAttachments : null
    };
    
    const { data, error } = await supabase
      .from('support_ticket_messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update ticket's updated_at timestamp
    await supabase
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    
    // Trigger notification for ticket update
    await createTicketNotification(ticketId, 'message', `New message on ticket #${ticketId.substring(0, 8)}`);
    
    return data;
  } catch (error) {
    console.error("Error adding ticket message:", error);
    throw error;
  }
}

export async function updateTicketStatus(ticketId: string, status: SupportTicketStatus) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Create a notification about status change
    await createTicketNotification(
      ticketId, 
      'status_change', 
      `Ticket status changed to ${status}`
    );
    
    return data;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
}

export async function assignTicket(ticketId: string, assignedToUserId: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ 
        assigned_to: assignedToUserId, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log the assignment
    const assignmentData = {
      ticket_id: ticketId,
      assigned_to: assignedToUserId,
      assigned_by: userData.user.id,
      assigned_at: new Date().toISOString()
    };
    
    await supabase
      .from('ticket_assignments')
      .insert(assignmentData);
    
    // Create notification for the assigned user
    await createTicketNotification(
      ticketId,
      'assignment',
      `You've been assigned to ticket #${ticketId.substring(0, 8)}`,
      assignedToUserId
    );
    
    return data;
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
}

export async function updateTicketPriority(ticketId: string, priority: TicketPriority) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ 
        priority, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Create notification about priority change
    await createTicketNotification(
      ticketId,
      'priority_change',
      `Ticket priority changed to ${priority}`
    );
    
    return data;
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    throw error;
  }
}

export async function fetchAvailableAgents() {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select(`
        id,
        email,
        role,
        profiles:profiles(full_name, avatar_url)
      `)
      .in('role', ['admin', 'company_admin'])
      .eq('status', 'active');
    
    if (error) throw error;
    
    return data.map(agent => ({
      id: agent.id,
      email: agent.email,
      role: agent.role,
      name: agent.profiles?.full_name || agent.email.split('@')[0],
      avatar_url: agent.profiles?.avatar_url
    }));
  } catch (error) {
    console.error("Error fetching available agents:", error);
    throw error;
  }
}

export async function getTicketAttachments(ticketId: string) {
  try {
    const { data, error } = await supabase
      .storage
      .from('support-attachments')
      .list(`ticket-attachments/${ticketId}`);
    
    if (error) throw error;
    
    return data.map(file => ({
      name: file.name,
      size: file.metadata.size,
      created_at: file.created_at,
      url: supabase.storage.from('support-attachments').getPublicUrl(`ticket-attachments/${ticketId}/${file.name}`).data.publicUrl
    }));
  } catch (error) {
    console.error("Error fetching attachments:", error);
    throw error;
  }
}

async function createTicketNotification(
  ticketId: string, 
  type: 'message' | 'status_change' | 'assignment' | 'priority_change',
  message: string,
  userId?: string
) {
  try {
    // Get ticket details to determine who should be notified
    const { data: ticketData, error: ticketError } = await supabase
      .from('support_tickets')
      .select('user_id, assigned_to')
      .eq('id', ticketId)
      .single();
    
    if (ticketError) throw ticketError;
    
    // Determine the user to notify
    // If userId is provided, use that, otherwise notify ticket creator and assignee
    const usersToNotify = userId ? [userId] : 
      [ticketData.user_id, ticketData.assigned_to].filter(Boolean);
    
    // Create notifications for each user
    for (const notifyUserId of usersToNotify) {
      await supabase
        .from('notifications')
        .insert({
          user_id: notifyUserId,
          type: type === 'status_change' ? 'info' : 
                type === 'assignment' ? 'info' : 
                type === 'priority_change' ? 'warning' : 'info',
          title: 'Support Ticket Update',
          message,
        });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw here, we don't want notification failures to break the main flow
  }
}
