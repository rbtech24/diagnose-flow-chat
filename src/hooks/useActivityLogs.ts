
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activity logs';
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: 'Error loading logs',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to record activity';
      
      toast({
        title: 'Error recording activity',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [logs, toast]);

  return {
    logs,
    isLoading,
    error,
    loadLogs,
    recordActivity
  };
}
