
export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static startMeasurement(name: string): void {
    this.measurements.set(name, performance.now());
  }

  static endMeasurement(name: string): number {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      console.warn(`No measurement started for: ${name}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    console.log(`Performance measurement - ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startMeasurement(name);
      try {
        const result = await fn();
        this.endMeasurement(name);
        resolve(result);
      } catch (error) {
        this.endMeasurement(name);
        reject(error);
      }
    });
  }

  static measureComponent(componentName: string) {
    return function<T extends React.ComponentType<any>>(Component: T): T {
      const MeasuredComponent = (props: any) => {
        React.useEffect(() => {
          PerformanceMonitor.startMeasurement(`${componentName}-render`);
          return () => {
            PerformanceMonitor.endMeasurement(`${componentName}-render`);
          };
        });

        return React.createElement(Component, props);
      };

      MeasuredComponent.displayName = `Measured(${Component.displayName || Component.name})`;
      return MeasuredComponent as T;
    };
  }
}

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
};
