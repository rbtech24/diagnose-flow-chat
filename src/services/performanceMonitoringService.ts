
import { configService } from './configService';

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'page_load' | 'api_response' | 'bundle_size' | 'memory_usage' | 'user_interaction';
  metadata?: Record<string, any>;
}

export interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private observer?: PerformanceObserver;
  private thresholds: PerformanceThreshold[] = [
    { metric: 'page_load', warning: 3000, critical: 5000, unit: 'ms' },
    { metric: 'api_response', warning: 1000, critical: 3000, unit: 'ms' },
    { metric: 'bundle_size', warning: 500, critical: 1000, unit: 'kb' },
    { metric: 'memory_usage', warning: 50, critical: 80, unit: 'mb' }
  ];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializePerformanceObserver();
    }
  }

  private initializePerformanceObserver() {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => this.processPerformanceEntry(entry));
      });

      this.observer.observe({ 
        entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      name: entry.name,
      value: entry.duration || 0,
      unit: 'ms',
      timestamp: new Date(),
      category: this.categorizeEntry(entry),
      metadata: {
        entryType: entry.entryType,
        startTime: entry.startTime
      }
    };

    this.addMetric(metric);
    this.checkThresholds(metric);
  }

  private categorizeEntry(entry: PerformanceEntry): PerformanceMetric['category'] {
    if (entry.entryType === 'navigation') return 'page_load';
    if (entry.entryType === 'resource') return 'api_response';
    if (entry.entryType === 'paint') return 'user_interaction';
    return 'page_load';
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(
    name: string,
    value: number,
    category: PerformanceMetric['category'],
    unit: string = 'ms',
    metadata?: Record<string, any>
  ): string {
    const metric: PerformanceMetric = {
      id: this.generateId(),
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      metadata
    };

    this.addMetric(metric);
    this.checkThresholds(metric);
    return metric.id;
  }

  /**
   * Time a function execution
   */
  async timeFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    category: PerformanceMetric['category'] = 'user_interaction'
  ): Promise<{ result: T; duration: number; metricId: string }> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      const metricId = this.recordMetric(name, duration, category, 'ms', {
        success: true
      });

      return { result, duration, metricId };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      const metricId = this.recordMetric(name, duration, category, 'ms', {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Measure page load performance
   */
  measurePageLoad(): PerformanceMetric | null {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    return {
      id: this.generateId(),
      name: 'page_load_time',
      value: loadTime,
      unit: 'ms',
      timestamp: new Date(),
      category: 'page_load',
      metadata: {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstByte: navigation.responseStart - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart
      }
    };
  }

  /**
   * Get memory usage
   */
  getMemoryUsage(): PerformanceMetric | null {
    if (typeof window === 'undefined' || !('memory' in performance)) return null;

    const memory = (performance as any).memory;
    
    return {
      id: this.generateId(),
      name: 'memory_usage',
      value: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      unit: 'mb',
      timestamp: new Date(),
      category: 'memory_usage',
      metadata: {
        totalHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        heapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    };
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals(): Promise<PerformanceMetric[]> {
    return new Promise((resolve) => {
      const vitals: PerformanceMetric[] = [];

      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        vitals.push({
          id: this.generateId(),
          name: 'first_contentful_paint',
          value: fcp.startTime,
          unit: 'ms',
          timestamp: new Date(),
          category: 'page_load'
        });
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          
          vitals.push({
            id: this.generateId(),
            name: 'largest_contentful_paint',
            value: lcp.startTime,
            unit: 'ms',
            timestamp: new Date(),
            category: 'page_load'
          });
          
          lcpObserver.disconnect();
          resolve(vitals);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(vitals);
      }
    });
  }

  /**
   * Get performance metrics with filtering
   */
  getMetrics(filters?: {
    category?: PerformanceMetric['category'];
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): PerformanceMetric[] {
    let metrics = [...this.metrics];

    if (filters?.category) {
      metrics = metrics.filter(m => m.category === filters.category);
    }

    if (filters?.timeRange) {
      metrics = metrics.filter(m => 
        m.timestamp >= filters.timeRange!.start && 
        m.timestamp <= filters.timeRange!.end
      );
    }

    if (filters?.limit) {
      metrics = metrics.slice(-filters.limit);
    }

    return metrics;
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    averagePageLoad: number;
    averageApiResponse: number;
    memoryUsage: number;
    totalMetrics: number;
    warnings: number;
    criticals: number;
  } {
    const pageLoadMetrics = this.metrics.filter(m => m.category === 'page_load');
    const apiMetrics = this.metrics.filter(m => m.category === 'api_response');
    const memoryMetrics = this.metrics.filter(m => m.category === 'memory_usage');

    const warnings = this.metrics.filter(m => this.isAboveThreshold(m, 'warning')).length;
    const criticals = this.metrics.filter(m => this.isAboveThreshold(m, 'critical')).length;

    return {
      averagePageLoad: this.calculateAverage(pageLoadMetrics),
      averageApiResponse: this.calculateAverage(apiMetrics),
      memoryUsage: memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1].value : 0,
      totalMetrics: this.metrics.length,
      warnings,
      criticals
    };
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    if (configService.getFeaturesConfig().debugMode) {
      console.log('Performance metric recorded:', metric);
    }
  }

  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.find(t => 
      metric.name.includes(t.metric) || metric.category === t.metric
    );

    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      console.error(`Critical performance threshold exceeded: ${metric.name} = ${metric.value}${metric.unit}`);
    } else if (metric.value >= threshold.warning) {
      console.warn(`Performance warning threshold exceeded: ${metric.name} = ${metric.value}${metric.unit}`);
    }
  }

  private isAboveThreshold(metric: PerformanceMetric, level: 'warning' | 'critical'): boolean {
    const threshold = this.thresholds.find(t => 
      metric.name.includes(t.metric) || metric.category === t.metric
    );

    if (!threshold) return false;
    return metric.value >= threshold[level];
  }

  private calculateAverage(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / metrics.length);
  }

  private generateId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  getCoreWebVitals(): Promise<PerformanceMetric[]> {
    return new Promise((resolve) => {
      const vitals: PerformanceMetric[] = [];

      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        vitals.push({
          id: this.generateId(),
          name: 'first_contentful_paint',
          value: fcp.startTime,
          unit: 'ms',
          timestamp: new Date(),
          category: 'page_load'
        });
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          
          vitals.push({
            id: this.generateId(),
            name: 'largest_contentful_paint',
            value: lcp.startTime,
            unit: 'ms',
            timestamp: new Date(),
            category: 'page_load'
          });
          
          lcpObserver.disconnect();
          resolve(vitals);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(vitals);
      }
    });
  }

  getMetrics(filters?: {
    category?: PerformanceMetric['category'];
    timeRange?: { start: Date; end: Date };
    limit?: number;
  }): PerformanceMetric[] {
    let metrics = [...this.metrics];

    if (filters?.category) {
      metrics = metrics.filter(m => m.category === filters.category);
    }

    if (filters?.timeRange) {
      metrics = metrics.filter(m => 
        m.timestamp >= filters.timeRange!.start && 
        m.timestamp <= filters.timeRange!.end
      );
    }

    if (filters?.limit) {
      metrics = metrics.slice(-filters.limit);
    }

    return metrics;
  }

  getPerformanceSummary(): {
    averagePageLoad: number;
    averageApiResponse: number;
    memoryUsage: number;
    totalMetrics: number;
    warnings: number;
    criticals: number;
  } {
    const pageLoadMetrics = this.metrics.filter(m => m.category === 'page_load');
    const apiMetrics = this.metrics.filter(m => m.category === 'api_response');
    const memoryMetrics = this.metrics.filter(m => m.category === 'memory_usage');

    const warnings = this.metrics.filter(m => this.isAboveThreshold(m, 'warning')).length;
    const criticals = this.metrics.filter(m => this.isAboveThreshold(m, 'critical')).length;

    return {
      averagePageLoad: this.calculateAverage(pageLoadMetrics),
      averageApiResponse: this.calculateAverage(apiMetrics),
      memoryUsage: memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1].value : 0,
      totalMetrics: this.metrics.length,
      warnings,
      criticals
    };
  }
}

export const performanceMonitoringService = new PerformanceMonitoringService();
