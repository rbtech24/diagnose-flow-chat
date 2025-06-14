import { create } from "zustand";
import { SubscriptionPlan, License, Payment } from "@/types/subscription-consolidated";
import { SubscriptionService } from "@/services/subscriptionService";
import { supabase } from "@/integrations/supabase/client";
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
  addPlan: (plan: SubscriptionPlan) => Promise<void>;
  updatePlan: (plan: SubscriptionPlan) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  togglePlanStatus: (planId: string) => Promise<void>;
  cleanupDuplicatePlans: () => Promise<void>;
  addLicense: (license: License) => void;
  deactivateLicense: (licenseId: string) => Promise<boolean>;
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
      console.log('Store: Fetching plans...');
      const plans = await SubscriptionService.getPlans();
      console.log('Store: Received plans:', plans);
      set({ plans, isLoadingPlans: false });
      return plans;
    } catch (error) {
      console.error('Store: Error fetching plans:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription plans';
      set({ error: errorMessage, isLoadingPlans: false });
      toast.error(errorMessage);
      return [];
    }
  },
  
  cleanupDuplicatePlans: async () => {
    try {
      console.log('Store: Starting duplicate cleanup...');
      await SubscriptionService.cleanupDuplicatePlans();
      toast.success('Duplicate plans cleaned up successfully');
      // Refresh the plans after cleanup
      await get().fetchPlans();
    } catch (error) {
      console.error('Store: Error cleaning up duplicate plans:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup duplicate plans';
      toast.error(errorMessage);
    }
  },
  
  fetchLicenses: async (companyId: string) => {
    set({ isLoadingLicenses: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          subscription_plans!inner(name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const licenses: License[] = data.map(license => ({
        id: license.id,
        company_id: license.company_id,
        company_name: license.company_name,
        plan_id: license.plan_id,
        plan_name: license.plan_name,
        status: license.status as License['status'],
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        nextPayment: license.next_payment ? new Date(license.next_payment) : undefined,
        activeTechnicians: license.active_technicians,
        maxTechnicians: license.max_technicians,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      }));

      set({ licenses, isLoadingLicenses: false });
      return licenses;
    } catch (error) {
      console.error('Error fetching licenses:', error);
      set({ error: (error as Error).message, isLoadingLicenses: false });
      toast.error('Failed to fetch licenses');
      return [];
    }
  },
  
  fetchLicenseById: async (licenseId: string) => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('id', licenseId)
        .single();

      if (error) throw error;

      const license: License = {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        status: data.status as License['status'],
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        activeTechnicians: data.active_technicians,
        maxTechnicians: data.max_technicians,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      return license;
    } catch (error) {
      console.error('Error fetching license:', error);
      return null;
    }
  },
  
  fetchPayments: async (licenseId: string) => {
    set({ isLoadingPayments: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('license_id', licenseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const payments: Payment[] = data.map(payment => ({
        id: payment.id,
        license_id: payment.license_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status as Payment['status'],
        payment_date: new Date(payment.payment_date),
        payment_method: payment.payment_method || ''
      }));

      set({ payments, isLoadingPayments: false });
      return payments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      set({ error: (error as Error).message, isLoadingPayments: false });
      toast.error('Failed to fetch payments');
      return [];
    }
  },
  
  createLicense: async (licenseData: Partial<License>) => {
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      const { data, error } = await supabase
        .from('licenses')
        .insert({
          company_id: licenseData.company_id,
          company_name: licenseData.company_name,
          plan_id: licenseData.plan_id,
          plan_name: licenseData.plan_name || '',
          status: 'trial',
          active_technicians: licenseData.activeTechnicians || 0,
          max_technicians: licenseData.maxTechnicians || 1,
          trial_ends_at: trialEndDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newLicense: License = {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        status: data.status as License['status'],
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        activeTechnicians: data.active_technicians,
        maxTechnicians: data.max_technicians,
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
          company_name: updateData.company_name,
          plan_name: updateData.plan_name,
          status: updateData.status,
          active_technicians: updateData.activeTechnicians,
          max_technicians: updateData.maxTechnicians,
          end_date: updateData.endDate?.toISOString(),
          trial_ends_at: updateData.trialEndsAt?.toISOString(),
          next_payment: updateData.nextPayment?.toISOString()
        })
        .eq('id', licenseId)
        .select()
        .single();

      if (error) throw error;

      const updatedLicense: License = {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        status: data.status as License['status'],
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        activeTechnicians: data.active_technicians,
        maxTechnicians: data.max_technicians,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? updatedLicense : license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          updatedLicense : state.selectedLicense
      }));
      
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
      const { data, error } = await supabase
        .from('licenses')
        .update({ status: 'canceled' })
        .eq('id', licenseId)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        licenses: state.licenses.map(license => 
          license.id === licenseId ? 
          { ...license, status: 'canceled' as const, updatedAt: new Date() } : 
          license
        ),
        selectedLicense: state.selectedLicense?.id === licenseId ? 
          { ...state.selectedLicense, status: 'canceled' as const, updatedAt: new Date() } : 
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
    set({ error: null });
    try {
      console.log('Store: Creating new plan:', newPlan);
      const createdPlan = await SubscriptionService.createPlan(newPlan);
      console.log('Store: Plan created, updating state');
      
      set(state => ({
        plans: [...state.plans, createdPlan]
      }));
      
      toast.success('Plan created successfully');
    } catch (error) {
      console.error('Store: Error adding plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create plan';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  updatePlan: async (updatedPlan: SubscriptionPlan) => {
    set({ error: null });
    try {
      console.log('Store: Updating plan:', updatedPlan.id);
      const updated = await SubscriptionService.updatePlan(updatedPlan.id, updatedPlan);
      console.log('Store: Plan updated, updating state');
      
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === updatedPlan.id ? updated : plan
        )
      }));
      
      toast.success('Plan updated successfully');
    } catch (error) {
      console.error('Store: Error updating plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update plan';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  deletePlan: async (planId: string) => {
    set({ error: null });
    try {
      console.log('Store: Attempting to delete plan:', planId);
      
      await SubscriptionService.deletePlan(planId);
      
      set(state => ({
        plans: state.plans.filter(plan => plan.id !== planId)
      }));
      
      console.log('Store: Plan deleted successfully');
      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Store: Error deleting plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete plan';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  togglePlanStatus: async (planId: string) => {
    set({ error: null });
    try {
      const plan = get().plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      console.log('Store: Toggling plan status for:', planId, 'current status:', plan.is_active);
      
      const updated = await SubscriptionService.togglePlanStatus(planId, plan.is_active);
      
      set(state => ({
        plans: state.plans.map(p => 
          p.id === planId ? updated : p
        )
      }));
      
      toast.success(`Plan ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Store: Error toggling plan status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update plan status';
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
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
