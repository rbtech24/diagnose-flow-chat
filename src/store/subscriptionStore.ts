
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, License, Payment } from '@/types/subscription';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  licenses: License[];
  payments: Payment[];
  isLoading: boolean;
  error: Error | null;
  fetchPlans: () => Promise<void>;
  fetchLicenses: () => Promise<void>;
  fetchPayments: (licenseId?: string) => Promise<void>;
  getActivePlans: () => SubscriptionPlan[];
  addPlan: (plan: SubscriptionPlan) => Promise<void>;
  updatePlan: (plan: SubscriptionPlan) => Promise<void>;
  togglePlanStatus: (planId: string) => Promise<void>;
  addLicense: (license: License) => Promise<void>;
  deactivateLicense: (licenseId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: [],
  licenses: [],
  payments: [],
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly');
        
      if (error) throw error;

      // Transform database response to match SubscriptionPlan type
      const plans: SubscriptionPlan[] = data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        price: plan.price_monthly, // For backward compatibility
        monthlyPrice: plan.price_monthly,
        yearlyPrice: plan.price_yearly,
        billingCycle: 'monthly', // For backward compatibility
        maxTechnicians: plan.limits && typeof plan.limits === 'object' ? (plan.limits.technicians as number || 5) : 5,
        maxAdmins: plan.limits && typeof plan.limits === 'object' ? (plan.limits.admins as number || 1) : 1,
        dailyDiagnostics: plan.limits && typeof plan.limits === 'object' ? (plan.limits.diagnostics_per_day as number || 50) : 50,
        storageLimit: plan.limits && typeof plan.limits === 'object' ? (plan.limits.storage_gb as number || 5) : 5,
        features: Array.isArray(plan.features) ? plan.features.map(feature => String(feature)) : [],
        trialPeriod: plan.trial_period,
        isActive: plan.is_active,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      }));

      set({ plans, isLoading: false });
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to fetch subscription plans'), isLoading: false });
    }
  },

  fetchLicenses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('licenses')
        .select('*');
        
      if (error) throw error;

      const licenses: License[] = data.map(license => ({
        id: license.id,
        companyId: license.company_id,
        companyName: license.company_name,
        planId: license.plan_id,
        planName: license.plan_name,
        status: license.status as 'active' | 'trial' | 'expired',
        activeTechnicians: license.active_technicians,
        startDate: license.start_date ? new Date(license.start_date) : undefined,
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        lastPayment: license.last_payment ? new Date(license.last_payment) : undefined,
        nextPayment: license.next_payment ? new Date(license.next_payment) : undefined,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      }));

      set({ licenses, isLoading: false });
    } catch (err) {
      console.error('Error fetching licenses:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to fetch licenses'), isLoading: false });
    }
  },

  fetchPayments: async (licenseId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let query = supabase.from('payments').select('*');
      
      if (licenseId) {
        query = query.eq('license_id', licenseId);
      }
      
      const { data, error } = await query.order('payment_date', { ascending: false });
        
      if (error) throw error;

      const payments: Payment[] = data.map(payment => ({
        id: payment.id,
        licenseId: payment.license_id,
        companyId: payment.company_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        paymentDate: new Date(payment.payment_date),
        invoiceUrl: payment.invoice_url,
        createdAt: new Date(payment.created_at)
      }));

      set({ payments, isLoading: false });
    } catch (err) {
      console.error('Error fetching payments:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to fetch payments'), isLoading: false });
    }
  },

  getActivePlans: () => {
    return get().plans.filter(plan => plan.isActive);
  },

  // Implementation for methods required by admin pages
  addPlan: async (plan: SubscriptionPlan) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('subscription_plans')
        .insert({
          name: plan.name,
          description: plan.description,
          price_monthly: plan.monthlyPrice,
          price_yearly: plan.yearlyPrice,
          features: plan.features,
          limits: {
            technicians: plan.maxTechnicians,
            admins: plan.maxAdmins,
            diagnostics_per_day: plan.dailyDiagnostics,
            storage_gb: plan.storageLimit
          },
          trial_period: plan.trialPeriod,
          is_active: plan.isActive
        });
        
      if (error) throw error;
      
      // Refetch plans
      get().fetchPlans();
    } catch (err) {
      console.error('Error adding subscription plan:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to add subscription plan'), isLoading: false });
    }
  },

  updatePlan: async (plan: SubscriptionPlan) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          name: plan.name,
          description: plan.description,
          price_monthly: plan.monthlyPrice,
          price_yearly: plan.yearlyPrice,
          features: plan.features,
          limits: {
            technicians: plan.maxTechnicians,
            admins: plan.maxAdmins,
            diagnostics_per_day: plan.dailyDiagnostics,
            storage_gb: plan.storageLimit
          },
          trial_period: plan.trialPeriod,
          is_active: plan.isActive
        })
        .eq('id', plan.id);
        
      if (error) throw error;
      
      // Refetch plans
      get().fetchPlans();
    } catch (err) {
      console.error('Error updating subscription plan:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to update subscription plan'), isLoading: false });
    }
  },

  togglePlanStatus: async (planId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find plan in current state
      const plan = get().plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      const { error } = await supabase
        .from('subscription_plans')
        .update({
          is_active: !plan.isActive
        })
        .eq('id', planId);
        
      if (error) throw error;
      
      // Update local state
      set({
        plans: get().plans.map(p => 
          p.id === planId ? { ...p, isActive: !p.isActive } : p
        ),
        isLoading: false
      });
    } catch (err) {
      console.error('Error toggling plan status:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to toggle plan status'), isLoading: false });
    }
  },

  addLicense: async (license: License) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('licenses')
        .insert({
          company_id: license.companyId,
          company_name: license.companyName,
          plan_id: license.planId,
          plan_name: license.planName,
          status: license.status,
          active_technicians: license.activeTechnicians,
          start_date: license.startDate?.toISOString(),
          end_date: license.endDate?.toISOString(),
          trial_ends_at: license.trialEndsAt?.toISOString(),
          last_payment: license.lastPayment?.toISOString(),
          next_payment: license.nextPayment?.toISOString()
        });
        
      if (error) throw error;
      
      // Refetch licenses
      get().fetchLicenses();
    } catch (err) {
      console.error('Error adding license:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to add license'), isLoading: false });
    }
  },

  deactivateLicense: async (licenseId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('licenses')
        .update({
          status: 'canceled',
          end_date: new Date().toISOString()
        })
        .eq('id', licenseId);
        
      if (error) throw error;
      
      // Update local state
      set({
        licenses: get().licenses.map(l => 
          l.id === licenseId ? { ...l, status: 'canceled', endDate: new Date() } : l
        ),
        isLoading: false
      });
    } catch (err) {
      console.error('Error deactivating license:', err);
      set({ error: err instanceof Error ? err : new Error('Failed to deactivate license'), isLoading: false });
    }
  }
}));
