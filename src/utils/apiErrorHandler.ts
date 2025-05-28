
import { toast } from '@/hooks/use-toast';

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
}

export class APIErrorHandler {
  private static readonly ERROR_MESSAGES = {
    network: 'Network error. Please check your connection and try again.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access to this resource is forbidden.',
    notFound: 'The requested resource was not found.',
    validation: 'Invalid data provided. Please check your input.',
    server: 'Internal server error. Please try again later.',
    unknown: 'An unexpected error occurred. Please try again.'
  };

  static handleError(error: any, context?: string): APIError {
    console.error('API Error:', error, 'Context:', context);

    let apiError: APIError;

    if (error?.message?.includes('fetch')) {
      // Network error
      apiError = {
        message: this.ERROR_MESSAGES.network,
        code: 'NETWORK_ERROR'
      };
    } else if (error?.name === 'AbortError') {
      // Request timeout
      apiError = {
        message: this.ERROR_MESSAGES.timeout,
        code: 'TIMEOUT_ERROR'
      };
    } else if (error?.status === 401) {
      // Unauthorized
      apiError = {
        message: this.ERROR_MESSAGES.unauthorized,
        code: 'UNAUTHORIZED',
        status: 401
      };
    } else if (error?.status === 403) {
      // Forbidden
      apiError = {
        message: this.ERROR_MESSAGES.forbidden,
        code: 'FORBIDDEN',
        status: 403
      };
    } else if (error?.status === 404) {
      // Not found
      apiError = {
        message: this.ERROR_MESSAGES.notFound,
        code: 'NOT_FOUND',
        status: 404
      };
    } else if (error?.status >= 400 && error?.status < 500) {
      // Client error
      apiError = {
        message: error?.message || this.ERROR_MESSAGES.validation,
        code: 'CLIENT_ERROR',
        status: error?.status
      };
    } else if (error?.status >= 500) {
      // Server error
      apiError = {
        message: this.ERROR_MESSAGES.server,
        code: 'SERVER_ERROR',
        status: error?.status
      };
    } else {
      // Unknown error
      apiError = {
        message: error?.message || this.ERROR_MESSAGES.unknown,
        code: 'UNKNOWN_ERROR',
        details: error
      };
    }

    return apiError;
  }

  static async handleAPICall<T>(
    apiCall: () => Promise<T>,
    context?: string,
    showToast = true
  ): Promise<APIResponse<T>> {
    try {
      const data = await apiCall();
      return { success: true, data };
    } catch (error) {
      const apiError = this.handleError(error, context);
      
      if (showToast) {
        toast({
          title: 'Error',
          description: apiError.message,
          variant: 'destructive'
        });
      }

      return { success: false, error: apiError };
    }
  }

  static createRetryWrapper<T>(
    apiCall: () => Promise<T>,
    maxRetries = 3,
    retryDelay = 1000
  ) {
    return async (): Promise<T> => {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await apiCall();
        } catch (error) {
          lastError = error;
          
          // Don't retry on client errors (4xx)
          if (error?.status >= 400 && error?.status < 500) {
            throw error;
          }
          
          if (attempt < maxRetries) {
            console.log(`API call failed, retrying... (${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          }
        }
      }
      
      throw lastError;
    };
  }

  static isNetworkError(error: APIError): boolean {
    return error.code === 'NETWORK_ERROR';
  }

  static isAuthError(error: APIError): boolean {
    return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN';
  }

  static isValidationError(error: APIError): boolean {
    return error.code === 'CLIENT_ERROR' || error.code === 'VALIDATION_ERROR';
  }

  static isServerError(error: APIError): boolean {
    return error.code === 'SERVER_ERROR';
  }
}

// Hook for easier use in React components
export const useAPIErrorHandler = () => {
  const handleAPICall = async <T>(
    apiCall: () => Promise<T>,
    context?: string,
    showToast = true
  ): Promise<APIResponse<T>> => {
    return APIErrorHandler.handleAPICall(apiCall, context, showToast);
  };

  const createRetryWrapper = <T>(
    apiCall: () => Promise<T>,
    maxRetries = 3,
    retryDelay = 1000
  ) => {
    return APIErrorHandler.createRetryWrapper(apiCall, maxRetries, retryDelay);
  };

  return {
    handleAPICall,
    createRetryWrapper,
    handleError: APIErrorHandler.handleError,
    isNetworkError: APIErrorHandler.isNetworkError,
    isAuthError: APIErrorHandler.isAuthError,
    isValidationError: APIErrorHandler.isValidationError,
    isServerError: APIErrorHandler.isServerError
  };
};
