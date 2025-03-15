
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  phone?: string;
  avatarUrl?: string;
  companyId?: string;
  trialEndsAt?: Date;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
  planId?: string;
}

export interface TechnicianInvite {
  id: string;
  email: string;
  name: string;
  phone?: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}
