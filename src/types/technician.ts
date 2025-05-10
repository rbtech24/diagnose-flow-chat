
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

export interface TechnicianWithUserInfo extends Technician {
  avatar_url?: string; // This is used in the useCompanyTechnicians hook
}
