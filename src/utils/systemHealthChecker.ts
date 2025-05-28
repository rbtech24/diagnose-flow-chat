
import { checkComponentDependencies, checkTypeSafety } from './dependencyChecker';
import { SupabaseIntegration } from './supabaseIntegration';
import { monitorMemoryUsage } from './performance';

export interface SystemHealthReport {
  dependencies: {
    issues: string[];
    recommendations: string[];
  };
  typeSafety: {
    recommendations: string[];
  };
  database: {
    connected: boolean;
    error?: string;
  };
  memory: any;
  auth: {
    configured: boolean;
    issues: string[];
  };
}

export class SystemHealthChecker {
  static async generateReport(): Promise<SystemHealthReport> {
    console.log('🔍 Running system health check...');
    
    // Check dependencies
    const dependencies = checkComponentDependencies();
    console.log('✅ Dependencies checked');
    
    // Check type safety
    const typeSafety = checkTypeSafety();
    console.log('✅ Type safety checked');
    
    // Check database connection
    const database = await this.checkDatabaseHealth();
    console.log('✅ Database health checked');
    
    // Check memory usage
    const memory = this.getMemoryInfo();
    console.log('✅ Memory usage checked');
    
    // Check auth configuration
    const auth = this.checkAuthConfiguration();
    console.log('✅ Auth configuration checked');
    
    const report: SystemHealthReport = {
      dependencies,
      typeSafety,
      database,
      memory,
      auth
    };
    
    console.log('📊 System Health Report:', report);
    return report;
  }
  
  private static async checkDatabaseHealth(): Promise<{ connected: boolean; error?: string }> {
    try {
      const result = await SupabaseIntegration.safeQuery(async () => {
        // Simple query to test connection
        const { data, error } = await supabase.from('workflows').select('count').limit(1);
        return { data, error };
      });
      
      return {
        connected: result.success,
        error: result.error
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }
  
  private static getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return { supported: false };
  }
  
  private static checkAuthConfiguration(): { configured: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check if auth context is properly configured
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        issues.push('No user session found in localStorage');
      }
    } catch (error) {
      issues.push('Cannot access localStorage for auth state');
    }
    
    return {
      configured: issues.length === 0,
      issues
    };
  }
}
