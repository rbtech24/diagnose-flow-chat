
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionLimits } from "@/types/subscription-consolidated";

export interface UsageData {
  technicians_active: number;
  admins_active: number;
  workflows_count: number;
  storage_used_gb: number;
  api_calls_today: number;
  diagnostics_today: number;
}

interface LicenseData {
  subscription_plans?: {
    limits?: Record<string, unknown>;
  } | null;
}

export class UsageLimitService {
  static async checkCompanyLimits(companyId: string): Promise<{
    usage: UsageData;
    limits: SubscriptionLimits;
    violations: string[];
    canPerformAction: (action: string) => boolean;
  }> {
    // Get current license and plan
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select(`
        *,
        subscription_plans!inner(limits)
      `)
      .eq('company_id', companyId)
      .eq('status', 'active')
      .single() as { data: LicenseData | null; error: any };

    if (licenseError || !license) {
      throw new Error('No active license found for company');
    }

    // Safely cast the limits with proper type checking
    const rawLimits = license.subscription_plans?.limits;
    if (!rawLimits || typeof rawLimits !== 'object' || Array.isArray(rawLimits)) {
      throw new Error('Invalid subscription plan limits');
    }

    const limits = this.parseLimits(rawLimits);

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

    const canPerformAction = (action: string) => {
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
  }

  private static parseLimits(rawLimits: Record<string, unknown>): SubscriptionLimits {
    return {
      technicians: Number(rawLimits.technicians) || 1,
      admins: Number(rawLimits.admins) || 1,
      workflows: Number(rawLimits.workflows) || 10,
      storage_gb: Number(rawLimits.storage_gb) || 1,
      api_calls: Number(rawLimits.api_calls) || 1000,
      diagnostics_per_day: Number(rawLimits.diagnostics_per_day) || 10
    };
  }

  private static async getCurrentUsage(companyId: string): Promise<UsageData> {
    const today = new Date().toISOString().split('T')[0];

    // Get technician counts
    const technicianResult = await supabase
      .from('technicians')
      .select('role')
      .eq('company_id', companyId)
      .eq('status', 'active');

    const technicianCounts = technicianResult.data || [];
    const technicians_active = technicianCounts.filter(t => t.role === 'tech').length;
    const admins_active = technicianCounts.filter(t => t.role === 'admin' || t.role === 'company_admin').length;

    // Get workflow count
    const workflowResult = await supabase
      .from('workflows')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId);

    const workflows_count = workflowResult.count || 0;

    // Get storage usage (approximate from file uploads)
    const fileResult = await supabase
      .from('file_uploads')
      .select('size')
      .eq('company_id', companyId);

    const fileUploads = fileResult.data || [];
    const storage_used_gb = fileUploads.reduce((total, file) => total + (file.size || 0), 0) / (1024 * 1024 * 1024);

    // Get today's API calls
    const apiResult = await supabase
      .from('api_usage_logs')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .gte('created_at', today);

    const api_calls_today = apiResult.count || 0;

    // Get today's diagnostics
    const diagnosticResult = await supabase
      .from('diagnostic_sessions')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .gte('created_at', today);

    const diagnostics_today = diagnosticResult.count || 0;

    return {
      technicians_active,
      admins_active,
      workflows_count,
      storage_used_gb: Math.round(storage_used_gb * 100) / 100,
      api_calls_today,
      diagnostics_today
    };
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
