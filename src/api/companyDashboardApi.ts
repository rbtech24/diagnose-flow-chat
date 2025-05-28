
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
    // Get active jobs count
    const { data: activeJobs, error: activeJobsError } = await supabase
      .from("repairs")
      .select("id", { count: 'exact' })
      .eq("company_id", companyId)
      .in("status", ["pending", "in_progress"]);

    if (activeJobsError) throw activeJobsError;

    // Get completed jobs count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: completedJobs, error: completedJobsError } = await supabase
      .from("repairs")
      .select("id", { count: 'exact' })
      .eq("company_id", companyId)
      .eq("status", "completed")
      .gte("completed_at", thirtyDaysAgo.toISOString());

    if (completedJobsError) throw completedJobsError;

    // Calculate revenue (last 30 days)
    const { data: revenueData, error: revenueError } = await supabase
      .from("repairs")
      .select("actual_cost")
      .eq("company_id", companyId)
      .eq("status", "completed")
      .gte("completed_at", thirtyDaysAgo.toISOString())
      .not("actual_cost", "is", null);

    if (revenueError) throw revenueError;

    // Calculate total revenue
    const revenue = revenueData?.reduce((sum, repair) => {
      return sum + (repair.actual_cost || 0);
    }, 0) || 0;

    // Calculate completion rate (jobs completed on time vs total jobs)
    const { data: totalJobsData, error: totalJobsError } = await supabase
      .from("repairs")
      .select("id", { count: 'exact' })
      .eq("company_id", companyId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (totalJobsError) throw totalJobsError;

    const totalJobs = totalJobsData?.length || 0;
    const completedJobsCount = completedJobs?.length || 0;
    const completionRate = totalJobs > 0 ? Math.round((completedJobsCount / totalJobs) * 100) : 0;

    return {
      activeJobs: activeJobs?.length || 0,
      completedJobs: completedJobsCount,
      revenue: Number(revenue),
      completionRate
    };
  }, "fetchDashboardStats");

  if (!response.success) throw response.error;
  return response.data!;
};

// Fetch recent activity
export const fetchRecentActivity = async (companyId: string): Promise<RecentActivity[]> => {
  const response = await APIErrorHandler.handleAPICall(async () => {
    const { data: activityData, error } = await supabase
      .from("user_activity_logs")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return (activityData || []).map(activity => ({
      id: activity.id,
      type: activity.activity_type as RecentActivity['type'],
      description: activity.description,
      time: formatTimeAgo(new Date(activity.created_at)),
      icon: getActivityIcon(activity.activity_type)
    }));
  }, "fetchRecentActivity");

  if (!response.success) throw response.error;
  return response.data!;
};

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
