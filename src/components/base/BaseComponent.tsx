
import React, { Component, ReactNode } from 'react';
import { logger } from '@/utils/logger';

export interface BaseComponentProps {
  className?: string;
  testId?: string;
  children?: ReactNode;
}

export interface BaseComponentState {
  isLoading?: boolean;
  error?: Error;
}

export abstract class BaseComponent<P extends BaseComponentProps = BaseComponentProps, S extends BaseComponentState = BaseComponentState> extends Component<P, S> {
  protected componentName: string;
  protected context: string;

  constructor(props: P, componentName: string) {
    super(props);
    this.componentName = componentName;
    this.context = `Component:${componentName}`;
  }

  componentDidMount() {
    logger.debug(`${this.componentName} mounted`, this.context);
    this.onComponentMount();
  }

  componentWillUnmount() {
    logger.debug(`${this.componentName} unmounting`, this.context);
    this.onComponentUnmount();
  }

  componentDidUpdate(prevProps: P, prevState: S) {
    this.onComponentUpdate(prevProps, prevState);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`Error in ${this.componentName}`, this.context, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    this.onComponentError(error, errorInfo);
  }

  protected logAction(action: string, metadata?: Record<string, any>): void {
    logger.info(`${this.componentName}: ${action}`, this.context, {
      action,
      component: this.componentName,
      ...metadata
    });
  }

  protected logError(message: string, error?: Error, metadata?: Record<string, any>): void {
    logger.error(`${this.componentName}: ${message}`, this.context, {
      error: error?.message,
      stack: error?.stack,
      component: this.componentName,
      ...metadata
    });
  }

  protected logWarning(message: string, metadata?: Record<string, any>): void {
    logger.warn(`${this.componentName}: ${message}`, this.context, {
      component: this.componentName,
      ...metadata
    });
  }

  // Lifecycle hooks for subclasses to override
  protected onComponentMount(): void {}
  protected onComponentUnmount(): void {}
  protected onComponentUpdate(prevProps: P, prevState: S): void {}
  protected onComponentError(error: Error, errorInfo: React.ErrorInfo): void {}

  // Helper methods
  protected getTestId(suffix?: string): string {
    const base = this.props.testId || this.componentName.toLowerCase();
    return suffix ? `${base}-${suffix}` : base;
  }

  protected combineClassNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
  }
}
