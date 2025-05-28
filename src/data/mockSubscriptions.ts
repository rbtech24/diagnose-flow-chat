
import { SubscriptionPlan, License, Payment } from '@/types/subscription-enhanced';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    description: 'Perfect for small repair shops',
    price_monthly: 29.99,
    price_yearly: 299.99,
    features: {
      workflows: true,
      diagnostics: true,
      basic_support: true
    },
    limits: {
      technicians: 5,
      admins: 2,
      workflows: 50,
      storage_gb: 10,
      api_calls: 1000,
      diagnostics_per_day: 100
    },
    is_active: true,
    recommended: false,
    trial_period: 14,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockSubscriptionPlans;
}

export const mockLicenses: License[] = [
  {
    id: 'license-1',
    company_id: 'company-2',
    plan_id: 'plan-basic',
    plan_name: 'Basic Plan',
    status: 'trial',
    startDate: new Date('2024-01-01'),
    trialEndsAt: new Date('2024-02-01'),
    activeTechnicians: 3,
    maxTechnicians: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export async function getLicenses(companyId: string): Promise<License[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockLicenses.filter(license => license.company_id === companyId);
}

export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    license_id: 'license-1',
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    payment_date: new Date('2024-01-01'),
    payment_method: 'credit_card'
  }
];

export async function getPayments(): Promise<Payment[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPayments;
}
