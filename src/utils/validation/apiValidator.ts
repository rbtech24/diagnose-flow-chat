
import { z } from 'zod';
import { APIError } from '@/utils/apiErrorHandler';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class APIValidator {
  /**
   * Validates data against a Zod schema and returns formatted result
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
    try {
      const result = schema.parse(data);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }));
        
        return {
          success: false,
          errors
        };
      }
      
      return {
        success: false,
        errors: [{
          field: 'unknown',
          message: 'Validation failed with unknown error',
          code: 'unknown_error'
        }]
      };
    }
  }

  /**
   * Validates data and throws APIError if validation fails
   */
  static validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
    const result = this.validate(schema, data);
    
    if (!result.success) {
      const errorMessage = result.errors?.map(e => `${e.field}: ${e.message}`).join(', ') || 'Validation failed';
      throw new APIError({
        message: `Validation failed: ${errorMessage}`,
        code: 'VALIDATION_ERROR',
        status: 400,
        details: {
          context,
          errors: result.errors
        }
      });
    }
    
    return result.data!;
  }

  /**
   * Validates request parameters (query params, path params)
   */
  static validateParams<T>(schema: z.ZodSchema<T>, params: Record<string, any>): ValidationResult<T> {
    // Convert string values to appropriate types for common cases
    const processedParams = { ...params };
    
    Object.keys(processedParams).forEach(key => {
      const value = processedParams[key];
      if (typeof value === 'string') {
        // Try to convert common numeric values
        if (/^\d+$/.test(value)) {
          processedParams[key] = parseInt(value, 10);
        } else if (/^\d*\.\d+$/.test(value)) {
          processedParams[key] = parseFloat(value);
        } else if (value === 'true' || value === 'false') {
          processedParams[key] = value === 'true';
        }
      }
    });
    
    return this.validate(schema, processedParams);
  }

  /**
   * Sanitizes string input to prevent XSS and injection attacks
   */
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/on\w+\s*=/gi, ''); // Remove event handlers
    }
    
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: Record<string, any> = {};
      Object.keys(input).forEach(key => {
        sanitized[key] = this.sanitizeInput(input[key]);
      });
      return sanitized;
    }
    
    return input;
  }

  /**
   * Validates file upload
   */
  static validateFileUpload(file: File, allowedTypes?: string[], maxSize?: number): ValidationResult<File> {
    const errors: ValidationError[] = [];
    
    // Check file size
    const maxFileSize = maxSize || 50 * 1024 * 1024; // 50MB default
    if (file.size > maxFileSize) {
      errors.push({
        field: 'size',
        message: `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        code: 'file_too_large'
      });
    }
    
    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      errors.push({
        field: 'type',
        message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        code: 'invalid_file_type'
      });
    }
    
    // Check file name
    if (file.name.length > 255) {
      errors.push({
        field: 'name',
        message: 'File name must be less than 255 characters',
        code: 'filename_too_long'
      });
    }
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    return { success: true, data: file };
  }

  /**
   * Validates UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Rate limiting validation - checks if user has exceeded request limits
   */
  static checkRateLimit(userId: string, action: string, limit: number, windowMs: number): boolean {
    // This would typically use Redis or another cache
    // For now, return true (not rate limited)
    console.log(`Rate limit check for user ${userId}, action ${action}: ${limit} requests per ${windowMs}ms`);
    return true;
  }
}
