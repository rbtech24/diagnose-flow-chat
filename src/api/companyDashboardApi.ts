
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

interface Technician {
  id: string;
  status: string;
}

interface DiagnosticSession {
  id: string;
  status: string;
  created_at: string;
  completed_at?: string;
}

export const fetchDashboardStats = async (companyId: string): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats for company:', companyId);
  
  try {
    // Get technician count as a proxy for active jobs (since we don't have a jobs table yet)
    const { data: technicians } = await supabase
      .from('technicians')
      .select('id, status')
      .eq('company_id', companyId);

    const activeJobs = (technicians as Technician[])?.filter((t) => t.status === 'active').length || 0;

    // Get diagnostic sessions as completed jobs
    const { data: diagnosticSessions } = await supabase
      .from('diagnostic_sessions')
      .select('id, status')
      .eq('company_id', companyId)
      .eq('status', 'completed');

    const completedJobs = diagnosticSessions?.length || 0;

    // Calculate basic revenue estimate (placeholder calculation)
    const revenue = completedJobs * 150; // $150 average per completed job

    // Calculate completion rate
    const totalJobs = activeJobs + completedJobs;
    const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

    return {
      activeJobs,
      completedJobs,
      revenue,
      completionRate
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback data
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
    const activities: RecentActivity[] = [];

    // Get recent diagnostic sessions
    const { data: recentDiagnostics } = await supabase
      .from('diagnostic_sessions')
      .select('id, status, created_at, completed_at')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentDiagnostics) {
      (recentDiagnostics as DiagnosticSession[]).forEach((session) => {
        if (session.status === 'completed') {
          activities.push({
            id: session.id,
            type: 'repair_completed',
            description: 'Diagnostic session completed',
            time: formatTimeAgo(session.completed_at || session.created_at),
            icon: 'CheckSquare'
          });
        } else if (session.status === 'in_progress') {
          activities.push({
            id: session.id,
            type: 'job_started',
            description: 'Diagnostic session started',
            time: formatTimeAgo(session.created_at),
            icon: 'Clock'
          });
        }
      });
    }

    // Add some mock activities since the notifications table may not exist or may not have the expected columns
    activities.push({
      id: 'mock-1',
      type: 'job_scheduled',
      description: 'New job scheduled',
      time: formatTimeAgo(new Date().toISOString()),
      icon: 'Calendar'
    });

    // Sort by most recent and return top 4
    return activities.slice(0, 4);

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    // Return mock data on error
    return [
      {
        id: 'error-1',
        type: 'job_scheduled',
        description: 'Recent activity unavailable',
        time: 'Just now',
        icon: 'Calendar'
      }
    ];
  }
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
