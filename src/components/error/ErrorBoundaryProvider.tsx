
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface ErrorBoundaryProviderProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  level: 'global' | 'page' | 'section' | 'component';
}

interface ErrorBoundaryProviderState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  retryCount: number;
}

export class ErrorBoundaryProvider extends Component<ErrorBoundaryProviderProps, ErrorBoundaryProviderState> {
  private maxRetries = 3;

  constructor(props: ErrorBoundaryProviderProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: this.generateErrorId(),
      retryCount: 0
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryProviderState> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId;
    const level = this.props.level;

    // Log error with comprehensive details
    logger.error(`${level} Error Boundary: ${error.message}`, 'ErrorBoundary', {
      errorId,
      level,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
      props: this.props.isolate ? 'isolated' : 'inherited',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToMonitoring(error, errorInfo, errorId);
    }
  }

  private sendErrorToMonitoring(error: Error, errorInfo: ErrorInfo, errorId: string): void {
    // Implement error monitoring service integration
    console.log('Sending error to monitoring:', { error, errorInfo, errorId });
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      logger.info(`Retrying after error (attempt ${this.state.retryCount + 1})`, 'ErrorBoundary', {
        errorId: this.state.errorId,
        level: this.props.level
      });

      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        errorId: this.generateErrorId(),
        retryCount: this.state.retryCount + 1
      });
    } else {
      logger.warn('Max retries reached, giving up', 'ErrorBoundary', {
        errorId: this.state.errorId,
        level: this.props.level,
        maxRetries: this.maxRetries
      });
    }
  };

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleRetry);
      }

      // Default fallback based on error level
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }

  private renderDefaultFallback() {
    const { level } = this.props;
    const { error, retryCount } = this.state;
    const canRetry = retryCount < this.maxRetries;

    if (level === 'component') {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">Component failed to load</p>
          {canRetry && (
            <button onClick={this.handleRetry} className="mt-2 text-red-600 text-xs underline">
              Retry
            </button>
          )}
        </div>
      );
    }

    if (level === 'section') {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Section Unavailable</h3>
          <p className="text-red-600 text-sm mt-1">This section encountered an error and cannot be displayed.</p>
          {canRetry && (
            <button onClick={this.handleRetry} className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded">
              Try Again
            </button>
          )}
        </div>
      );
    }

    // Page and global level fallbacks handled by existing error boundaries
    return null;
  }
}
