
import { supabase } from '@/integrations/supabase/client';
import { APIValidator, APIError } from './apiValidator';
import {
  CreateSupportTicketSchema,
  UpdateSupportTicketSchema,
  SupportTicketMessageSchema,
  UserRegistrationSchema,
  CompanySchema,
  RepairCreateSchema
} from './schemas';

export class ServerValidation {
  /**
   * Validates user authentication and returns user data
   */
  static async validateAuth(): Promise<{ user: any; userId: string }> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      throw new APIError({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
        status: 401
      });
    }
    
    return { user, userId: user.id };
  }

  /**
   * Validates user permissions for company access
   */
  static async validateCompanyAccess(userId: string, companyId: string): Promise<void> {
    const { data, error } = await supabase
      .from('technicians')
      .select('company_id, role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new APIError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404
      });
    }

    // Admin can access any company
    if (data.role === 'admin') {
      return;
    }

    // Users can only access their own company
    if (data.company_id !== companyId) {
      throw new APIError({
        message: 'Access denied to this company',
        code: 'FORBIDDEN',
        status: 403
      });
    }
  }

  /**
   * Validates support ticket creation
   */
  static async validateCreateSupportTicket(data: unknown): Promise<any> {
    const { user } = await this.validateAuth();
    const validatedData = APIValidator.validateOrThrow(CreateSupportTicketSchema, data, 'createSupportTicket');
    
    // Additional business logic validation
    if (validatedData.companyId) {
      await this.validateCompanyAccess(user.id, validatedData.companyId);
    }

    return {
      ...validatedData,
      userId: user.id,
      createdByUserId: user.id
    };
  }

  /**
   * Validates support ticket update
   */
  static async validateUpdateSupportTicket(ticketId: string, data: unknown): Promise<any> {
    const { user } = await this.validateAuth();
    const validatedData = APIValidator.validateOrThrow(UpdateSupportTicketSchema, data, 'updateSupportTicket');
    
    // Check if ticket exists and user has permission
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('user_id, company_id')
      .eq('id', ticketId)
      .single();

    if (error || !ticket) {
      throw new APIError({
        message: 'Support ticket not found',
        code: 'TICKET_NOT_FOUND',
        status: 404
      });
    }

    // Check permissions: user can update their own tickets, or admins can update any
    const { data: userRole } = await supabase
      .from('technicians')
      .select('role, company_id')
      .eq('id', user.id)
      .single();

    const canUpdate = 
      ticket.user_id === user.id || // User owns the ticket
      userRole?.role === 'admin' || // User is admin
      (userRole?.company_id === ticket.company_id && ['company_admin'].includes(userRole.role)); // Company admin

    if (!canUpdate) {
      throw new APIError({
        message: 'Permission denied to update this ticket',
        code: 'FORBIDDEN',
        status: 403
      });
    }

    return validatedData;
  }

  /**
   * Validates support ticket message creation
   */
  static async validateCreateTicketMessage(data: unknown): Promise<any> {
    const { user } = await this.validateAuth();
    const validatedData = APIValidator.validateOrThrow(SupportTicketMessageSchema, data, 'createTicketMessage');
    
    // Check if ticket exists and user has access
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .select('user_id, company_id, status')
      .eq('id', validatedData.ticket_id)
      .single();

    if (error || !ticket) {
      throw new APIError({
        message: 'Support ticket not found',
        code: 'TICKET_NOT_FOUND',
        status: 404
      });
    }

    // Prevent adding messages to closed tickets (unless admin)
    if (ticket.status === 'closed') {
      const { data: userRole } = await supabase
        .from('technicians')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userRole?.role !== 'admin') {
        throw new APIError({
          message: 'Cannot add messages to closed tickets',
          code: 'TICKET_CLOSED',
          status: 400
        });
      }
    }

    return {
      ...validatedData,
      user_id: user.id
    };
  }

  /**
   * Validates user registration
   */
  static async validateUserRegistration(data: unknown): Promise<any> {
    const validatedData = APIValidator.validateOrThrow(UserRegistrationSchema, data, 'userRegistration');
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('technicians')
      .select('email')
      .eq('email', validatedData.email)
      .single();

    if (existingUser) {
      throw new APIError({
        message: 'Email already exists',
        code: 'EMAIL_EXISTS',
        status: 409
      });
    }

    // Additional role-specific validation
    if (validatedData.role === 'company_admin' && !validatedData.companyName) {
      throw new APIError({
        message: 'Company name is required for company admin registration',
        code: 'COMPANY_NAME_REQUIRED',
        status: 400
      });
    }

    return validatedData;
  }

  /**
   * Validates company creation/update
   */
  static async validateCompanyOperation(data: unknown, isUpdate: boolean = false): Promise<any> {
    const { user } = await this.validateAuth();
    const validatedData = APIValidator.validateOrThrow(CompanySchema, data, 'companyOperation');
    
    // Only admins can create/update companies
    const { data: userRole } = await supabase
      .from('technicians')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userRole?.role !== 'admin') {
      throw new APIError({
        message: 'Only administrators can manage companies',
        code: 'INSUFFICIENT_PERMISSIONS',
        status: 403
      });
    }

    return validatedData;
  }

  /**
   * Validates repair/job creation
   */
  static async validateCreateRepair(data: unknown): Promise<any> {
    const { user } = await this.validateAuth();
    const validatedData = APIValidator.validateOrThrow(RepairCreateSchema, data, 'createRepair');
    
    // Verify customer exists and belongs to user's company
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('company_id')
      .eq('id', validatedData.customerId)
      .single();

    if (customerError || !customer) {
      throw new APIError({
        message: 'Customer not found',
        code: 'CUSTOMER_NOT_FOUND',
        status: 404
      });
    }

    // Verify appliance exists and belongs to the customer
    const { data: appliance, error: applianceError } = await supabase
      .from('customer_appliances')
      .select('customer_id')
      .eq('id', validatedData.applianceId)
      .single();

    if (applianceError || !appliance || appliance.customer_id !== validatedData.customerId) {
      throw new APIError({
        message: 'Appliance not found or does not belong to customer',
        code: 'APPLIANCE_NOT_FOUND',
        status: 404
      });
    }

    // Check company access
    await this.validateCompanyAccess(user.id, customer.company_id);

    return {
      ...validatedData,
      technicianId: user.id,
      companyId: customer.company_id
    };
  }

  /**
   * Validates file upload
   */
  static async validateFileUpload(file: File, allowedTypes?: string[]): Promise<void> {
    const { user } = await this.validateAuth();
    
    const validationResult = APIValidator.validateFileUpload(file, allowedTypes);
    
    if (!validationResult.success) {
      throw new APIError({
        message: 'File validation failed',
        code: 'INVALID_FILE',
        status: 400,
        details: validationResult.errors
      });
    }

    // Additional server-side checks
    if (file.size === 0) {
      throw new APIError({
        message: 'Empty files are not allowed',
        code: 'EMPTY_FILE',
        status: 400
      });
    }

    // Check for malicious file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (dangerousExtensions.includes(fileExtension)) {
      throw new APIError({
        message: 'File type not allowed for security reasons',
        code: 'DANGEROUS_FILE_TYPE',
        status: 400
      });
    }
  }

  /**
   * Validates API rate limits
   */
  static async validateRateLimit(userId: string, action: string): Promise<void> {
    // In a production environment, this would check Redis or another cache
    // For now, we'll implement basic in-memory rate limiting
    
    const limits: Record<string, { requests: number; windowMs: number }> = {
      'create_ticket': { requests: 10, windowMs: 60000 }, // 10 tickets per minute
      'send_message': { requests: 30, windowMs: 60000 }, // 30 messages per minute
      'upload_file': { requests: 20, windowMs: 60000 }, // 20 uploads per minute
      'api_request': { requests: 100, windowMs: 60000 }, // 100 API requests per minute
    };

    const limit = limits[action];
    if (!limit) return; // No limit defined for this action

    const isWithinLimit = APIValidator.checkRateLimit(userId, action, limit.requests, limit.windowMs);
    
    if (!isWithinLimit) {
      throw new APIError({
        message: `Rate limit exceeded for ${action}. Please try again later.`,
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429
      });
    }
  }

  /**
   * Validates data export permissions
   */
  static async validateDataExport(userId: string, dataType: string, companyId?: string): Promise<void> {
    const { data: userRole } = await supabase
      .from('technicians')
      .select('role, company_id')
      .eq('id', userId)
      .single();

    if (!userRole) {
      throw new APIError({
        message: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 404
      });
    }

    // Only admins and company admins can export data
    const canExport = ['admin', 'company_admin'].includes(userRole.role);
    
    if (!canExport) {
      throw new APIError({
        message: 'Insufficient permissions to export data',
        code: 'INSUFFICIENT_PERMISSIONS',
        status: 403
      });
    }

    // Company admins can only export their own company data
    if (userRole.role === 'company_admin' && companyId && userRole.company_id !== companyId) {
      throw new APIError({
        message: 'Cannot export data from other companies',
        code: 'FORBIDDEN',
        status: 403
      });
    }
  }
}
