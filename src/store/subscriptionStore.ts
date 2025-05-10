
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
        maxTechnicians: plan.limits?.technicians || 5,
        maxAdmins: plan.limits?.admins || 1,
        dailyDiagnostics: plan.limits?.diagnostics_per_day || 50,
        storageLimit: plan.limits?.storage_gb || 5,
        features: Array.isArray(plan.features) ? plan.features : [],
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
  }
}));
