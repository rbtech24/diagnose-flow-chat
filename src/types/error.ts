
// Comprehensive error handling types
export interface BaseError {
  message: string;
  code?: string;
  timestamp?: Date;
}

export interface ValidationError extends BaseError {
  field?: string;
  value?: unknown;
}

export interface NetworkError extends BaseError {
  status?: number;
  endpoint?: string;
}

export interface DatabaseError extends BaseError {
  query?: string;
  table?: string;
}

export interface FileUploadError extends BaseError {
  filename?: string;
  size?: number;
  type?: string;
}

export interface AuthenticationError extends BaseError {
  userId?: string;
  action?: string;
}

export type ApplicationError = 
  | ValidationError 
  | NetworkError 
  | DatabaseError 
  | FileUploadError 
  | AuthenticationError 
  | BaseError;

export interface ErrorHandlerResult {
  success: boolean;
  error?: ApplicationError;
  data?: unknown;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: {
    componentStack: string;
  };
}
