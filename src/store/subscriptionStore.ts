
// Mock implementation for the subscription store
// Replace with real implementations when connected to Supabase

import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

// Define the subscription plan type
export type SubscriptionPlan = {
  id: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    technicians: number;
    admins: number;
    workflows: number;
    storage_gb: number;
    api_calls: number;
    diagnostics_per_day: number;
  };
  is_active: boolean;
  recommended: boolean;
};

// Define the license type
export type License = {
  id: string;
  company_id: string;
  plan_id: string;
  status: 'active' | 'expired' | 'canceled';
  seats: number;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  payment_method?: any;
  plan_name?: string;
};

// Define the payment type
export type Payment = {
  id: string;
  license_id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  payment_method: any;
};

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
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw new Error(error.message);
      
      const plans = data as SubscriptionPlan[];
      set({ plans, isLoadingPlans: false });
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ error: (error as Error).message, isLoadingPlans: false });
      return [];
    }
  },
  
  // Fetch licenses for a company
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    try {
      // Instead of using rpc, we'll use regular table select
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) throw new Error(error.message);
      
      const licenses = data as License[];
      set({ licenses, isLoadingLicenses: false });
      return licenses;
    } catch (error) {
      console.error('Error fetching licenses:', error);
      set({ error: (error as Error).message, isLoadingLicenses: false });
      return [];
    }
  },
  
  // Fetch a single license by ID
  fetchLicenseById: async (licenseId: string) => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('id', licenseId)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data as License;
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
      // Instead of using rpc, we'll use regular table select
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('license_id', licenseId);
        
      if (error) throw new Error(error.message);
      
      const payments = data as Payment[];
      set({ payments, isLoadingPayments: false });
      return payments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ error: (error as Error).message, isLoadingPayments: false });
      return [];
    }
  },
  
  // Create a new license
  createLicense: async (licenseData: Partial<License>) => {
    try {
      // Instead of using rpc, we'll use regular table insert
      const { data, error } = await supabase
        .from('licenses')
        .insert([licenseData])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      const newLicense = data as License;
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
      const { data, error } = await supabase
        .from('licenses')
        .update(updateData)
        .eq('id', licenseId)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      const updatedLicense = data as License;
      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? updatedLicense : license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          updatedLicense : state.selectedLicense
      }));
      
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
      // Instead of using rpc, we'll use regular table update
      const { error } = await supabase
        .from('licenses')
        .update({ status: 'canceled' })
        .eq('id', licenseId);
        
      if (error) throw new Error(error.message);
      
      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? { ...license, status: 'canceled' } : license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          { ...state.selectedLicense, status: 'canceled' } : state.selectedLicense
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
}));
