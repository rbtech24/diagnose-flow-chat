
export interface TechnicianProfile {
  id: string;
  company_id: string;
  email: string;
  phone?: string;
  role: 'admin' | 'company_admin' | 'technician';
  status: 'active' | 'inactive' | 'pending';
  is_independent: boolean;
  available_for_hire: boolean;
  hourly_rate?: number;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
  // Profile information
  full_name?: string;
  avatar_url?: string;
}
