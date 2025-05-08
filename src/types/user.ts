
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  phone?: string;
  avatarUrl?: string;
  companyId?: string;
  createdAt?: Date;
  trialEndsAt?: Date;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
  planId?: string;
  isMainAdmin?: boolean;
  apiKeys?: ApiKey[];
  status?: string;
  company?: {
    id: string;
    name: string;
    subscription_tier?: string;
  };
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

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}
