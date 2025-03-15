
import { SubscriptionPlan, License, Payment } from "@/types/subscription";

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    description: "Essential tools for small repair businesses",
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    maxTechnicians: 5,
    maxAdmins: 1,
    dailyDiagnostics: 20,
    storageLimit: 10,
    features: [
      "Basic AI diagnostics",
      "Mobile app access",
      "Community access",
      "Email support"
    ],
    trialPeriod: 14,
    isActive: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01")
  },
  {
    id: "plan-pro",
    name: "Professional",
    description: "Advanced features for growing repair businesses",
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    maxTechnicians: 15,
    maxAdmins: 3,
    dailyDiagnostics: 50,
    storageLimit: 25,
    features: [
      "Basic AI diagnostics",
      "Mobile app access",
      "Community access",
      "Email support",
      "API access",
      "Custom workflows",
      "Priority support"
    ],
    trialPeriod: 14,
    isActive: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-02-15")
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    description: "Complete solution for large repair operations",
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    maxTechnicians: 50,
    maxAdmins: 10,
    dailyDiagnostics: 200,
    storageLimit: 100,
    features: [
      "Basic AI diagnostics",
      "Advanced AI diagnostics",
      "Mobile app access",
      "Community access",
      "Email support",
      "API access",
      "Custom workflows",
      "White labeling",
      "Priority support",
      "Advanced analytics",
      "Dedicated account manager"
    ],
    trialPeriod: 30,
    isActive: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-03-10")
  }
];

export const mockLicenses: License[] = [
  {
    id: "license-1",
    companyId: "company-1",
    companyName: "System Admin Company",
    planId: "plan-enterprise",
    planName: "Enterprise",
    status: "trial",
    activeTechnicians: 2,
    startDate: new Date("2025-02-12"),
    trialEndsAt: new Date("2025-03-14"),
    createdAt: new Date("2025-02-12"),
    updatedAt: new Date("2025-02-12")
  },
  {
    id: "license-2",
    companyId: "company-2",
    companyName: "Test Company",
    planId: "plan-basic",
    planName: "Basic",
    status: "trial",
    activeTechnicians: 2,
    startDate: new Date("2025-02-12"),
    trialEndsAt: new Date("2025-03-14"),
    createdAt: new Date("2025-02-12"),
    updatedAt: new Date("2025-02-12")
  }
];

export const mockPayments: Payment[] = [
  {
    id: "payment-1",
    licenseId: "license-1",
    companyId: "company-1",
    amount: 999.99,
    currency: "USD",
    status: "pending",
    paymentMethod: "credit_card",
    paymentDate: new Date("2025-03-14"),
    createdAt: new Date("2025-02-12")
  }
];
