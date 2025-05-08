
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
  original?: any;
}

/**
 * Convert different error types to a standardized ApiError format
 */
export function normalizeError(error: unknown): ApiError {
  // Handle PostgrestError from Supabase
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    return {
      message: pgError.message || 'Database error',
      status: parseInt(pgError.code),
      details: pgError.details || undefined,
      original: pgError
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An error occurred',
      details: error.stack,
      original: error
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Handle unknown error types
  return {
    message: 'An unknown error occurred',
    original: error
  };
}

/**
 * Handle API errors with consistent logging and optional UI notification
 */
export function handleApiError(error: unknown, context: string, showToast = true): ApiError {
  const normalizedError = normalizeError(error);
  
  // Log detailed error information for debugging
  console.error(`API Error in ${context}:`, normalizedError);

  // Show toast notification if requested
  if (showToast) {
    toast.error(normalizedError.message, {
      description: normalizedError.details || `Error occurred while ${context}`
    });
  }

  return normalizedError;
}

/**
 * Wraps an async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string,
  showToast = true
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const normalizedError = handleApiError(error, context, showToast);
    return { data: null, error: normalizedError };
  }
}

/**
 * Create loading/error states for async operations
 */
export function createAsyncState() {
  return {
    loading: false,
    error: null as ApiError | null,
    setLoading: (isLoading: boolean) => isLoading,
    setError: (error: ApiError | null) => error
  };
}
