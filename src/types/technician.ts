export type Technician = {
  id: string;
  name: string; 
  email: string;
  role: 'admin' | 'company' | 'tech';
  companyId: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  activeJobs: number;
};

export interface TechnicianWithUserInfo {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  company_id: string;
  companyId: string; // Mapping property
  status: string;
  avatar_url?: string;
  avatarUrl?: string; // Mapping property
  activeJobs: number;
  phone?: string;
  is_independent?: boolean;
  hourly_rate?: number;
  available_for_hire?: boolean;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

// Add these new types to help with Dashboard queries
export interface TechnicianMetricsResponse {
  average_service_time?: number | null;
  efficiency_score?: number | null;
}
