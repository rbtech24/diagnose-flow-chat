
export interface Technician {
  id: string;
  name: string;
  email?: string;
  status: 'active' | 'offline';
  role: string;
  avatar_url?: string;
  activeJobs: number;
}
