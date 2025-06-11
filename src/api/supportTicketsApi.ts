import { supabase } from "@/integrations/supabase/client";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  created_by_user_id: string;
  assigned_to?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
  created_by_user: any;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
  sender: any;
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

function validateStatus(status: string): SupportTicket['status'] {
  const validStatuses: Array<SupportTicket['status']> = ['open', 'in_progress', 'resolved', 'closed'];
  return validStatuses.includes(status as SupportTicket['status']) 
    ? (status as SupportTicket['status']) 
    : 'open';
}

function validatePriority(priority: string): SupportTicket['priority'] {
  const validPriorities: Array<SupportTicket['priority']> = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority as SupportTicket['priority']) 
    ? (priority as SupportTicket['priority']) 
    : 'medium';
}

function convertToSupportTicket(ticket: any): SupportTicket {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: validateStatus(ticket.status),
    priority: validatePriority(ticket.priority),
    user_id: ticket.user_id,
    created_by_user_id: ticket.created_by_user_id,
    assigned_to: ticket.assigned_to || undefined,
    company_id: ticket.company_id || undefined,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    created_by_user: null
  };
}

function convertToSupportTicketMessage(message: any): SupportTicketMessage {
  return {
    id: message.id,
    ticket_id: message.ticket_id,
    content: message.content,
    user_id: message.user_id,
    created_at: message.created_at,
    sender: null
  };
}

