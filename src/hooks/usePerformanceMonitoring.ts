
import { useState, useEffect, useCallback } from 'react';
import { performanceMonitoringService, PerformanceMetric } from '@/services/performanceMonitoringService';

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const recordMetric = useCallback((
    name: string,
    value: number,
    category: PerformanceMetric['category'],
    unit: string = 'ms',
    metadata?: Record<string, any>
  ) => {
    if (!isMonitoring) return;
    
    const metricId = performanceMonitoringService.recordMetric(
      name,
      value,
      category,
      unit,
      metadata
    );
    
    // Update local state
    setMetrics(performanceMonitoringService.getMetrics({ limit: 100 }));
    return metricId;
  }, [isMonitoring]);

  const timeFunction = useCallback(async <T>(
    name: string,
    fn: () => Promise<T> | T,
    category: PerformanceMetric['category'] = 'user_interaction'
  ) => {
    if (!isMonitoring) {
      const result = await fn();
      return { result, duration: 0, metricId: '' };
    }

    const timedResult = await performanceMonitoringService.timeFunction(name, fn, category);
    setMetrics(performanceMonitoringService.getMetrics({ limit: 100 }));
    return timedResult;
  }, [isMonitoring]);

  const getPerformanceSummary = useCallback(() => {
    return performanceMonitoringService.getPerformanceSummary();
  }, []);

  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  const clearMetrics = useCallback(() => {
    performanceMonitoringService.clearMetrics();
    setMetrics([]);
  }, []);

  useEffect(() => {
    // Initial load of metrics
    setMetrics(performanceMonitoringService.getMetrics({ limit: 100 }));
  }, []);

  return {
    metrics,
    isMonitoring,
    recordMetric,
    timeFunction,
    getPerformanceSummary,
    toggleMonitoring,
    clearMetrics
  };
}
