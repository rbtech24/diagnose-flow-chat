
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportTicketMessage } from "@/types/support";
import { ServerValidation } from "@/utils/validation/serverValidation";
import { APIValidator } from "@/utils/validation/apiValidator";
import { PaginationSchema, SearchSchema } from "@/utils/validation/schemas";

// Helper functions for type casting
function validateStatus(status: string): SupportTicket['status'] {
  const validStatuses: SupportTicket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
  return validStatuses.includes(status as SupportTicket['status']) 
    ? (status as SupportTicket['status']) 
    : 'open';
}

function validatePriority(priority: string): SupportTicket['priority'] {
  const validPriorities: SupportTicket['priority'][] = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority as SupportTicket['priority']) 
    ? (priority as SupportTicket['priority']) 
    : 'medium';
}

/**
 * Fetch support tickets with validation
 */
export async function fetchSupportTickets(
  status?: string, 
  companyId?: string,
  pagination?: unknown
): Promise<{ tickets: SupportTicket[]; total: number; page: number; limit: number }> {
  // Validate authentication
  const { userId } = await ServerValidation.validateAuth();
  
  // Validate pagination parameters
  const validatedPagination = pagination 
    ? APIValidator.validateOrThrow(PaginationSchema, pagination, 'fetchSupportTickets.pagination')
    : { page: 1, limit: 20, sortOrder: 'desc' as const };

  // Validate company access if specified
  if (companyId) {
    await ServerValidation.validateCompanyAccess(userId, companyId);
  }

  // Validate rate limiting
  await ServerValidation.validateRateLimit(userId, 'api_request');

  let query = supabase.from('support_tickets').select(`
    *
  `, { count: 'exact' });
  
  // Apply filters if provided
  if (status && status !== 'all') {
    // Validate status value
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status filter. Must be one of: ${validStatuses.join(', ')}`);
    }
    query = query.eq('status', status);
  }
  
  if (companyId) {
    if (!APIValidator.isValidUUID(companyId)) {
      throw new Error('Invalid company ID format');
    }
    query = query.eq('company_id', companyId);
  }
  
  // Apply pagination
  const offset = (validatedPagination.page - 1) * validatedPagination.limit;
  query = query
    .order('created_at', { ascending: validatedPagination.sortOrder === 'asc' })
    .range(offset, offset + validatedPagination.limit - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
  
  // Transform data to match SupportTicket interface
  const tickets: SupportTicket[] = (data || []).map((ticket: any) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: validateStatus(ticket.status),
    priority: validatePriority(ticket.priority),
    user_id: ticket.user_id,
    created_by_user_id: ticket.created_by_user_id,
    assigned_to: ticket.assigned_to,
    company_id: ticket.company_id,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    created_by_user: null // Will be populated separately if needed
  }));
  
  return {
    tickets,
    total: count || 0,
    page: validatedPagination.page,
    limit: validatedPagination.limit
  };
}

/**
 * Fetch a single support ticket by ID with validation
 */
export async function fetchSupportTicketById(ticketId: string): Promise<SupportTicket> {
  // Validate authentication
  const { userId } = await ServerValidation.validateAuth();
  
  // Validate UUID format
  if (!APIValidator.isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  // Validate rate limiting
  await ServerValidation.validateRateLimit(userId, 'api_request');

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

  // Validate user has access to this ticket
  const { data: userRole } = await supabase
    .from('technicians')
    .select('role, company_id')
    .eq('id', userId)
    .single();

  const hasAccess = 
    data.user_id === userId || // User owns the ticket
    userRole?.role === 'admin' || // User is admin
    (userRole?.company_id === data.company_id && ['company_admin'].includes(userRole.role)); // Company admin

  if (!hasAccess) {
    throw new Error('Access denied to this ticket');
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: validateStatus(data.status),
    priority: validatePriority(data.priority),
    user_id: data.user_id,
    created_by_user_id: data.created_by_user_id,
    assigned_to: data.assigned_to,
    company_id: data.company_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
}

/**
 * Fetch messages for a specific support ticket with validation
 */
export async function fetchTicketMessages(ticketId: string): Promise<SupportTicketMessage[]> {
  // Validate authentication
  const { userId } = await ServerValidation.validateAuth();
  
  // Validate UUID format
  if (!APIValidator.isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  // Validate rate limiting
  await ServerValidation.validateRateLimit(userId, 'api_request');

  // First verify user has access to the ticket
  await fetchSupportTicketById(ticketId);

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at');
  
  if (error) {
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    throw error;
  }
  
  return (data || []).map((message: any) => ({
    id: message.id,
    ticket_id: message.ticket_id,
    content: message.content,
    user_id: message.user_id,
    created_at: message.created_at,
    sender: null // Will be populated separately if needed
  }));
}

/**
 * Create a new support ticket with validation
 */
export async function createSupportTicket(ticketData: unknown): Promise<SupportTicket> {
  // Validate and sanitize input
  const validatedData = await ServerValidation.validateCreateSupportTicket(ticketData);
  
  // Validate rate limiting
  await ServerValidation.validateRateLimit(validatedData.userId, 'create_ticket');

  // Sanitize input to prevent XSS
  const sanitizedData = APIValidator.sanitizeInput(validatedData);

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      title: sanitizedData.title,
      description: sanitizedData.description,
      priority: sanitizedData.priority || 'medium',
      user_id: sanitizedData.userId,
      created_by_user_id: sanitizedData.createdByUserId,
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
    assigned_to: data.assigned_to,
    company_id: data.company_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
}

/**
 * Add a message to a support ticket with validation
 */
export async function addTicketMessage(messageData: unknown): Promise<SupportTicketMessage> {
  // Validate and sanitize input
  const validatedData = await ServerValidation.validateCreateTicketMessage(messageData);
  
  // Validate rate limiting
  await ServerValidation.validateRateLimit(validatedData.user_id, 'send_message');

  // Sanitize input to prevent XSS
  const sanitizedData = APIValidator.sanitizeInput(validatedData);

  const { data, error } = await supabase
    .from('support_ticket_messages')
    .insert({
      content: sanitizedData.content,
      ticket_id: sanitizedData.ticket_id,
      user_id: sanitizedData.user_id
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

/**
 * Update a support ticket with validation
 */
export async function updateSupportTicket(
  ticketId: string, 
  updateData: unknown
): Promise<SupportTicket> {
  // Validate UUID format
  if (!APIValidator.isValidUUID(ticketId)) {
    throw new Error('Invalid ticket ID format');
  }

  // Validate and sanitize input
  const validatedData = await ServerValidation.validateUpdateSupportTicket(ticketId, updateData);
  
  // Validate rate limiting
  const { userId } = await ServerValidation.validateAuth();
  await ServerValidation.validateRateLimit(userId, 'api_request');

  // Sanitize input to prevent XSS
  const sanitizedData = APIValidator.sanitizeInput(validatedData);

  const { data, error } = await supabase
    .from('support_tickets')
    .update({
      ...sanitizedData,
      updated_at: new Date().toISOString()
    })
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
    assigned_to: data.assigned_to,
    company_id: data.company_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by_user: null
  };
}

/**
 * Search support tickets with validation
 */
export async function searchSupportTickets(searchParams: unknown): Promise<SupportTicket[]> {
  // Validate authentication
  const { userId } = await ServerValidation.validateAuth();
  
  // Validate search parameters
  const validatedParams = APIValidator.validateOrThrow(SearchSchema, searchParams, 'searchSupportTickets');
  
  // Validate rate limiting
  await ServerValidation.validateRateLimit(userId, 'api_request');

  // Sanitize search query
  const sanitizedQuery = APIValidator.sanitizeInput(validatedParams.query);

  let query = supabase
    .from('support_tickets')
    .select('*')
    .or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
    .order('created_at', { ascending: false })
    .limit(50); // Limit search results

  // Apply additional filters if provided
  if (validatedParams.filters) {
    Object.entries(validatedParams.filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching support tickets:', error);
    throw error;
  }
  
  return (data || []).map((ticket: any) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: validateStatus(ticket.status),
    priority: validatePriority(ticket.priority),
    user_id: ticket.user_id,
    created_by_user_id: ticket.created_by_user_id,
    assigned_to: ticket.assigned_to,
    company_id: ticket.company_id,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    created_by_user: null
  }));
}
