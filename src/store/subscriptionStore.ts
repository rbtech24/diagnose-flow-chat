
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, License, Payment } from "@/types/subscription";
import { mockSubscriptionPlans, mockLicenses, mockPayments } from "@/data/mockSubscriptions";
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
  plans: mockSubscriptionPlans as SubscriptionPlan[],
  licenses: mockLicenses as License[],
  payments: mockPayments as Payment[],
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
      
      // Transform database records to match our SubscriptionPlan type
      const plans = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        features: Array.isArray(plan.features) ? plan.features : [],
        limits: typeof plan.limits === 'object' ? plan.limits : {
          technicians: 5,
          admins: 1,
          workflows: 10,
          storage_gb: 10,
          api_calls: 1000,
          diagnostics_per_day: 20
        },
        trial_period: plan.trial_period,
        is_active: plan.is_active,
        recommended: plan.recommended,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      })) as SubscriptionPlan[];
      
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
      // Instead of using rpc, we'll use regular table select
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) throw new Error(error.message);
      
      // Transform database records to match our License type
      const licenses = data.map(license => ({
        id: license.id,
        company_id: license.company_id,
        company_name: license.company_name || '',
        plan_id: license.plan_id,
        plan_name: license.plan_name || '',
        status: license.status,
        activeTechnicians: license.active_technicians || 0,
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        lastPayment: license.last_payment ? new Date(license.last_payment) : undefined,
        nextPayment: license.next_payment ? new Date(license.next_payment) : undefined,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      })) as License[];
      
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
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('id', licenseId)
        .single();
        
      if (error) throw new Error(error.message);
      
      // Transform to our License type
      const license = {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name || '',
        plan_id: data.plan_id,
        plan_name: data.plan_name || '',
        status: data.status,
        activeTechnicians: data.active_technicians || 0,
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        lastPayment: data.last_payment ? new Date(data.last_payment) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as License;
      
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
      // Instead of using rpc, we'll use regular table select
      const { data, error } = await supabase
        .from('license_payments')
        .select('*')
        .eq('license_id', licenseId);
        
      if (error) throw new Error(error.message);
      
      // Transform to our Payment type
      const payments = data.map(payment => ({
        id: payment.id,
        license_id: payment.license_id,
        company_id: payment.company_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        paymentDate: new Date(payment.payment_date),
        invoiceUrl: payment.invoice_url,
        createdAt: new Date(payment.created_at)
      })) as Payment[];
      
      set({ payments, isLoadingPayments: false });
      return payments;
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

// Exporting the plan and license types for use elsewhere
export type { SubscriptionPlan, License, Payment };
