
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number; // For backwards compatibility
  monthlyPrice: number;
  yearlyPrice: number;
  billingCycle: 'monthly' | 'yearly'; // For backwards compatibility
  features: string[];
  maxTechnicians: number;
  maxAdmins: number;
  dailyDiagnostics: number;
  storageLimit: number;
  trialPeriod: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BillingCycle = 'monthly' | 'yearly';

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
  status: string;
  paymentMethod: string;
  paymentDate: Date;
  invoiceUrl?: string;
  createdAt: Date;
}
