
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CompanyMetrics {
  activeJobs: number;
  teamMembers: number;
  responseTime: string;
  avgResponseTime: string;
  teamPerformance: number;
  isLoading: boolean;
  error: Error | null;
}

export function useCompanyMetrics(companyId?: string): CompanyMetrics {
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    activeJobs: 0,
    teamMembers: 0,
    responseTime: "0 hrs",
    avgResponseTime: "0 hrs",
    teamPerformance: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchCompanyMetrics() {
      if (!companyId) return;
      
      try {
        // Fetch team members (technicians)
        const { count: techCount, error: techError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('companyId', companyId)
          .eq('role', 'tech');
          
        if (techError) throw techError;
        
        // Fetch active jobs (repairs in progress)
        const { count: jobsCount, error: jobsError } = await supabase
          .from('repairs')
          .select('*', { count: 'exact', head: true })
          .eq('companyId', companyId)
          .eq('status', 'in_progress');
          
        if (jobsError) throw jobsError;
        
        // Fetch average response time
        // This would likely be a more complex query in a real application
        // For now, we'll use placeholder data
        const avgResponseTime = "4.2 hrs";
        const responseTime = "2.5 hrs";
        const teamPerformance = 85; // percentage
        
        setMetrics({
          activeJobs: jobsCount || 0,
          teamMembers: techCount || 0,
          responseTime,
          avgResponseTime,
          teamPerformance,
          isLoading: false,
          error: null
        });
        
      } catch (err) {
        console.error("Error fetching company metrics:", err);
        setMetrics({
          ...metrics,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err))
        });
      }
    }
    
    fetchCompanyMetrics();
  }, [companyId]);
  
  return metrics;
}
