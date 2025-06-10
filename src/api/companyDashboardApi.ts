
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  activeJobs: number;
  completedJobs: number;
  revenue: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'repair_completed' | 'job_started' | 'parts_needed' | 'job_scheduled';
  description: string;
  time: string;
  icon: string;
}

export const fetchDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats for company:', companyId);
  
  // Return mock data for demo purposes
  return {
    activeJobs: 12,
    completedJobs: 45,
    revenue: 15420,
    completionRate: 87
  };
};

export const fetchRecentActivity = async (companyId: string): Promise<RecentActivity[]> => {
  console.log('Fetching recent activity for company:', companyId);
  
  // Return mock data for demo purposes
  return [
    {
      id: '1',
      type: 'repair_completed',
      description: 'Washing machine repair completed',
      time: '2 hours ago',
      icon: 'CheckSquare'
    },
    {
      id: '2',
      type: 'job_started',
      description: 'Dishwasher diagnostic started',
      time: '4 hours ago',
      icon: 'Clock'
    },
    {
      id: '3',
      type: 'parts_needed',
      description: 'Parts ordered for refrigerator repair',
      time: '6 hours ago',
      icon: 'AlertCircle'
    },
    {
      id: '4',
      type: 'job_scheduled',
      description: 'New appointment scheduled',
      time: '1 day ago',
      icon: 'Calendar'
    }
  ];
};
