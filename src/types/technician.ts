
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
