
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  avatarUrl?: string;
  companyId?: string;
  trialEndsAt?: Date;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
  planId?: string;
}
