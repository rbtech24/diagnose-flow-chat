
import { supabase } from "@/integrations/supabase/client";
import { APIErrorHandler } from "@/utils/apiErrorHandler";

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

// Fetch dashboard statistics
export const fetchDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    // Since we don't have a repairs table yet, let's return mock data
    // that simulates what would come from a real database
    console.log('Fetching dashboard stats for company:', companyId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      activeJobs: Math.floor(Math.random() * 50) + 10,
      completedJobs: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      completionRate: Math.floor(Math.random() * 30) + 70
    };
  }, "fetchDashboardStats");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch recent activity
export const fetchRecentActivity = async (companyId: string): Promise<RecentActivity[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    console.log('Fetching recent activity for company:', companyId);
    
    // Check if user_activity_logs table exists, if not return mock data
    try {
      const { data: activityData, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.log('Activity logs table not found, using mock data');
        // Return mock data if table doesn't exist
        return generateMockActivity();
      }

      return (activityData || []).map(activity => ({
        id: activity.id,
        type: activity.activity_type as RecentActivity['type'],
        description: activity.description,
        time: formatTimeAgo(new Date(activity.created_at)),
        icon: getActivityIcon(activity.activity_type)
      }));
    } catch (error) {
      console.log('Using mock activity data due to error:', error);
      return generateMockActivity();
    }
  }, "fetchRecentActivity");

  if (!response.success) throw response.error;
  return response.data!;
};

// Generate mock activity data
function generateMockActivity(): RecentActivity[] {
  const activities = [
    {
      id: '1',
      type: 'repair_completed' as const,
      description: 'Washing machine repair completed successfully',
      time: '2 hours ago',
      icon: 'CheckSquare'
    },
    {
      id: '2', 
      type: 'job_started' as const,
      description: 'Started dishwasher diagnostic',
      time: '4 hours ago',
      icon: 'Clock'
    },
    {
      id: '3',
      type: 'parts_needed' as const,
      description: 'Ordered replacement motor for dryer repair',
      time: '6 hours ago',
      icon: 'AlertCircle'
    }
  ];
  
  return activities;
}

// Helper function to format time ago
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

// Helper function to get activity icon
function getActivityIcon(activityType: string): string {
  switch (activityType) {
    case 'repair_completed':
      return 'CheckSquare';
    case 'job_started':
      return 'Clock';
    case 'parts_needed':
      return 'AlertCircle';
    case 'job_scheduled':
      return 'Calendar';
    default:
      return 'Activity';
  }
}
