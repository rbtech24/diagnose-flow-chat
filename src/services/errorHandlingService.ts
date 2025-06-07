import { toast } from "@/components/ui/use-toast";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  companyId?: string;
  metadata?: Record<string, any>;
  type?: string;
  endpoint?: string;
  status?: number;
  attempts?: number;
}

export interface ErrorLog {
  id: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: Date;
  resolved: boolean;
}

export type ErrorLevel = 'error' | 'warning' | 'info';

class ErrorHandlingService {
  private errorLogs: ErrorLog[] = [];
  private readonly maxLogs = 1000;

  /**
   * Log an error with context
   */
  logError(
    error: Error | string,
    level: ErrorLevel = 'error',
    context: ErrorContext = {}
  ): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = error instanceof Error ? error.stack : undefined;
    
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      level,
      message: errorMessage,
      stack,
      context,
      timestamp: new Date(),
      resolved: false
    };

    // Add to in-memory logs
    this.errorLogs.unshift(errorLog);
    
    // Keep only recent logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxLogs);
    }

    // Log to console for development
    const consoleMethod = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'info';
    console[consoleMethod](`[${level.toUpperCase()}]`, errorMessage, {
      context,
      stack,
      timestamp: errorLog.timestamp
    });

    // Show user-friendly notification for errors
    if (level === 'error') {
      this.showErrorToast(errorMessage, context);
    }

    return errorLog.id;
  }

  /**
   * Handle async operations with error catching
   */
  async handleAsync<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    options?: {
      fallbackValue?: T;
      showToast?: boolean;
      retries?: number;
    }
  ): Promise<{ data: T | undefined; error: Error | null; errorId?: string }> {
    const retries = options?.retries || 0;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await operation();
        return { data, error: null };
      } catch (error) {
        lastError = error as Error;
        
        // If this is not the last attempt, wait before retrying
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }
      }
    }

    // All attempts failed
    const errorId = this.logError(
      lastError || new Error('Unknown error'),
      'error',
      { ...context, attempts: retries + 1 }
    );

    if (options?.showToast !== false) {
      this.showErrorToast(lastError?.message || 'An unexpected error occurred', context);
    }

    return {
      data: options?.fallbackValue,
      error: lastError,
      errorId
    };
  }

  /**
   * Handle form submission errors
   */
  handleFormError(
    error: Error | string,
    context: ErrorContext = {}
  ): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    // Parse validation errors
    if (errorMessage.includes('validation')) {
      return this.logError(
        `Form validation failed: ${errorMessage}`,
        'warning',
        { ...context, type: 'validation' }
      );
    }

    // Parse network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return this.logError(
        'Network error occurred. Please check your connection.',
        'error',
        { ...context, type: 'network' }
      );
    }

    // Parse authentication errors
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
      return this.logError(
        'Authentication error. Please log in again.',
        'error',
        { ...context, type: 'auth' }
      );
    }

    // Generic form error
    return this.logError(
      errorMessage,
      'error',
      { ...context, type: 'form' }
    );
  }

  /**
   * Handle API errors with specific formatting
   */
  handleApiError(
    error: Error | any,
    endpoint: string,
    context: ErrorContext = {}
  ): string {
    let errorMessage = 'API request failed';
    let level: ErrorLevel = 'error';

    if (error?.response) {
      // HTTP error response
      const status = error.response.status;
      const statusText = error.response.statusText;
      
      if (status >= 400 && status < 500) {
        level = 'warning';
        errorMessage = `Client error (${status}): ${statusText}`;
      } else if (status >= 500) {
        errorMessage = `Server error (${status}): ${statusText}`;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return this.logError(
      errorMessage,
      level,
      { 
        ...context, 
        endpoint,
        type: 'api',
        status: error?.response?.status
      }
    );
  }

  /**
   * Get error logs with filtering
   */
  getErrorLogs(filters?: {
    level?: ErrorLevel;
    component?: string;
    resolved?: boolean;
    limit?: number;
  }): ErrorLog[] {
    let logs = [...this.errorLogs];

    if (filters?.level) {
      logs = logs.filter(log => log.level === filters.level);
    }

    if (filters?.component) {
      logs = logs.filter(log => log.context.component === filters.component);
    }

    if (filters?.resolved !== undefined) {
      logs = logs.filter(log => log.resolved === filters.resolved);
    }

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string): boolean {
    const errorLog = this.errorLogs.find(log => log.id === errorId);
    if (errorLog) {
      errorLog.resolved = true;
      return true;
    }
    return false;
  }

  /**
   * Clear all error logs
   */
  clearLogs(): void {
    this.errorLogs = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byLevel: Record<ErrorLevel, number>;
    resolved: number;
    unresolved: number;
  } {
    const total = this.errorLogs.length;
    const byLevel = {
      error: this.errorLogs.filter(log => log.level === 'error').length,
      warning: this.errorLogs.filter(log => log.level === 'warning').length,
      info: this.errorLogs.filter(log => log.level === 'info').length,
    };
    const resolved = this.errorLogs.filter(log => log.resolved).length;
    const unresolved = total - resolved;

    return { total, byLevel, resolved, unresolved };
  }

  /**
   * Show user-friendly error toast
   */
  private showErrorToast(message: string, context: ErrorContext): void {
    let title = 'Error';
    let description = message;

    // Customize based on context
    if (context.action) {
      title = `Error in ${context.action}`;
    }

    if (context.component) {
      description = `${context.component}: ${message}`;
    }

    // Truncate long messages
    if (description.length > 150) {
      description = description.substring(0, 147) + '...';
    }

    toast({
      variant: "destructive",
      title,
      description,
    });
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const errorHandlingService = new ErrorHandlingService();

// Export convenience functions
export const logError = (error: Error | string, level?: ErrorLevel, context?: ErrorContext) => 
  errorHandlingService.logError(error, level, context);

export const handleAsync = <T>(
  operation: () => Promise<T>,
  context?: ErrorContext,
  options?: Parameters<typeof errorHandlingService.handleAsync>[2]
) => errorHandlingService.handleAsync(operation, context, options);

export const handleFormError = (error: Error | string, context?: ErrorContext) =>
  errorHandlingService.handleFormError(error, context);

export const handleApiError = (error: any, endpoint: string, context?: ErrorContext) =>
  errorHandlingService.handleApiError(error, endpoint, context);
