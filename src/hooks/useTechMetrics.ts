
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface TechMetrics {
  assignedJobs: number;
  completedJobs: number;
  avgCompletionTime: string;
  satisfaction: number;
  isLoading: boolean;
  error: Error | null;
}

export function useTechMetrics(): TechMetrics {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<TechMetrics>({
    assignedJobs: 0,
    completedJobs: 0,
    avgCompletionTime: "0 hrs",
    satisfaction: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchMetrics() {
      if (!user?.id) return;
      
      try {
        // Fetch assigned jobs
        const { count: assignedCount, error: assignedError } = await supabase
          .from('repairs')
          .select('*', { count: 'exact', head: true })
          .eq('technician_id', user.id)
          .in('status', ['assigned', 'in_progress']);
          
        if (assignedError) throw assignedError;
        
        // Fetch completed jobs
        const { count: completedCount, error: completedError } = await supabase
          .from('repairs')
          .select('*', { count: 'exact', head: true })
          .eq('technician_id', user.id)
          .eq('status', 'completed');
          
        if (completedError) throw completedError;
        
        // In a real application, you would calculate these metrics from actual data
        // For now, we'll use some placeholder values
        setMetrics({
          assignedJobs: assignedCount || 0,
          completedJobs: completedCount || 0,
          avgCompletionTime: "3.5 hrs",
          satisfaction: 92,
          isLoading: false,
          error: null
        });
        
      } catch (error) {
        console.error("Error fetching tech metrics:", error);
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          isLoading: false,
          error: error instanceof Error ? error : new Error(String(error))
        }));
      }
    }
    
    fetchMetrics();
  }, [user?.id]);
  
  return metrics;
}
