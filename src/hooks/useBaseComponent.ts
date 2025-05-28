
import { useEffect, useCallback, useRef } from 'react';
import { useLogger } from './useLogger';

export interface UseBaseComponentOptions {
  componentName: string;
  onMount?: () => void;
  onUnmount?: () => void;
  trackUserActions?: boolean;
}

export function useBaseComponent(options: UseBaseComponentOptions) {
  const { componentName, onMount, onUnmount, trackUserActions = true } = options;
  const logger = useLogger(`Component:${componentName}`);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      logger.logComponentMount(componentName);
      onMount?.();
      mountedRef.current = true;
    }

    return () => {
      logger.logComponentUnmount(componentName);
      onUnmount?.();
    };
  }, [componentName, logger, onMount, onUnmount]);

  const logAction = useCallback((action: string, metadata?: Record<string, any>) => {
    if (trackUserActions) {
      logger.logUserAction(`${componentName}: ${action}`, {
        component: componentName,
        ...metadata
      });
    }
  }, [logger, componentName, trackUserActions]);

  const logError = useCallback((message: string, error?: Error, metadata?: Record<string, any>) => {
    logger.error(`${componentName}: ${message}`, {
      error: error?.message,
      stack: error?.stack,
      component: componentName,
      ...metadata
    });
  }, [logger, componentName]);

  const logWarning = useCallback((message: string, metadata?: Record<string, any>) => {
    logger.warn(`${componentName}: ${message}`, {
      component: componentName,
      ...metadata
    });
  }, [logger, componentName]);

  const getTestId = useCallback((suffix?: string): string => {
    const base = componentName.toLowerCase();
    return suffix ? `${base}-${suffix}` : base;
  }, [componentName]);

  return {
    logAction,
    logError,
    logWarning,
    getTestId,
    logger
  };
}
