
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
  companyId?: string;
}
