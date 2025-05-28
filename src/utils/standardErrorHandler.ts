
import { toast } from '@/hooks/use-toast';
import { ApplicationError } from '@/types/error';

export interface StandardErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  context?: string;
}

export class StandardErrorHandler {
  private static readonly ERROR_MESSAGES = {
    network: 'Network error. Please check your connection and try again.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access to this resource is forbidden.',
    notFound: 'The requested resource was not found.',
    validation: 'Invalid data provided. Please check your input.',
    server: 'Internal server error. Please try again later.',
    unknown: 'An unexpected error occurred. Please try again.',
    offline: 'You appear to be offline. Please check your connection.',
    rateLimit: 'Too many requests. Please wait a moment and try again.'
  };

  static handle(
    error: Error | ApplicationError | unknown,
    options: StandardErrorHandlerOptions = {}
  ): string {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = this.ERROR_MESSAGES.unknown,
      context = 'unknown'
    } = options;

    // Log error with context
    if (logError) {
      console.error(`[${context}] Error:`, error);
      
      // Send to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        this.sendToMonitoring(error, context);
      }
    }

    const message = this.extractErrorMessage(error, fallbackMessage);
    const errorCode = this.extractErrorCode(error);

    // Show user-friendly toast notification
    if (showToast) {
      toast({
        title: this.getErrorTitle(errorCode),
        description: message,
        variant: 'destructive'
      });
    }

    return message;
  }

  static async handleAsync<T>(
    asyncFn: () => Promise<T>,
    options: StandardErrorHandlerOptions = {}
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await asyncFn();
      return { success: true, data };
    } catch (error) {
      const message = this.handle(error, options);
      return { success: false, error: message };
    }
  }

  private static extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as any).message);
    }
    
    return fallback;
  }

  private static extractErrorCode(error: unknown): string {
    if (error && typeof error === 'object') {
      const err = error as any;
      
      // Check for HTTP status codes
      if (err.status) {
        if (err.status === 401) return 'unauthorized';
        if (err.status === 403) return 'forbidden';
        if (err.status === 404) return 'notFound';
        if (err.status === 429) return 'rateLimit';
        if (err.status >= 500) return 'server';
        if (err.status >= 400) return 'validation';
      }
      
      // Check for network errors
      if (err.name === 'NetworkError' || err.message?.includes('fetch')) {
        return 'network';
      }
      
      // Check for timeout errors
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        return 'timeout';
      }
      
      // Check for custom error codes
      if (err.code) {
        return err.code;
      }
    }
    
    return 'unknown';
  }

  private static getErrorTitle(errorCode: string): string {
    switch (errorCode) {
      case 'network':
      case 'offline':
        return 'Connection Error';
      case 'unauthorized':
      case 'forbidden':
        return 'Access Denied';
      case 'validation':
        return 'Invalid Input';
      case 'server':
        return 'Server Error';
      case 'rateLimit':
        return 'Rate Limited';
      case 'timeout':
        return 'Request Timeout';
      default:
        return 'Error';
    }
  }

  private static sendToMonitoring(error: unknown, context: string): void {
    // Implement your monitoring service integration here
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    console.log('Sending error to monitoring service:', { error, context });
  }

  // Utility methods for common error scenarios
  static handleNetworkError(error: unknown, options?: StandardErrorHandlerOptions) {
    return this.handle(error, {
      ...options,
      context: 'network',
      fallbackMessage: this.ERROR_MESSAGES.network
    });
  }

  static handleValidationError(error: unknown, options?: StandardErrorHandlerOptions) {
    return this.handle(error, {
      ...options,
      context: 'validation',
      fallbackMessage: this.ERROR_MESSAGES.validation
    });
  }

  static handleAuthError(error: unknown, options?: StandardErrorHandlerOptions) {
    return this.handle(error, {
      ...options,
      context: 'authentication',
      fallbackMessage: this.ERROR_MESSAGES.unauthorized
    });
  }

  // Retry wrapper for transient errors
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000,
    options?: StandardErrorHandlerOptions
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error && typeof error === 'object' && (error as any).status >= 400 && (error as any).status < 500) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    // All attempts failed
    this.handle(lastError, { ...options, context: 'retry-failed' });
    throw lastError;
  }
}

// Hook for easier use in React components
export function useStandardErrorHandler() {
  return {
    handle: StandardErrorHandler.handle,
    handleAsync: StandardErrorHandler.handleAsync,
    handleNetworkError: StandardErrorHandler.handleNetworkError,
    handleValidationError: StandardErrorHandler.handleValidationError,
    handleAuthError: StandardErrorHandler.handleAuthError,
    withRetry: StandardErrorHandler.withRetry
  };
}
