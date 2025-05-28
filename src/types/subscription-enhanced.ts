
export interface SubscriptionLimits {
  technicians: number;
  admins: number;
  workflows: number;
  storage_gb: number;
  api_calls: number;
  diagnostics_per_day: number;
}

export interface SubscriptionFeatures {
  [key: string]: boolean | string | number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: SubscriptionFeatures;
  limits: SubscriptionLimits;
  is_active: boolean;
  recommended: boolean;
  trial_period: number;
  created_at: string;
  updated_at: string;
}

export interface License {
  id: string;
  company_id: string;
  plan_id: string;
  plan_name: string;
  status: 'trial' | 'active' | 'expired' | 'canceled';
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  nextPayment?: Date;
  activeTechnicians: number;
  maxTechnicians: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  license_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_date: Date;
  payment_method: string;
}
