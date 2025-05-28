import { create } from "zustand";
import { SubscriptionPlan, License, Payment } from "@/types/subscription-consolidated";
import { SubscriptionService } from "@/services/subscriptionService";
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

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plans: [],
  licenses: [],
  payments: [],
  isLoadingPlans: false,
  isLoadingLicenses: false,
  isLoadingPayments: false,
  error: null,
  selectedLicense: null,
  
  fetchPlans: async () => {
    set({ isLoadingPlans: true, error: null });
    
    try {
      const plans = await SubscriptionService.getPlans();
      set({ plans, isLoadingPlans: false });
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ error: (error as Error).message, isLoadingPlans: false });
      toast.error('Failed to fetch subscription plans');
      return [];
    }
  },
  
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    
    try {
      // Note: This would require a licenses table to be created
      // For now, return empty array
      console.log('Fetching licenses for company:', companyId);
      set({ licenses: [], isLoadingLicenses: false });
      return [];
    } catch (error) {
      console.error('Error fetching licenses:', error);
      set({ error: (error as Error).message, isLoadingLicenses: false });
      toast.error('Failed to fetch licenses');
      return [];
    }
  },
  
  fetchLicenseById: async (licenseId: string) => {
    const license = get().licenses.find(license => license.id === licenseId);
    return license || null;
  },
  
  fetchPayments: async (licenseId: string) => {
    set({ isLoadingPayments: true, error: null });
    
    try {
      // Note: This would require a payments table to be created
      console.log('Fetching payments for license:', licenseId);
      set({ payments: [], isLoadingPayments: false });
      return [];
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ error: (error as Error).message, isLoadingPayments: false });
      toast.error('Failed to fetch payments');
      return [];
    }
  },
  
  createLicense: async (licenseData: Partial<License>) => {
    try {
      // Note: This would require a licenses table to be created
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
  
  addPlan: async (newPlan: SubscriptionPlan) => {
    try {
      const createdPlan = await SubscriptionService.createPlan(newPlan);
      set(state => ({
        plans: [...state.plans, createdPlan]
      }));
      toast.success('Plan created successfully');
    } catch (error) {
      console.error('Error adding plan:', error);
      toast.error('Failed to create plan');
    }
  },
  
  updatePlan: async (updatedPlan: SubscriptionPlan) => {
    try {
      const updated = await SubscriptionService.updatePlan(updatedPlan.id, updatedPlan);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === updatedPlan.id ? updated : plan
        )
      }));
      toast.success('Plan updated successfully');
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
    }
  },
  
  togglePlanStatus: async (planId: string) => {
    try {
      const plan = get().plans.find(p => p.id === planId);
      if (!plan) return;

      const updated = await SubscriptionService.togglePlanStatus(planId, plan.is_active);
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === planId ? updated : plan
        )
      }));
      toast.success(`Plan ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling plan status:', error);
      toast.error('Failed to update plan status');
    }
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
