
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: this.generateErrorId()
    };
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substring(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service like Sentry
      console.error('Production error:', { 
        error: error.message, 
        stack: error.stack,
        errorInfo,
        errorId: this.state.errorId,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }

    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        errorId: this.generateErrorId()
      });
    } else {
      // If max retries reached, reload the page
      window.location.reload();
    }
  };

  handleReportError = () => {
    const errorReport = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      errorId: this.state.errorId,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard. Please share this with support.');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.retryCount < this.maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. We've been notified and are working on a fix.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm text-gray-600">
              <strong>Error ID:</strong> {this.state.errorId}
            </div>
            
            {this.props.showDetails && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-red-50 p-4 rounded border border-red-200">
                <summary className="cursor-pointer font-semibold text-red-600 mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              {canRetry ? (
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({this.maxRetries - this.retryCount} attempts left)
                </Button>
              ) : (
                <Button onClick={() => window.location.reload()} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              
              <Button 
                variant="outline" 
                onClick={this.handleReportError} 
                className="w-full"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report Error
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
