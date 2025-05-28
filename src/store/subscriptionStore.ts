
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;

      const plans = data?.map(plan => ({
        ...plan,
        features: plan.features || {},
        limits: plan.limits || {
          technicians: 0,
          admins: 0,
          workflows: 0,
          storage_gb: 0,
          api_calls: 0,
          diagnostics_per_day: 0
        }
      })) || [];

      set({ plans, isLoadingPlans: false });
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      set({ error: (error as Error).message, isLoadingPlans: false });
      toast.error('Failed to fetch subscription plans');
      return get().plans;
    }
  },
  
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          companies!inner(name),
          subscription_plans!inner(name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const licenses = data?.map(license => ({
        id: license.id,
        company_id: license.company_id,
        company_name: license.companies?.name,
        plan_id: license.plan_id,
        plan_name: license.subscription_plans?.name,
        status: license.status as 'trial' | 'active' | 'expired' | 'canceled',
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        nextPayment: license.next_payment_date ? new Date(license.next_payment_date) : undefined,
        activeTechnicians: license.active_technicians || 0,
        maxTechnicians: license.max_technicians || 0,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      })) || [];

      set({ licenses, isLoadingLicenses: false });
      return licenses;
    } catch (error) {
      console.error('Error fetching licenses:', error);
      set({ error: (error as Error).message, isLoadingLicenses: false });
      toast.error('Failed to fetch licenses');
      return get().licenses;
    }
  },
  
  fetchLicenseById: async (licenseId: string) => {
    try {
      const license = get().licenses.find(license => license.id === licenseId);
      if (license) return license;

      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          companies!inner(name),
          subscription_plans!inner(name)
        `)
        .eq('id', licenseId)
        .single();

      if (error) throw error;

      if (data) {
        const license: License = {
          id: data.id,
          company_id: data.company_id,
          company_name: data.companies?.name,
          plan_id: data.plan_id,
          plan_name: data.subscription_plans?.name,
          status: data.status as 'trial' | 'active' | 'expired' | 'canceled',
          startDate: new Date(data.start_date),
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
          nextPayment: data.next_payment_date ? new Date(data.next_payment_date) : undefined,
          activeTechnicians: data.active_technicians || 0,
          maxTechnicians: data.max_technicians || 0,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        return license;
      }
      return null;
    } catch (error) {
      console.error('Error fetching license:', error);
      set({ error: (error as Error).message });
      return null;
    }
  },
  
  fetchPayments: async (licenseId: string) => {
    set({ isLoadingPayments: true, error: null });
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('license_id', licenseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const payments = data?.map(payment => ({
        id: payment.id,
        license_id: payment.license_id || licenseId,
        amount: payment.amount,
        currency: payment.currency || 'USD',
        status: payment.status as 'pending' | 'completed' | 'failed',
        payment_date: new Date(payment.created_at),
        payment_method: payment.payment_method?.type || 'unknown'
      })) || [];

      set({ payments, isLoadingPayments: false });
      return payments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ error: (error as Error).message, isLoadingPayments: false });
      toast.error('Failed to fetch payments');
      return get().payments;
    }
  },
  
  createLicense: async (licenseData: Partial<License>) => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert({
          company_id: licenseData.company_id,
          plan_id: licenseData.plan_id,
          status: licenseData.status || 'trial',
          start_date: licenseData.startDate?.toISOString(),
          trial_ends_at: licenseData.trialEndsAt?.toISOString(),
          active_technicians: licenseData.activeTechnicians || 0,
          max_technicians: licenseData.maxTechnicians || 0
        })
        .select()
        .single();

      if (error) throw error;

      const newLicense: License = {
        id: data.id,
        company_id: data.company_id,
        company_name: licenseData.company_name,
        plan_id: data.plan_id,
        plan_name: licenseData.plan_name || '',
        status: data.status as 'trial' | 'active' | 'expired' | 'canceled',
        startDate: new Date(data.start_date),
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        activeTechnicians: data.active_technicians || 0,
        maxTechnicians: data.max_technicians || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
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
      const { data, error } = await supabase
        .from('licenses')
        .update({
          status: updateData.status,
          active_technicians: updateData.activeTechnicians,
          max_technicians: updateData.maxTechnicians,
          end_date: updateData.endDate?.toISOString(),
          next_payment_date: updateData.nextPayment?.toISOString()
        })
        .eq('id', licenseId)
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from('licenses')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('id', licenseId);

      if (error) throw error;

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
