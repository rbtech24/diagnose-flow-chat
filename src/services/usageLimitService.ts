
import { supabase } from "@/integrations/supabase/client";

export interface UsageData {
  technicians_active: number;
  admins_active: number;
  workflows_count: number;
  storage_used_gb: number;
  api_calls_today: number;
  diagnostics_today: number;
}

export interface SubscriptionLimits {
  technicians: number;
  admins: number;
  workflows: number;
  storage_gb: number;
  api_calls: number;
  diagnostics_per_day: number;
}

export class UsageLimitService {
  static async checkCompanyLimits(companyId: string): Promise<{
    usage: UsageData;
    limits: SubscriptionLimits;
    violations: string[];
    canPerformAction: (action: string) => boolean;
  }> {
    try {
      // Get current license and plan
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select(`
          *,
          subscription_plans!inner(limits)
        `)
        .eq('company_id', companyId)
        .eq('status', 'active')
        .single();

      if (licenseError || !license) {
        console.error('No active license found for company:', licenseError);
        // Return default limits if no license found
        return this.getDefaultLimits();
      }

      // Extract the limits with proper type handling
      const subscriptionPlans = license.subscription_plans as any;
      const planLimits = subscriptionPlans?.limits || {};

      const limits: SubscriptionLimits = {
        technicians: Number(planLimits.technicians) || 1,
        admins: Number(planLimits.admins) || 1,
        workflows: Number(planLimits.workflows) || 10,
        storage_gb: Number(planLimits.storage_gb) || 1,
        api_calls: Number(planLimits.api_calls) || 1000,
        diagnostics_per_day: Number(planLimits.diagnostics_per_day) || 10
      };

      // Get current usage
      const usage = await this.getCurrentUsage(companyId);
      
      // Check for violations
      const violations: string[] = [];
      
      if (usage.technicians_active > limits.technicians) {
        violations.push(`Technician limit exceeded: ${usage.technicians_active}/${limits.technicians}`);
      }
      
      if (usage.admins_active > limits.admins) {
        violations.push(`Admin limit exceeded: ${usage.admins_active}/${limits.admins}`);
      }
      
      if (usage.workflows_count > limits.workflows) {
        violations.push(`Workflow limit exceeded: ${usage.workflows_count}/${limits.workflows}`);
      }
      
      if (usage.storage_used_gb > limits.storage_gb) {
        violations.push(`Storage limit exceeded: ${usage.storage_used_gb}GB/${limits.storage_gb}GB`);
      }
      
      if (usage.api_calls_today > limits.api_calls) {
        violations.push(`Daily API calls exceeded: ${usage.api_calls_today}/${limits.api_calls}`);
      }
      
      if (usage.diagnostics_today > limits.diagnostics_per_day) {
        violations.push(`Daily diagnostics exceeded: ${usage.diagnostics_today}/${limits.diagnostics_per_day}`);
      }

      const canPerformAction = (action: string): boolean => {
        switch (action) {
          case 'add_technician':
            return usage.technicians_active < limits.technicians;
          case 'add_admin':
            return usage.admins_active < limits.admins;
          case 'create_workflow':
            return usage.workflows_count < limits.workflows;
          case 'upload_file':
            return usage.storage_used_gb < limits.storage_gb;
          case 'api_call':
            return usage.api_calls_today < limits.api_calls;
          case 'run_diagnostic':
            return usage.diagnostics_today < limits.diagnostics_per_day;
          default:
            return true;
        }
      };

      return {
        usage,
        limits,
        violations,
        canPerformAction
      };
    } catch (error) {
      console.error('Error checking company limits:', error);
      return this.getDefaultLimits();
    }
  }

  private static getDefaultLimits() {
    const defaultUsage: UsageData = {
      technicians_active: 0,
      admins_active: 0,
      workflows_count: 0,
      storage_used_gb: 0,
      api_calls_today: 0,
      diagnostics_today: 0
    };

    const defaultLimits: SubscriptionLimits = {
      technicians: 5,
      admins: 2,
      workflows: 10,
      storage_gb: 1,
      api_calls: 1000,
      diagnostics_per_day: 10
    };

    return {
      usage: defaultUsage,
      limits: defaultLimits,
      violations: [],
      canPerformAction: () => true
    };
  }

  private static async getCurrentUsage(companyId: string): Promise<UsageData> {
    const today = new Date().toISOString().split('T')[0];

    try {
      // Get technician counts
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('role')
        .eq('company_id', companyId)
        .eq('status', 'active');

      const technicianCounts = technicianData || [];
      const technicians_active = technicianCounts.filter(t => t.role === 'tech').length;
      const admins_active = technicianCounts.filter(t => t.role === 'admin' || t.role === 'company_admin').length;

      // Get workflow count (workflows table doesn't exist yet, so default to 0)
      const workflows_count = 0;

      // Get storage usage (approximate from file uploads)
      const { data: fileUploads } = await supabase
        .from('file_uploads')
        .select('size')
        .eq('company_id', companyId);

      const files = fileUploads || [];
      const storage_used_gb = files.reduce((total, file) => total + (file.size || 0), 0) / (1024 * 1024 * 1024);

      // Get today's API calls
      const { count: apiCallsToday } = await supabase
        .from('api_usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('created_at', today);

      // Get today's diagnostics
      const { count: diagnosticsToday } = await supabase
        .from('diagnostic_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('created_at', today);

      return {
        technicians_active,
        admins_active,
        workflows_count,
        storage_used_gb: Math.round(storage_used_gb * 100) / 100,
        api_calls_today: apiCallsToday || 0,
        diagnostics_today: diagnosticsToday || 0
      };
    } catch (error) {
      console.error('Error getting current usage:', error);
      // Return default values on error
      return {
        technicians_active: 0,
        admins_active: 0,
        workflows_count: 0,
        storage_used_gb: 0,
        api_calls_today: 0,
        diagnostics_today: 0
      };
    }
  }

  static async recordUsage(companyId: string, usageType: string, amount: number = 1): Promise<void> {
    try {
      console.log(`Recording usage for company ${companyId}: ${usageType} - ${amount}`);
      
      if (usageType === 'api_call') {
        await supabase
          .from('api_usage_logs')
          .insert({
            company_id: companyId,
            provider: 'internal',
            endpoint: usageType,
            status_code: 200,
            cost: amount
          });
      }
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }

  static async enforceLimit(companyId: string, action: string): Promise<boolean> {
    try {
      const { canPerformAction } = await this.checkCompanyLimits(companyId);
      
      if (!canPerformAction(action)) {
        await supabase
          .from('notifications')
          .insert({
            company_id: companyId,
            type: 'warning',
            title: 'Usage Limit Reached',
            message: `You have reached your plan limits for ${action.replace('_', ' ')}. Please upgrade your plan to continue.`,
          });
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error enforcing limit:', error);
      return false;
    }
  }
}
