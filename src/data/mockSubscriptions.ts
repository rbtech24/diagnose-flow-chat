
import { SubscriptionPlan, License, Payment } from "@/types/subscription";

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    description: "Perfect for individual technicians or small repair shops",
    price_monthly: 29.99,
    price_yearly: 299.99,
    limits: {
      technicians: 3,
      admins: 1, 
      workflows: 10,
      storage_gb: 5,
      api_calls: 1000,
      diagnostics_per_day: 50
    },
    features: [
      "Diagnostic workflows",
      "Basic reporting",
      "Email support",
      "Mobile access"
    ],
    trial_period: 30,
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "plan-professional",
    name: "Professional",
    description: "Ideal for growing repair businesses with multiple technicians",
    price_monthly: 79.99,
    price_yearly: 799.99,
    limits: {
      technicians: 10,
      admins: 3,
      workflows: 50,
      storage_gb: 20,
      api_calls: 5000,
      diagnostics_per_day: 200
    },
    features: [
      "All Basic features",
      "Custom workflows",
      "Advanced analytics",
      "Priority support",
      "Team collaboration tools",
      "Customer management"
    ],
    trial_period: 30,
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    description: "Complete solution for large repair companies and franchises",
    price_monthly: 199.99,
    price_yearly: 1999.99,
    limits: {
      technicians: 50,
      admins: 10,
      workflows: 500,
      storage_gb: 100,
      api_calls: 50000,
      diagnostics_per_day: 1000
    },
    features: [
      "All Professional features",
      "Unlimited workflows",
      "API access",
      "White-label options",
      "Dedicated account manager",
      "Custom reporting",
      "Multi-location management"
    ],
    trial_period: 30,
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockLicenses: License[] = [
  {
    id: "license-1",
    company_id: "company-1",
    company_name: "ABC Appliance Repair",
    plan_id: "plan-professional",
    plan_name: "Professional",
    status: 'active',
    activeTechnicians: 5,
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2025, 2, 15),
    lastPayment: new Date(2024, 4, 15),
    nextPayment: new Date(2024, 5, 15),
    createdAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 4, 15)
  },
  {
    id: "license-2",
    company_id: "company-2",
    company_name: "XYZ Repair Co",
    plan_id: "plan-basic",
    plan_name: "Basic",
    status: 'trial',
    activeTechnicians: 2,
    startDate: new Date(),
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "license-3",
    company_id: "company-3",
    company_name: "123 Repair Services",
    plan_id: "plan-enterprise",
    plan_name: "Enterprise",
    status: 'expired',
    activeTechnicians: 12,
    startDate: new Date(2023, 5, 10),
    endDate: new Date(2024, 3, 10),
    lastPayment: new Date(2024, 2, 10),
    createdAt: new Date(2023, 5, 10),
    updatedAt: new Date(2024, 3, 11)
  }
];

export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    license_id: "license-1",
    company_id: "company-1",
    amount: 799.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    paymentDate: new Date(2024, 4, 15),
    invoiceUrl: "https://example.com/invoice/123456",
    createdAt: new Date(2024, 4, 15)
  },
  {
    id: "payment-2",
    license_id: "license-1",
    company_id: "company-1",
    amount: 799.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    paymentDate: new Date(2024, 3, 15),
    invoiceUrl: "https://example.com/invoice/123455",
    createdAt: new Date(2024, 3, 15)
  },
  {
    id: "payment-3",
    license_id: "license-3",
    company_id: "company-3",
    amount: 1999.99,
    currency: "USD",
    status: "failed",
    paymentMethod: "credit_card",
    paymentDate: new Date(2024, 3, 10),
    createdAt: new Date(2024, 3, 10)
  }
];
