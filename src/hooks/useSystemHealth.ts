
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SystemHealthMetrics {
  systemHealth: number;
  systemUptime: number;
  isLoading: boolean;
  error: Error | null;
}

export function useSystemHealth(): SystemHealthMetrics {
  const [systemHealth, setSystemHealth] = useState<number>(98.7); // Default value
  const [systemUptime, setSystemUptime] = useState<number>(99.8); // Default value
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSystemHealth() {
      setIsLoading(true);
      try {
        // In a real application, you would fetch these metrics from a monitoring service
        // For now, we'll simulate this with a fixed value or calculation

        // Example: Fetch the latest system health metrics from analytics_aggregates table
        const { data: healthData, error: healthError } = await supabase
          .from('analytics_aggregates')
          .select('value')
          .eq('metric_name', 'system_health')
          .order('created_at', { ascending: false })
          .limit(1);

        if (healthError) throw healthError;

        // Example: Fetch the latest uptime metrics
        const { data: uptimeData, error: uptimeError } = await supabase
          .from('analytics_aggregates')
          .select('value')
          .eq('metric_name', 'system_uptime')
          .order('created_at', { ascending: false })
          .limit(1);

        if (uptimeError) throw uptimeError;

        // Use real data if available, otherwise keep default values
        if (healthData && healthData.length > 0) {
          // Convert string value to number
          setSystemHealth(parseFloat(String(healthData[0].value)) || 98.7);
        }

        if (uptimeData && uptimeData.length > 0) {
          // Convert string value to number
          setSystemUptime(parseFloat(String(uptimeData[0].value)) || 99.8);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching system health metrics:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSystemHealth();

    // Refresh metrics every 5 minutes
    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    systemHealth,
    systemUptime,
    isLoading,
    error
  };
}
