
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { ApplicationError, ErrorHandlerResult } from '@/types/error';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler() {
  const handleError = useCallback((
    error: Error | ApplicationError | unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ): string => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred'
    } = options;

    // Log error
    if (logError) {
      console.error(`Error in ${context || 'unknown context'}:`, error);
    }

    // Extract error message with proper typing
    let message = fallbackMessage;
    let code: string | undefined;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      const appError = error as ApplicationError;
      message = appError.message;
      code = appError.code;
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      console.error('Production error logged:', { error, context, message, code });
    }

    return message;
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    options: ErrorHandlerOptions = {}
  ): Promise<ErrorHandlerResult> => {
    try {
      const data = await asyncFn();
      return { success: true, data };
    } catch (error) {
      const message = handleError(error, context, options);
      const applicationError: ApplicationError = {
        message,
        code: 'ASYNC_OPERATION_ERROR',
        timestamp: new Date()
      };
      return { success: false, error: applicationError };
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}
