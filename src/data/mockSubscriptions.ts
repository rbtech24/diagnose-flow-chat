
import { SubscriptionPlan, License, Payment } from "@/types/subscription";

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    description: "Perfect for individual technicians or small repair shops",
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    maxTechnicians: 3,
    maxAdmins: 1,
    dailyDiagnostics: 50,
    storageLimit: 5,
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
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
    maxTechnicians: 10,
    maxAdmins: 3,
    dailyDiagnostics: 200,
    storageLimit: 20,
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
    monthlyPrice: 199.99,
    yearlyPrice: 1999.99,
    maxTechnicians: 50,
    maxAdmins: 10,
    dailyDiagnostics: 1000,
    storageLimit: 100,
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
    updatedAt: new Date(2024, 4, 15)
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
    updatedAt: new Date()
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
    updatedAt: new Date(2024, 3, 11)
  }
];

export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    licenseId: "license-1",
    companyId: "company-1",
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
    licenseId: "license-1",
    companyId: "company-1",
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
    licenseId: "license-3",
    companyId: "company-3",
    amount: 1999.99,
    currency: "USD",
    status: "failed",
    paymentMethod: "credit_card",
    paymentDate: new Date(2024, 3, 10),
    createdAt: new Date(2024, 3, 10)
  }
];
