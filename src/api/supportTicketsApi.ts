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

interface MessageRecord {
  id: string;
  ticket_id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface TicketRecord {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  user_id: string;
  created_by_user_id: string;
  assigned_to?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
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

// Simplified sanitization to avoid deep type instantiation
function sanitizeTicketData(data: { [key: string]: any }): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (value != null) {
      result[key] = String(value);
    }
  });
  return result;
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
  
  const ticketList: SupportTicket[] = (data || []).map((ticket) => ({
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
  }));
  
  return {
    tickets: ticketList,
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
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: validateStatus(data.status),
    priority: validatePriority(data.priority),
    user_id: data.user_id,
    created_by_user_id: data.created_by_user_id,
    assigned_to: data.assigned_to || undefined,
    company_id: data.company_id || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
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
  
  return (data || []).map((message: MessageRecord) => ({
    id: message.id,
    ticket_id: message.ticket_id,
    content: message.content,
    user_id: message.user_id,
    created_at: message.created_at,
    sender: null
  }));
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

  const sanitizedData = sanitizeTicketData(ticketData);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      title: sanitizedData.title,
      description: sanitizedData.description,
      priority: sanitizedData.priority || 'medium',
      user_id: user.id,
      created_by_user_id: user.id,
      company_id: sanitizedData.companyId
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: validateStatus(data.status),
    priority: validatePriority(data.priority),
    user_id: data.user_id,
    created_by_user_id: data.created_by_user_id,
    assigned_to: data.assigned_to || undefined,
    company_id: data.company_id || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
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

  const sanitizedData = sanitizeTicketData(messageData) as typeof messageData;

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .insert({
      content: sanitizedData.content,
      ticket_id: sanitizedData.ticket_id,
      user_id: user.id
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error adding message to ticket:', error);
    throw error;
  }
  
  return {
    id: data.id,
    ticket_id: data.ticket_id,
    content: data.content,
    user_id: data.user_id,
    created_at: data.created_at,
    sender: null
  };
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

  const sanitizedData = sanitizeTicketData(updateData);

  const { data, error } = await supabase
    .from('support_tickets')
    .update(sanitizedData)
    .eq('id', ticketId)
    .select('*')
    .single();
  
  if (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: validateStatus(data.status),
    priority: validatePriority(data.priority),
    user_id: data.user_id,
    created_by_user_id: data.created_by_user_id,
    assigned_to: data.assigned_to || undefined,
    company_id: data.company_id || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
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
    const filters = sanitizeTicketData(searchParams.filters);
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching support tickets:', error);
    throw error;
  }
  
  return (data || []).map((ticket: TicketRecord) => ({
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
  }));
}
