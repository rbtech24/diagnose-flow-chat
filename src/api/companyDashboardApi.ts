
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

interface RepairRecord {
  status: string;
  actual_cost: number | null;
  completed_at: string | null;
}

interface ActivityRecord {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export const fetchDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats for company:', companyId);
  
  try {
    const { data: repairsData, error: repairsError } = await supabase
      .from('repairs')
      .select('status, actual_cost, completed_at')
      .eq('company_id', companyId);

    if (repairsError) {
      console.error('Error fetching repairs data:', repairsError);
      return {
        activeJobs: 0,
        completedJobs: 0,
        revenue: 0,
        completionRate: 0
      };
    }

    const repairs = repairsData || [];
    const activeJobs = repairs.filter((r: RepairRecord) => r.status === 'in_progress').length;
    const completedJobs = repairs.filter((r: RepairRecord) => r.status === 'completed').length;
    const revenue = repairs
      .filter((r: RepairRecord) => r.status === 'completed' && r.actual_cost)
      .reduce((sum: number, r: RepairRecord) => sum + (Number(r.actual_cost) || 0), 0);
    const completionRate = repairs.length > 0 
      ? Math.round((completedJobs / repairs.length) * 100) 
      : 0;

    return {
      activeJobs,
      completedJobs,
      revenue,
      completionRate
    };
  } catch (error) {
    console.error('Error in fetchDashboardStats:', error);
    return {
      activeJobs: 0,
      completedJobs: 0,
      revenue: 0,
      completionRate: 0
    };
  }
};

export const fetchRecentActivity = async (companyId: string): Promise<RecentActivity[]> => {
  console.log('Fetching recent activity for company:', companyId);
  
  try {
    const { data: activityData, error } = await supabase
      .from("user_activity_logs")
      .select("id, activity_type, description, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }

    if (!activityData || activityData.length === 0) {
      return [];
    }

    const activities: RecentActivity[] = activityData.map((activity: ActivityRecord) => ({
      id: activity.id || `activity-${Date.now()}`,
      type: mapActivityTypeToRecentActivity(activity.activity_type || 'unknown'),
      description: activity.description || 'Activity recorded',
      time: formatTimeAgo(new Date(activity.created_at || new Date())),
      icon: getActivityIcon(activity.activity_type || 'unknown')
    }));

    return activities;
  } catch (error) {
    console.error('Error in fetchRecentActivity:', error);
    return [];
  }
};

function mapActivityTypeToRecentActivity(activityType: string): RecentActivity['type'] {
  switch (activityType) {
    case 'repair_completed':
    case 'job_completed':
      return 'repair_completed';
    case 'repair_started':
    case 'job_started':
      return 'job_started';
    case 'parts_ordered':
    case 'parts_needed':
      return 'parts_needed';
    case 'job_scheduled':
    case 'appointment_scheduled':
      return 'job_scheduled';
    default:
      return 'job_started';
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${Math.max(1, diffInMinutes)} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
}

function getActivityIcon(activityType: string): string {
  switch (activityType) {
    case 'repair_completed':
    case 'job_completed':
      return 'CheckSquare';
    case 'repair_started':
    case 'job_started':
      return 'Clock';
    case 'parts_ordered':
    case 'parts_needed':
      return 'AlertCircle';
    case 'job_scheduled':
    case 'appointment_scheduled':
      return 'Calendar';
    default:
      return 'Activity';
  }
}
