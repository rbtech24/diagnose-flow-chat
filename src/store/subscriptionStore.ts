
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, License, Payment } from "@/types/subscription";
import { getSubscriptionPlans, getLicenses, getPayments } from "@/data/mockSubscriptions";
import { toast } from "sonner";

// Define the store state
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
  
  // Additional methods for the UI
  getActivePlans: () => SubscriptionPlan[];
  addPlan: (plan: SubscriptionPlan) => void;
  updatePlan: (plan: SubscriptionPlan) => void;
  togglePlanStatus: (planId: string) => void;
  addLicense: (license: License) => void;
  deactivateLicense: (licenseId: string) => void;
}

// Create the store
export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  plans: [],
  licenses: [],
  payments: [],
  isLoadingPlans: false,
  isLoadingLicenses: false,
  isLoadingPayments: false,
  error: null,
  selectedLicense: null,
  
  // Fetch subscription plans
  fetchPlans: async () => {
    set({ isLoadingPlans: true, error: null });
    try {
      const plans = await getSubscriptionPlans();
      set({ plans, isLoadingPlans: false });
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ error: (error as Error).message, isLoadingPlans: false });
      return get().plans;
    }
  },
  
  // Fetch licenses for a company
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    try {
      const licenses = await getLicenses(companyId);
      set({ licenses, isLoadingLicenses: false });
      return licenses;
    } catch (error) {
      console.error('Error fetching licenses:', error);
      set({ error: (error as Error).message, isLoadingLicenses: false });
      return get().licenses;
    }
  },
  
  // Fetch a single license by ID
  fetchLicenseById: async (licenseId: string) => {
    try {
      // For now, find the license in the current state
      const license = get().licenses.find(license => license.id === licenseId) || null;
      return license;
    } catch (error) {
      console.error('Error fetching license:', error);
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  // Fetch payments for a license
  fetchPayments: async (licenseId: string) => {
    set({ isLoadingPayments: true, error: null });
    try {
      const payments = await getPayments();
      // Filter payments by license ID if needed
      const filteredPayments = payments.filter(payment => payment.license_id === licenseId);
      set({ payments: filteredPayments, isLoadingPayments: false });
      return filteredPayments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ error: (error as Error).message, isLoadingPayments: false });
      return get().payments;
    }
  },
  
  // Create a new license
  createLicense: async (licenseData: Partial<License>) => {
    try {
      // For now, we'll use the mock data approach and just create a new license in memory
      // In a real application, you would insert into the database
      
      const newLicense = {
        ...licenseData,
        id: `license-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as License;
      
      set(state => ({
        licenses: [...state.licenses, newLicense]
      }));
      
      return newLicense;
    } catch (error) {
      console.error('Error creating license:', error);
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  // Update an existing license
  updateLicense: async (licenseId: string, updateData: Partial<License>) => {
    try {
      // For now, we'll update the license in memory
      // In a real application, you would update the database record
      
      let updatedLicense: License | null = null;
      
      set(state => {
        const licenses = state.licenses.map(license => 
          license.id === licenseId ? 
          { ...license, ...updateData, updatedAt: new Date() } : 
          license
        );
        
        updatedLicense = licenses.find(license => license.id === licenseId) || null;
        
        return {
          licenses,
          selectedLicense: state.selectedLicense?.id === licenseId ? 
            updatedLicense : state.selectedLicense
        };
      });
      
      return updatedLicense;
    } catch (error) {
      console.error('Error updating license:', error);
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  // Cancel a license
  cancelLicense: async (licenseId: string) => {
    try {
      // For now, we'll just update the license status in memory
      // In a real application, you would update the database record
      
      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? { ...license, status: 'canceled', updatedAt: new Date() } : license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          { ...state.selectedLicense, status: 'canceled', updatedAt: new Date() } : state.selectedLicense
      }));
      
      return true;
    } catch (error) {
      console.error('Error deactivating license:', error);
      set({ error: (error as Error).message });
      return false;
    }
  },
  
  // Set the selected license
  setSelectedLicense: (license: License | null) => {
    set({ selectedLicense: license });
  },
  
  // Additional methods for the UI
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
