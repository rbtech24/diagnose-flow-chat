
import { z } from 'zod';

// Common validation schemas
export const UuidSchema = z.string().uuid('Invalid UUID format');
export const EmailSchema = z.string().email('Invalid email format');
export const PhoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format').optional();

// Support ticket validation schemas
export const SupportTicketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed'], {
  errorMap: () => ({ message: 'Status must be one of: open, in_progress, resolved, closed' })
});

export const SupportTicketPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'], {
  errorMap: () => ({ message: 'Priority must be one of: low, medium, high, urgent' })
});

export const CreateSupportTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  priority: SupportTicketPrioritySchema.default('medium'),
  companyId: UuidSchema.optional(),
});

export const UpdateSupportTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters').optional(),
  status: SupportTicketStatusSchema.optional(),
  priority: SupportTicketPrioritySchema.optional(),
  assignedTo: UuidSchema.optional(),
});

export const SupportTicketMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(2000, 'Message must be less than 2000 characters'),
  ticket_id: UuidSchema,
});

// User validation schemas
export const UserRegistrationSchema = z.object({
  email: EmailSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  role: z.enum(['admin', 'company_admin', 'technician'], {
    errorMap: () => ({ message: 'Role must be one of: admin, company_admin, technician' })
  }),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters').optional(),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema,
  role: z.enum(['admin', 'company_admin', 'technician']).optional(),
});

// Company validation schemas
export const CompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  subscriptionTier: z.enum(['basic', 'professional', 'enterprise']).default('basic'),
});

// API key validation schemas
export const ApiKeyCreateSchema = z.object({
  name: z.string().min(1, 'API key name is required').max(50, 'Name must be less than 50 characters'),
  scopes: z.array(z.enum(['read', 'write', 'admin'])).min(1, 'At least one scope is required'),
  expiresIn: z.string().regex(/^\d+\s+(day|week|month|year)s?$/, 'Invalid expiration format (e.g., "30 days", "1 year")').optional(),
});

// Feature request validation schemas
export const FeatureRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description must be less than 5000 characters'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Repair/job validation schemas
export const RepairCreateSchema = z.object({
  customerId: UuidSchema,
  applianceId: UuidSchema,
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  estimatedCost: z.number().min(0, 'Cost must be non-negative').optional(),
  scheduledDate: z.string().datetime('Invalid date format').optional(),
});

// Dashboard validation schemas
export const DashboardWidgetSchema = z.object({
  type: z.enum(['metric', 'chart', 'table', 'list']),
  title: z.string().min(1, 'Widget title is required').max(100, 'Title must be less than 100 characters'),
  config: z.record(z.any()), // Flexible config object
  position: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(12),
  }),
  refreshInterval: z.number().min(5).max(3600).optional(), // 5 seconds to 1 hour
});

// File upload validation schemas
export const FileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9!#$&\-\^_]+$/, 'Invalid MIME type'),
  size: z.number().min(1, 'File size must be greater than 0').max(50 * 1024 * 1024, 'File size must be less than 50MB'),
});

// Pagination validation schemas
export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search validation schemas
export const SearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Query must be less than 100 characters'),
  filters: z.record(z.any()).optional(),
});
