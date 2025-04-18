export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  monthlyPrice?: number; // For backward compatibility
  yearlyPrice?: number; // For backward compatibility
  maxTechnicians?: number | null;
  maxAdmins?: number;
  dailyDiagnostics?: number;
  storageLimit?: string | number;
  max_storage: string;
  features: string[];
  trial_period: number;
  trialPeriod?: number; // For backward compatibility
  is_active: boolean;
  isActive?: boolean; // For backward compatibility
  recommended?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface License {
  id: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  status: 'trial' | 'active' | 'expired' | 'canceled';
  activeTechnicians?: number;
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  lastPayment?: Date;
  nextPayment?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // Add these fields to handle the LicenseCard component usage
  name?: string;
  email?: string;
  role?: string;
  activatedOn?: string;
  usageLimits?: {
    diagnosticsPerDay: number;
    maxTechnicians: number;
    storageGB: number;
  };
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
