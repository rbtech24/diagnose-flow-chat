
import React, { ComponentType, ErrorInfo } from 'react';
import { ErrorBoundaryProvider } from './ErrorBoundaryProvider';

interface WithErrorBoundaryOptions {
  level?: 'page' | 'section' | 'component';
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const {
    level = 'component',
    fallback,
    onError,
    isolate = false
  } = options;

  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundaryProvider
        level={level}
        fallback={fallback}
        onError={onError}
        isolate={isolate}
      >
        <Component {...props} />
      </ErrorBoundaryProvider>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
