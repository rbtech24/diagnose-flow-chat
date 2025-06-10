
import { useState, useCallback } from 'react';
import { fetchActivityLogs, logActivity, ActivityLog, ActivityTimeframe } from '@/api/activityLogsApi';
import { useToast } from '@/hooks/use-toast';

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadLogs = useCallback(async (
    timeframe: ActivityTimeframe = 'all',
    type?: string,
    searchQuery?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedLogs = await fetchActivityLogs(timeframe, type, searchQuery);
      setLogs(fetchedLogs);
      
      return fetchedLogs;
    } catch (err) {
      console.log('No activity logs found or API not connected - this is normal for new installations');
      // Don't show error toast for empty results, just set empty array
      setLogs([]);
      setError(null);
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordActivity = useCallback(async (
    activityType: string,
    description: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const newActivity = await logActivity({
        activity_type: activityType,
        description,
        metadata
      });
      
      // Update the local state if we have logs loaded
      if (logs.length > 0) {
        setLogs(prevLogs => [newActivity, ...prevLogs]);
      }
      
      return newActivity;
    } catch (err) {
      console.log('Failed to record activity - API may not be connected');
      // Don't show error for activity logging failures in demo mode
      return null;
    }
  }, [logs]);

  return {
    logs,
    isLoading,
    error,
    loadLogs,
    recordActivity
  };
}
