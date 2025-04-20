
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface CompanyMetrics {
  activeJobs: number;
  teamMembers: number;
  responseTime: string;
  avgResponseTime: string;
  teamPerformance: number;
  isLoading: boolean;
  error: Error | null;
}

export function useCompanyMetrics(): CompanyMetrics {
  const [metrics, setMetrics] = useState<CompanyMetrics>({
    activeJobs: 0,
    teamMembers: 0,
    responseTime: "0 hrs",
    avgResponseTime: "0 hrs",
    teamPerformance: 0,
    isLoading: true,
    error: null
  });

  const { user } = useAuth();
  const companyId = user?.companyId;

  useEffect(() => {
    async function fetchCompanyMetrics() {
      if (!companyId) return;
      
      try {
        setMetrics(prev => ({ ...prev, isLoading: true }));
        
        // Fetch team members (technicians)
        const { count: techCount, error: techError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyId)
          .eq('role', 'tech');
          
        if (techError) throw techError;
        
        // Fetch active jobs (repairs in progress)
        const { count: jobsCount, error: jobsError } = await supabase
          .from('repairs')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyId)
          .in('status', ['assigned', 'in_progress']);
          
        if (jobsError) throw jobsError;
        
        // Fetch response time metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('analytics_metrics')
          .select('metric_value')
          .eq('company_id', companyId)
          .eq('metric_name', 'avg_response_time')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (metricsError) throw metricsError;
        
        // Format the response time
        const avgResponseHours = metricsData && metricsData.length > 0 
          ? parseFloat(metricsData[0].metric_value.toString()).toFixed(1)
          : "4.2";
        
        // Get team performance data
        const { data: perfData, error: perfError } = await supabase
          .from('analytics_metrics')
          .select('metric_value')
          .eq('company_id', companyId)
          .eq('metric_name', 'team_performance')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (perfError) throw perfError;
        
        const teamPerf = perfData && perfData.length > 0 
          ? Math.round(parseFloat(perfData[0].metric_value.toString()))
          : 85;
        
        // Get current response time
        const { data: currentRespData, error: currentRespError } = await supabase
          .from('analytics_metrics')
          .select('metric_value')
          .eq('company_id', companyId)
          .eq('metric_name', 'current_response_time')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (currentRespError) throw currentRespError;
        
        const currentRespHours = currentRespData && currentRespData.length > 0 
          ? parseFloat(currentRespData[0].metric_value.toString()).toFixed(1)
          : "2.5";
        
        setMetrics({
          activeJobs: jobsCount || 0,
          teamMembers: techCount || 0,
          responseTime: `${currentRespHours} hrs`,
          avgResponseTime: `${avgResponseHours} hrs`,
          teamPerformance: teamPerf,
          isLoading: false,
          error: null
        });
        
      } catch (err) {
        console.error("Error fetching company metrics:", err);
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          isLoading: false,
          error: err instanceof Error ? err : new Error(String(err))
        }));
      }
    }
    
    fetchCompanyMetrics();
  }, [companyId]);
  
  return metrics;
}
