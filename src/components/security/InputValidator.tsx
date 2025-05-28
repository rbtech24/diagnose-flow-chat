
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const contentSchema = z.string()
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
  }, 'Content contains potentially unsafe elements');

// Sanitize HTML content more thoroughly
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

// Input validation utility
export const validateInput = function<T>(schema: z.ZodSchema<T>, value: unknown): { isValid: boolean; error?: string; data?: T } {
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
