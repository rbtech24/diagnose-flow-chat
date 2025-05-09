
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    maxTechnicians: number;
    maxAdmins: number;
    dailyDiagnostics: number;
    storageLimit: number; // in GB
  };
  features: string[];
  trialPeriod: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  billingCycle: 'monthly' | 'yearly';
}

export interface License {
  id: string;
  userId: string;
  companyId: string;
  planId: string;
  status: 'active' | 'expired' | 'trial' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  seats: number;
  planDetails?: SubscriptionPlan;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  date: Date;
  licenseId: string;
  method: string;
}

export type BillingCycle = 'monthly' | 'yearly';
