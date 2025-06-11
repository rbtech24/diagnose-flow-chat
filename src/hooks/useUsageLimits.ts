
import { useState, useEffect } from 'react';
import { UsageLimitService, UsageData } from '@/services/usageLimitService';
import { SubscriptionLimits } from '@/types/subscription-consolidated';
import { toast } from 'sonner';

export function useUsageLimits(companyId?: string) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [violations, setViolations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canPerformAction, setCanPerformAction] = useState<(action: string) => boolean>(() => () => true);

  const checkLimits = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const result = await UsageLimitService.checkCompanyLimits(companyId);
      setUsage(result.usage);
      setLimits(result.limits);
      setViolations(result.violations);
      setCanPerformAction(() => result.canPerformAction);
    } catch (error) {
      console.error('Error checking usage limits:', error);
      toast.error('Failed to check usage limits');
    } finally {
      setIsLoading(false);
    }
  };

  const enforceLimit = async (action: string): Promise<boolean> => {
    if (!companyId) return true;
    
    try {
      const allowed = await UsageLimitService.enforceLimit(companyId, action);
      if (!allowed) {
        toast.error(`Action blocked: ${action.replace('_', ' ')} limit reached`);
      }
      return allowed;
    } catch (error) {
      console.error('Error enforcing limit:', error);
      return false;
    }
  };

  const recordUsage = async (usageType: string, amount: number = 1) => {
    if (!companyId) return;
    
    try {
      await UsageLimitService.recordUsage(companyId, usageType, amount);
      // Refresh limits after recording usage
      await checkLimits();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  useEffect(() => {
    if (companyId) {
      checkLimits();
    }
  }, [companyId]);

  return {
    usage,
    limits,
    violations,
    isLoading,
    canPerformAction,
    checkLimits,
    enforceLimit,
    recordUsage,
    hasViolations: violations.length > 0
  };
}
