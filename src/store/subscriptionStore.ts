
import { create } from "zustand";
import { SubscriptionPlan, License, Payment } from "@/types/subscription-consolidated";
import { toast } from "sonner";

interface SubscriptionStore {
  plans: SubscriptionPlan[];
  licenses: License[];
  payments: Payment[];
  isLoadingPlans: boolean;
  isLoadingLicenses: boolean;
  isLoadingPayments: boolean;
  error: string | null;
  selectedLicense: License | null;
  
  fetchPlans: () => Promise<SubscriptionPlan[]>;
  fetchLicenses: (companyId: string) => Promise<License[]>;
  fetchLicenseById: (licenseId: string) => Promise<License | null>;
  fetchPayments: (licenseId: string) => Promise<Payment[]>;
  createLicense: (data: Partial<License>) => Promise<License | null>;
  updateLicense: (licenseId: string, data: Partial<License>) => Promise<License | null>;
  cancelLicense: (licenseId: string) => Promise<boolean>;
  setSelectedLicense: (license: License | null) => void;
  
  getActivePlans: () => SubscriptionPlan[];
  addPlan: (plan: SubscriptionPlan) => void;
  updatePlan: (plan: SubscriptionPlan) => void;
  togglePlanStatus: (planId: string) => void;
  addLicense: (license: License) => void;
  deactivateLicense: (licenseId: string) => void;
}

// Mock data for development
const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Perfect for small teams',
    price_monthly: 29,
    price_yearly: 290,
    features: {
      basic_support: true,
      mobile_app: true,
      reporting: false,
      api_access: false
    },
    limits: {
      technicians: 5,
      admins: 2,
      workflows: 10,
      storage_gb: 10,
      api_calls: 1000,
      diagnostics_per_day: 50
    },
    is_active: true,
    recommended: false,
    trial_period: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Professional',
    description: 'For growing businesses',
    price_monthly: 79,
    price_yearly: 790,
    features: {
      basic_support: true,
      mobile_app: true,
      reporting: true,
      api_access: true,
      priority_support: true
    },
    limits: {
      technicians: 20,
      admins: 5,
      workflows: 50,
      storage_gb: 100,
      api_calls: 10000,
      diagnostics_per_day: 200
    },
    is_active: true,
    recommended: true,
    trial_period: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plans: mockPlans,
  licenses: [],
  payments: [],
  isLoadingPlans: false,
  isLoadingLicenses: false,
  isLoadingPayments: false,
  error: null,
  selectedLicense: null,
  
  fetchPlans: async () => {
    set({ isLoadingPlans: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({ plans: mockPlans, isLoadingPlans: false });
    return mockPlans;
  },
  
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLicenses: License[] = [];
    set({ licenses: mockLicenses, isLoadingLicenses: false });
    return mockLicenses;
  },
  
  fetchLicenseById: async (licenseId: string) => {
    const license = get().licenses.find(license => license.id === licenseId);
    return license || null;
  },
  
  fetchPayments: async (licenseId: string) => {
    set({ isLoadingPayments: true, error: null });
    
    const mockPayments: Payment[] = [];
    set({ payments: mockPayments, isLoadingPayments: false });
    return mockPayments;
  },
  
  createLicense: async (licenseData: Partial<License>) => {
    try {
      const newLicense: License = {
        id: `license-${Date.now()}`,
        company_id: licenseData.company_id || '',
        company_name: licenseData.company_name || '',
        plan_id: licenseData.plan_id || '',
        plan_name: licenseData.plan_name || '',
        status: licenseData.status || 'trial',
        startDate: licenseData.startDate || new Date(),
        trialEndsAt: licenseData.trialEndsAt,
        activeTechnicians: licenseData.activeTechnicians || 0,
        maxTechnicians: licenseData.maxTechnicians || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        licenses: [...state.licenses, newLicense]
      }));
      
      toast.success('License created successfully');
      return newLicense;
    } catch (error) {
      console.error('Error creating license:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to create license');
      return null;
    }
  },
  
  updateLicense: async (licenseId: string, updateData: Partial<License>) => {
    try {
      let updatedLicense: License | null = null;
      
      set(state => {
        const licenses = state.licenses.map(license => 
          license.id === licenseId ? 
          { 
            ...license, 
            ...updateData,
            updatedAt: new Date()
          } : 
          license
        );
        
        updatedLicense = licenses.find(license => license.id === licenseId) || null;
        
        return {
          licenses,
          selectedLicense: state.selectedLicense?.id === licenseId ? 
            updatedLicense : state.selectedLicense
        };
      });
      
      toast.success('License updated successfully');
      return updatedLicense;
    } catch (error) {
      console.error('Error updating license:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to update license');
      return null;
    }
  },
  
  cancelLicense: async (licenseId: string) => {
    try {
      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? 
          { ...license, status: 'canceled', updatedAt: new Date() } : 
          license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          { ...state.selectedLicense, status: 'canceled', updatedAt: new Date() } : 
          state.selectedLicense
      }));
      
      toast.success('License canceled successfully');
      return true;
    } catch (error) {
      console.error('Error canceling license:', error);
      set({ error: (error as Error).message });
      toast.error('Failed to cancel license');
      return false;
    }
  },
  
  setSelectedLicense: (license: License | null) => {
    set({ selectedLicense: license });
  },
  
  getActivePlans: () => {
    return get().plans.filter(plan => plan.is_active);
  },
  
  addPlan: (newPlan: SubscriptionPlan) => {
    set(state => ({
      plans: [...state.plans, {
        ...newPlan,
        id: newPlan.id || `plan-${Date.now()}`
      }]
    }));
  },
  
  updatePlan: (updatedPlan: SubscriptionPlan) => {
    set(state => ({
      plans: state.plans.map(plan => 
        plan.id === updatedPlan.id ? updatedPlan : plan
      )
    }));
  },
  
  togglePlanStatus: (planId: string) => {
    set(state => ({
      plans: state.plans.map(plan => 
        plan.id === planId ? 
        { ...plan, is_active: !plan.is_active } : 
        plan
      )
    }));
  },
  
  addLicense: (license: License) => {
    set(state => ({
      licenses: [...state.licenses, license]
    }));
  },
  
  deactivateLicense: (licenseId: string) => {
    return get().cancelLicense(licenseId);
  }
}));
