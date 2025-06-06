
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportTicketMessage } from "@/types/support";
import { ServerValidation } from "@/utils/validation/serverValidation";
import { APIValidator } from "@/utils/validation/apiValidator";
import { PaginationSchema, SearchSchema } from "@/utils/validation/schemas";

/**
 * Fetch support tickets with validation
 * @param status Filter by ticket status (optional)
 * @param companyId Filter by company ID (optional)
 * @param pagination Pagination parameters
 * @returns Array of support tickets
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
    *,
    created_by_user:created_by_user_id(
      name,
      email,
      avatar_url,
      role
    )
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
  
  return {
    tickets: data as unknown as SupportTicket[],
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
    .select(`
      *,
      created_by_user:created_by_user_id(
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
  
  return data as unknown as SupportTicket;
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
    .select(`
      *,
      created_by_user:created_by_user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .single();
  
  if (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
  
  return data as SupportTicket;
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
    .select(`
      *,
      sender:user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .single();
  
  if (error) {
    console.error('Error adding message to ticket:', error);
    throw error;
  }
  
  return data as SupportTicketMessage;
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
    .select(`
      *,
      created_by_user:created_by_user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .single();
  
  if (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
  
  return data as SupportTicket;
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
    .select(`
      *,
      created_by_user:created_by_user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
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
  
  return data as unknown as SupportTicket[];
}
