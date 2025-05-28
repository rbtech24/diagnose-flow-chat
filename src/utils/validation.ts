
import { z } from 'zod';

// Common validation schemas
export const commonValidation = {
  email: z.string().email('Invalid email format'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  content: z.string()
    .max(10000, 'Content too long')
    .refine((val) => {
      // Check for potential XSS patterns
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];
      return !xssPatterns.some(pattern => pattern.test(val));
    }, 'Content contains potentially unsafe elements'),

  url: z.string().url('Invalid URL format'),
  
  uuid: z.string().uuid('Invalid UUID format'),
  
  positiveNumber: z.number().positive('Must be a positive number'),
  
  nonEmptyString: z.string().min(1, 'This field is required')
};

// Form-specific validation schemas
export const formValidation = {
  userRegistration: z.object({
    email: commonValidation.email,
    password: commonValidation.password,
    confirmPassword: z.string(),
    name: commonValidation.name,
    phone: commonValidation.phone.optional(),
    company: z.string().min(2, 'Company name must be at least 2 characters').optional(),
    role: z.enum(['admin', 'company_admin', 'tech'], {
      errorMap: () => ({ message: 'Invalid role selected' })
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  userLogin: z.object({
    email: commonValidation.email,
    password: z.string().min(1, 'Password is required')
  }),

  passwordReset: z.object({
    email: commonValidation.email
  }),

  profileUpdate: z.object({
    name: commonValidation.name,
    email: commonValidation.email,
    phone: commonValidation.phone.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional()
  }),

  communityPost: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    content: commonValidation.content,
    type: z.enum(['question', 'discussion', 'announcement'], {
      errorMap: () => ({ message: 'Invalid post type' })
    }),
    tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed')
  }),

  featureRequest: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: commonValidation.content,
    priority: z.enum(['low', 'medium', 'high'], {
      errorMap: () => ({ message: 'Invalid priority level' })
    }),
    category: z.string().min(1, 'Category is required')
  }),

  supportTicket: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: commonValidation.content,
    priority: z.enum(['low', 'medium', 'high', 'urgent'], {
      errorMap: () => ({ message: 'Invalid priority level' })
    }),
    category: z.string().min(1, 'Category is required')
  })
};

// Validation utility functions
export const validateInput = <T>(schema: z.ZodSchema<T>, value: unknown): { 
  isValid: boolean; 
  error?: string; 
  data?: T 
} => {
  try {
    const data = schema.parse(value);
    return { isValid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Validation failed' };
    }
    return { isValid: false, error: 'Unknown validation error' };
  }
};

export const sanitizeHtml = (html: string): string => {
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove style expressions
    .replace(/expression\s*\([^)]*\)/gi, '')
    // Remove iframe, object, embed tags
    .replace(/<(iframe|object|embed)[^>]*>/gi, '')
    // Remove data: urls in src attributes
    .replace(/src\s*=\s*["']data:[^"']*["']/gi, '');
};

// File validation
export const fileValidation = {
  image: z.object({
    file: z.instanceof(File),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
    type: z.string().refine(
      (type) => type.startsWith('image/'),
      'File must be an image'
    )
  }),

  document: z.object({
    file: z.instanceof(File),
    size: z.number().max(50 * 1024 * 1024, 'File size must be less than 50MB'),
    type: z.string().refine(
      (type) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type),
      'File must be a PDF or Word document'
    )
  })
};

export const validateFile = (file: File, type: 'image' | 'document') => {
  const schema = type === 'image' ? fileValidation.image : fileValidation.document;
  return validateInput(schema, { file, size: file.size, type: file.type });
};
