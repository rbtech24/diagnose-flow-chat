
import { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchRecentActivity, DashboardStats, RecentActivity } from '@/api/companyDashboardApi';
import { useErrorHandler } from './useErrorHandler';

export function useDashboardData(companyId: string) {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    completedJobs: 0,
    revenue: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleAsyncError } = useErrorHandler();

  const loadDashboardData = async () => {
    if (!companyId) return;

    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      console.log('Loading dashboard data for company:', companyId);
      
      const [statsData, activityData] = await Promise.all([
        fetchDashboardStats(companyId),
        fetchRecentActivity(companyId)
      ]);
      
      console.log('Dashboard stats loaded:', statsData);
      console.log('Recent activity loaded:', activityData);
      
      setStats(statsData);
      setRecentActivity(activityData);
    }, 'loadDashboardData');

    setIsLoading(false);
    return result.data;
  };

  useEffect(() => {
    loadDashboardData();
  }, [companyId]);

  return {
    stats,
    recentActivity,
    isLoading,
    refreshData: loadDashboardData
  };
}
