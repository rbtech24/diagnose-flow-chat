
// Types for activity and metadata
export interface ActivityMetadata {
  repair_id?: string;
  technician_name?: string;
  status?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ActivityItem {
  id: string;
  activity_type: string;
  created_at?: string;
  description: string;
  timestamp: string;
  metadata: ActivityMetadata;
  title: string;
}

export interface FormattedActivity {
  id: string;
  title: string;
  timestamp: string;
  activity_type: string;
  metadata: ActivityMetadata;
}

// Add a specific type for user activity data
export interface UserActivityData {
  id: string;
  activity_type: string;
  created_at: string;
  description?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  user_id?: string;
}
