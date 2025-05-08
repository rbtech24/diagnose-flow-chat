
// Types for activity and metadata
export interface ActivityMetadata {
  repair_id?: string;
  technician_name?: string;
  status?: string;
  [key: string]: any;
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
