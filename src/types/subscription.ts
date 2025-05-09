
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  monthlyPrice: number;  // For backward compatibility
  yearlyPrice: number;   // For backward compatibility
  limits: {
    maxTechnicians: number;
    maxAdmins: number;
    dailyDiagnostics: number;
    storageLimit: number; // in GB
  };
  maxTechnicians: number;  // For backward compatibility
  maxAdmins: number;       // For backward compatibility
  dailyDiagnostics: number; // For backward compatibility
  storageLimit: number;     // For backward compatibility
  features: string[];
  trialPeriod: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  billingCycle: 'monthly' | 'yearly';
}

export interface License {
  id: string;
  userId?: string;
  companyId: string;
  companyName?: string;
  planId: string;
  planName?: string;
  status: 'active' | 'expired' | 'trial' | 'cancelled';
  createdAt: Date;
  expiresAt?: Date;
  seats?: number;
  planDetails?: SubscriptionPlan;
  activeTechnicians?: number;
  startDate?: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  lastPayment?: Date;
  nextPayment?: Date;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'completed';
  date: Date;
  licenseId: string;
  method: string;
  companyId?: string;
  paymentMethod?: string;
  paymentDate?: Date;
  invoiceUrl?: string;
}

export type BillingCycle = 'monthly' | 'yearly';
