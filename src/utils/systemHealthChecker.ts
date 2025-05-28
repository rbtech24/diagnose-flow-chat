import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: HealthCheckResult[];
  lastChecked: Date;
}

class SystemHealthChecker {
  private healthHistory: HealthCheckResult[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const { error } = await supabase.from('companies').select('id').limit(1);
      const responseTime = performance.now() - startTime;
      
      return {
        service: 'database',
        status: error ? 'down' : 'healthy',
        responseTime,
        error: error?.message,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'down',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  async checkAuthHealth(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    
    try {
      const { error } = await supabase.auth.getSession();
      const responseTime = performance.now() - startTime;
      
      return {
        service: 'auth',
        status: error ? 'degraded' : 'healthy',
        responseTime,
        error: error?.message,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        service: 'auth',
        status: 'down',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const checks = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAuthHealth()
    ]);

    this.healthHistory.push(...checks);
    
    // Keep only last 100 checks
    if (this.healthHistory.length > 100) {
      this.healthHistory = this.healthHistory.slice(-100);
    }

    const downServices = checks.filter(check => check.status === 'down').length;
    const degradedServices = checks.filter(check => check.status === 'degraded').length;

    let overall: 'healthy' | 'degraded' | 'down' = 'healthy';
    if (downServices > 0) {
      overall = 'down';
    } else if (degradedServices > 0) {
      overall = 'degraded';
    }

    return {
      overall,
      services: checks,
      lastChecked: new Date()
    };
  }

  startMonitoring(intervalMs: number = 30000) {
    this.stopMonitoring();
    this.checkInterval = setInterval(() => {
      this.performHealthCheck().then(health => {
        console.log('System Health Check:', health);
      });
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getHealthHistory(): HealthCheckResult[] {
    return [...this.healthHistory];
  }
}

export const systemHealthChecker = new SystemHealthChecker();
export type { HealthCheckResult, SystemHealth };
