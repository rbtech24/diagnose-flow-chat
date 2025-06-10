
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

// Define the raw data type from Supabase
interface RawActivityData {
  id: string | number;
  activity_type: string | null;
  description: string | null;
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

    if (!repairsData || repairsData.length === 0) {
      return {
        activeJobs: 0,
        completedJobs: 0,
        revenue: 0,
        completionRate: 0
      };
    }

    let activeJobs = 0;
    let completedJobs = 0;
    let revenue = 0;

    // Process repairs data
    for (const repair of repairsData) {
      if (repair?.status === 'in_progress') {
        activeJobs++;
      }
      if (repair?.status === 'completed') {
        completedJobs++;
        if (repair?.actual_cost) {
          const cost = Number(repair.actual_cost);
          if (!isNaN(cost)) {
            revenue += cost;
          }
        }
      }
    }
      
    const completionRate = repairsData.length > 0 
      ? Math.round((completedJobs / repairsData.length) * 100) 
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
    const { data: rawData, error } = await supabase
      .from("user_activity_logs")
      .select("id, activity_type, description, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching activity data:', error);
      return [];
    }

    if (!rawData || rawData.length === 0) {
      return [];
    }

    // Explicitly type the raw data and map it
    const typedRawData = rawData as RawActivityData[];
    const activities: RecentActivity[] = [];
    
    for (const item of typedRawData) {
      const activity: RecentActivity = {
        id: String(item.id || `activity-${Date.now()}-${Math.random()}`),
        type: mapActivityTypeToRecentActivity(item.activity_type || 'unknown'),
        description: item.description || 'Activity recorded',
        time: formatTimeAgo(new Date(item.created_at || new Date().toISOString())),
        icon: getActivityIcon(item.activity_type || 'unknown')
      };
      activities.push(activity);
    }

    return activities;
  } catch (error) {
    console.error('Error in fetchRecentActivity:', error);
    return [];
  }
};

function mapActivityTypeToRecentActivity(activityType: string): 'repair_completed' | 'job_started' | 'parts_needed' | 'job_scheduled' {
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
