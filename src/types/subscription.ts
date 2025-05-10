
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[] | any;
  limits: {
    technicians: number;
    admins: number;
    workflows: number;
    storage_gb: number;
    api_calls: number;
    diagnostics_per_day: number;
  };
  trial_period: number;
  is_active: boolean;
  recommended?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BillingCycle = 'monthly' | 'yearly';

export interface License {
  id: string;
  company_id: string;
  company_name: string;
  plan_id: string;
  plan_name: string;
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
  license_id: string;
  company_id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentDate: Date;
  invoiceUrl?: string;
  createdAt: Date;
}
