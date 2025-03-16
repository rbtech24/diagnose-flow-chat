
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
  isMainAdmin?: boolean;
  apiKeys?: ApiKey[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  scopes?: string[];
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

// Extended user type for registration/creation that includes password
export interface UserWithPassword extends Omit<User, 'id'> {
  password: string;
}
