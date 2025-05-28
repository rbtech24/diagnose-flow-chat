
import { useCallback } from 'react';
import { logger, LogLevel } from '@/utils/logger';

export function useLogger(context?: string) {
  const debug = useCallback((message: string, metadata?: Record<string, any>) => {
    logger.debug(message, context, metadata);
  }, [context]);

  const info = useCallback((message: string, metadata?: Record<string, any>) => {
    logger.info(message, context, metadata);
  }, [context]);

  const warn = useCallback((message: string, metadata?: Record<string, any>) => {
    logger.warn(message, context, metadata);
  }, [context]);

  const error = useCallback((message: string, metadata?: Record<string, any>) => {
    logger.error(message, context, metadata);
  }, [context]);

  const logUserAction = useCallback((action: string, metadata?: Record<string, any>) => {
    logger.info(`User action: ${action}`, context, {
      type: 'user_action',
      action,
      ...metadata
    });
  }, [context]);

  const logComponentMount = useCallback((componentName: string) => {
    logger.debug(`Component mounted: ${componentName}`, context, {
      type: 'component_lifecycle',
      event: 'mount'
    });
  }, [context]);

  const logComponentUnmount = useCallback((componentName: string) => {
    logger.debug(`Component unmounted: ${componentName}`, context, {
      type: 'component_lifecycle',
      event: 'unmount'
    });
  }, [context]);

  return {
    debug,
    info,
    warn,
    error,
    logUserAction,
    logComponentMount,
    logComponentUnmount,
    setLogLevel: logger.setLogLevel.bind(logger),
    getLogs: logger.getLogs.bind(logger),
    clearLogs: logger.clearLogs.bind(logger)
  };
}