export async function fetchSupportTickets(
  status?: string, 
  companyId?: string,
  pagination?: { page?: number; limit?: number; sortOrder?: 'asc' | 'desc' }
): Promise<{ tickets: SupportTicket[]; total: number; page: number; limit: number }> {
  const page = pagination?.page || 1;
  const limit = Math.min(pagination?.limit || 20, 100);
  const sortOrder = pagination?.sortOrder || 'desc';

  let query = supabase.from('support_tickets').select('*', { count: 'exact' });
  
  if (status && status !== 'all') {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (validStatuses.includes(status)) {
      query = query.eq('status', status);
    }
  }
  
  if (companyId && isValidUUID(companyId)) {
    query = query.eq('company_id', companyId);
  }
  
  const offset = (page - 1) * limit;
  query = query
    .order('created_at', { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
  
  const tickets: SupportTicket[] = (data || []).map(convertToSupportTicket);
  
  return {
    tickets,
    total: count || 0,
    page,
    limit
  };
}

export async function fetchSupportTicketById(ticketId: string): Promise<SupportTicket> {
  if (!isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('id', ticketId)
    .single();
  
  if (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    throw error;
  }

  if (!data) {
    throw new Error('Ticket not found');
  }
  
  return convertToSupportTicket(data);
}

export async function fetchTicketMessages(ticketId: string): Promise<SupportTicketMessage[]> {
  if (!isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at');
  
  if (error) {
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    throw error;
  }
  
  const messages: SupportTicketMessage[] = (data || []).map(convertToSupportTicketMessage);
  
  return messages;
}

export async function createSupportTicket(ticketData: {
  title: string;
  description: string;
  priority?: string;
  companyId?: string;
}): Promise<SupportTicket> {
  if (!ticketData.title?.trim()) {
    throw new Error('Title is required');
  }
  
  if (!ticketData.description?.trim()) {
    throw new Error('Description is required');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      title: sanitizeString(ticketData.title),
      description: sanitizeString(ticketData.description),
      priority: ticketData.priority || 'medium',
      user_id: user.id,
      created_by_user_id: user.id,
      company_id: ticketData.companyId
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
  
  return convertToSupportTicket(data);
}

export async function addTicketMessage(messageData: {
  content: string;
  ticket_id: string;
}): Promise<SupportTicketMessage> {
  if (!messageData.content?.trim()) {
    throw new Error('Message content is required');
  }
  
  if (!isValidUUID(messageData.ticket_id)) {
    throw new Error('Invalid ticket ID format');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .insert({
      content: sanitizeString(messageData.content),
      ticket_id: messageData.ticket_id,
      user_id: user.id
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error adding message to ticket:', error);
    throw error;
  }
  
  return convertToSupportTicketMessage(data);
}

export async function updateSupportTicket(
  ticketId: string, 
  updateData: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
  }
): Promise<SupportTicket> {
  if (!isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  const cleanData: Record<string, string> = {};
  
  if (updateData.title) cleanData.title = sanitizeString(updateData.title);
  if (updateData.description) cleanData.description = sanitizeString(updateData.description);
  if (updateData.status) cleanData.status = updateData.status;
  if (updateData.priority) cleanData.priority = updateData.priority;
  if (updateData.assignedTo) cleanData.assigned_to = updateData.assignedTo;

  const { data, error } = await supabase
    .from('support_tickets')
    .update(cleanData)
    .eq('id', ticketId)
    .select('*')
    .single();
  
  if (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
  
  return convertToSupportTicket(data);
}

export async function searchSupportTickets(searchParams: {
  query: string;
  filters?: Record<string, string>;
}): Promise<SupportTicket[]> {
  if (!searchParams.query?.trim()) {
    throw new Error('Search query is required');
  }

  const sanitizedQuery = sanitizeString(searchParams.query);

  let query = supabase
    .from('support_tickets')
    .select('*')
    .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (searchParams.filters) {
    // Simple manual iteration to avoid deep type recursion
    const filters = searchParams.filters;
    if (filters.status && filters.status.trim()) {
      query = query.eq('status', sanitizeString(filters.status));
    }
    if (filters.priority && filters.priority.trim()) {
      query = query.eq('priority', sanitizeString(filters.priority));
    }
    if (filters.company_id && filters.company_id.trim()) {
      query = query.eq('company_id', sanitizeString(filters.company_id));
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching support tickets:', error);
    throw error;
  }
  
  const tickets: SupportTicket[] = (data || []).map(convertToSupportTicket);
  
  return tickets;
}

export async function uploadTicketAttachment(
  ticketId: string,
  file: File,
  messageId?: string
): Promise<{ id: string; file_url: string }> {
  if (!isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Upload file to storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('support-attachments')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('support-attachments')
    .getPublicUrl(fileName);

  // Create attachment record
  const { data, error } = await supabase
    .from('support_ticket_attachments')
    .insert({
      ticket_id: ticketId,
      message_id: messageId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: publicUrl,
      uploaded_by: user.id,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating attachment record:', error);
    throw error;
  }

  return {
    id: data.id,
    file_url: publicUrl,
  };
}

export async function fetchTicketAttachments(ticketId: string): Promise<any[]> {
  if (!isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  const { data, error } = await supabase
    .from('support_ticket_attachments')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at');

  if (error) {
    console.error(`Error fetching attachments for ticket ${ticketId}:`, error);
    throw error;
  }

  return data || [];
}

export async function getNotificationPreferences(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('support_notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }

  // Return default preferences if none exist
  return data || {
    ticket_created: true,
    ticket_updated: true,
    ticket_assigned: true,
    ticket_resolved: true,
    sla_breach: true,
    email_enabled: true,
  };
}

export async function updateNotificationPreferences(
  userId: string, 
  preferences: Record<string, boolean>
): Promise<any> {
  const { data, error } = await supabase
    .from('support_notification_preferences')
    .upsert({
      user_id: userId,
      ...preferences,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }

  return data;
}

export async function sendTicketNotification(
  ticketId: string,
  type: 'created' | 'updated' | 'assigned' | 'resolved',
  recipientIds: string[]
): Promise<void> {
  // This would integrate with your email service
  // For now, we'll just log the notification
  console.log('Sending notification:', {
    ticketId,
    type,
    recipientIds,
  });

  // You could integrate with services like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Resend
  
  // Example notification content generation
  const ticket = await fetchSupportTicketById(ticketId);
  const notificationContent = {
    created: `New support ticket created: ${ticket.title}`,
    updated: `Support ticket updated: ${ticket.title}`,
    assigned: `Support ticket assigned: ${ticket.title}`,
    resolved: `Support ticket resolved: ${ticket.title}`,
  }[type];

  // Store notification in database for in-app notifications
  for (const userId of recipientIds) {
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'info',
      title: 'Support Ticket Update',
      message: notificationContent,
    });
  }
}

export async function assignTicketToAgent(
  ticketId: string,
  agentId: string,
  notes?: string
): Promise<any> {
  if (!isValidUUID(ticketId) || !isValidUUID(agentId)) {
    throw new Error('Invalid ticket or agent ID format');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // First, deactivate existing assignments
  await supabase
    .from('ticket_assignments')
    .update({ is_active: false })
    .eq('ticket_id', ticketId);

  // Create new assignment
  const { data, error } = await supabase
    .from('ticket_assignments')
    .insert({
      ticket_id: ticketId,
      assigned_to: agentId,
      assigned_by: user.id,
      notes,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating ticket assignment:', error);
    throw error;
  }

  // Update ticket's assigned_to field
  const { error: updateError } = await supabase
    .from('support_tickets')
    .update({ assigned_to: agentId })
    .eq('id', ticketId);

  if (updateError) {
    console.error('Error updating ticket assigned_to:', updateError);
    throw updateError;
  }

  // Send notification
  await sendTicketNotification(ticketId, 'assigned', [agentId]);

  return data;
}
