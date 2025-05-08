
import { supabase } from "@/integrations/supabase/client";

export interface ActivityLog {
  id: string;
  user_id?: string;
  activity_type: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  user?: {
    name?: string;
    email?: string;
    role?: string;
    avatar_url?: string;
  };
}

export type ActivityTimeframe = 'all' | 'today' | 'week' | 'month';

/**
 * Fetch activity logs from the database
 * @param timeframe Filter by timeframe
 * @param type Filter by activity type
 * @param searchQuery Search query string
 * @returns Array of activity logs
 */
export async function fetchActivityLogs(
  timeframe: ActivityTimeframe = 'all',
  type?: string,
  searchQuery?: string
): Promise<ActivityLog[]> {
  try {
    // Start building the query
    let query = supabase
      .from('user_activity_logs')
      .select(`
        id,
        user_id,
        activity_type,
        description,
        created_at,
        ip_address,
        user_agent,
        metadata,
        user:user_id (
          name,
          email,
          role,
          avatar_url
        )
      `);
    
    // Apply timeframe filter
    if (timeframe !== 'all') {
      const now = new Date();
      let fromDate: Date;
      
      switch (timeframe) {
        case 'today':
          fromDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          fromDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          fromDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          fromDate = new Date(0); // Beginning of time
      }
      
      query = query.gte('created_at', fromDate.toISOString());
    }
    
    // Apply type filter
    if (type && type !== 'all') {
      query = query.eq('activity_type', type);
    }
    
    // Apply search filter if provided
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`description.ilike.%${searchQuery}%,activity_type.ilike.%${searchQuery}%`);
    }
    
    // Order by timestamp descending (newest first)
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data, error } = await query.limit(100);
    
    if (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
    
    // Transform the data to match our ActivityLog interface
    const activityLogs: ActivityLog[] = (data || []).map(log => ({
      id: log.id,
      user_id: log.user_id,
      activity_type: log.activity_type,
      description: log.description,
      timestamp: log.created_at,
      ip_address: log.ip_address,
      user_agent: log.user_agent,
      metadata: log.metadata,
      user: log.user
    }));
    
    return activityLogs;
  } catch (error) {
    console.error('Error in fetchActivityLogs:', error);
    throw error;
  }
}

/**
 * Log a new activity
 * @param activityData Activity data to log
 * @returns The created activity log
 */
export async function logActivity(activityData: {
  activity_type: string;
  description: string;
  metadata?: Record<string, any>;
}): Promise<ActivityLog> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  const { data, error } = await supabase
    .from('user_activity_logs')
    .insert({
      user_id: userId,
      activity_type: activityData.activity_type,
      description: activityData.description,
      metadata: activityData.metadata || {}
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
  
  return {
    id: data.id,
    user_id: data.user_id,
    activity_type: data.activity_type,
    description: data.description,
    timestamp: data.created_at,
    ip_address: data.ip_address,
    user_agent: data.user_agent,
    metadata: data.metadata
  };
}
