
import { SubscriptionPlan, License, Payment } from "@/types/subscription";

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    description: "Perfect for individual technicians or small repair shops",
    price: {
      monthly: 29.99,
      yearly: 299.99
    },
    monthlyPrice: 29.99, // For backwards compatibility
    yearlyPrice: 299.99, // For backwards compatibility
    billingCycle: "monthly", // For backwards compatibility
    limits: {
      maxTechnicians: 3,
      maxAdmins: 1,
      dailyDiagnostics: 50,
      storageLimit: 5,
    },
    maxTechnicians: 3, // For backwards compatibility
    maxAdmins: 1, // For backwards compatibility
    dailyDiagnostics: 50, // For backwards compatibility
    storageLimit: 5, // For backwards compatibility
    features: [
      "Diagnostic workflows",
      "Basic reporting",
      "Email support",
      "Mobile access"
    ],
    trialPeriod: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "plan-professional",
    name: "Professional",
    description: "Ideal for growing repair businesses with multiple technicians",
    price: {
      monthly: 79.99,
      yearly: 799.99
    },
    monthlyPrice: 79.99, // For backwards compatibility
    yearlyPrice: 799.99, // For backwards compatibility
    billingCycle: "monthly", // For backwards compatibility
    limits: {
      maxTechnicians: 10,
      maxAdmins: 3,
      dailyDiagnostics: 200,
      storageLimit: 20,
    },
    maxTechnicians: 10, // For backwards compatibility
    maxAdmins: 3, // For backwards compatibility
    dailyDiagnostics: 200, // For backwards compatibility
    storageLimit: 20, // For backwards compatibility
    features: [
      "All Basic features",
      "Custom workflows",
      "Advanced analytics",
      "Priority support",
      "Team collaboration tools",
      "Customer management"
    ],
    trialPeriod: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    description: "Complete solution for large repair companies and franchises",
    price: {
      monthly: 199.99,
      yearly: 1999.99
    },
    monthlyPrice: 199.99, // For backwards compatibility
    yearlyPrice: 1999.99, // For backwards compatibility
    billingCycle: "monthly", // For backwards compatibility
    limits: {
      maxTechnicians: 50,
      maxAdmins: 10,
      dailyDiagnostics: 1000,
      storageLimit: 100,
    },
    maxTechnicians: 50, // For backwards compatibility
    maxAdmins: 10, // For backwards compatibility
    dailyDiagnostics: 1000, // For backwards compatibility
    storageLimit: 100, // For backwards compatibility
    features: [
      "All Professional features",
      "Unlimited workflows",
      "API access",
      "White-label options",
      "Dedicated account manager",
      "Custom reporting",
      "Multi-location management"
    ],
    trialPeriod: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockLicenses: License[] = [
  {
    id: "license-1",
    companyId: "company-1",
    companyName: "ABC Appliance Repair",
    planId: "plan-professional",
    planName: "Professional",
    status: 'active',
    activeTechnicians: 5,
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2025, 2, 15),
    lastPayment: new Date(2024, 4, 15),
    nextPayment: new Date(2024, 5, 15),
    createdAt: new Date(2024, 2, 15),
    expiresAt: new Date(2025, 2, 15)
  },
  {
    id: "license-2",
    companyId: "company-2",
    companyName: "XYZ Repair Co",
    planId: "plan-basic",
    planName: "Basic",
    status: 'trial',
    activeTechnicians: 2,
    startDate: new Date(),
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: "license-3",
    companyId: "company-3",
    companyName: "123 Repair Services",
    planId: "plan-enterprise",
    planName: "Enterprise",
    status: 'expired',
    activeTechnicians: 12,
    startDate: new Date(2023, 5, 10),
    endDate: new Date(2024, 3, 10),
    lastPayment: new Date(2024, 2, 10),
    createdAt: new Date(2023, 5, 10),
    expiresAt: new Date(2024, 3, 10)
  }
];

export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    licenseId: "license-1",
    companyId: "company-1",
    amount: 799.99,
    currency: "USD",
    status: "succeeded",
    method: "credit_card",
    paymentMethod: "credit_card",
    date: new Date(2024, 4, 15),
    paymentDate: new Date(2024, 4, 15),
    invoiceUrl: "https://example.com/invoice/123456"
  },
  {
    id: "payment-2",
    licenseId: "license-1",
    companyId: "company-1",
    amount: 799.99,
    currency: "USD",
    status: "succeeded",
    method: "credit_card",
    paymentMethod: "credit_card",
    date: new Date(2024, 3, 15),
    paymentDate: new Date(2024, 3, 15),
    invoiceUrl: "https://example.com/invoice/123455"
  },
  {
    id: "payment-3",
    licenseId: "license-3",
    companyId: "company-3",
    amount: 1999.99,
    currency: "USD",
    status: "failed",
    method: "credit_card",
    paymentMethod: "credit_card",
    date: new Date(2024, 3, 10),
    paymentDate: new Date(2024, 3, 10)
  }
];
