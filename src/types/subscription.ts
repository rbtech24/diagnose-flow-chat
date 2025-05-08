
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxTechnicians: number;
  maxAdmins: number;
  dailyDiagnostics: number;
  storageLimit: number; // in GB
  features: string[];
  trialPeriod: number; // in days
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface License {
  id: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  status: 'trial' | 'active' | 'expired' | 'canceled';
  activeTechnicians: number;
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  lastPayment?: Date;
  nextPayment?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  licenseId: string;
  companyId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentDate: Date;
  invoiceUrl?: string;
  createdAt: Date;
}

export type BillingCycle = 'monthly' | 'yearly';
