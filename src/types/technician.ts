
export interface Technician {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'offline'; 
  phone?: string;
  company_id?: string;
  activeJobs?: number;
  is_independent?: boolean;
  hourly_rate?: number;
  available_for_hire?: boolean;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

export interface TechnicianWithUserInfo extends Technician {
  name?: string;
  avatar_url?: string;
}
