
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, License, Payment } from '@/types/subscription';
import { toast } from 'sonner';

export function useSubscriptions() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<{
    plans: boolean;
    licenses: boolean;
    payments: boolean;
  }>({
    plans: true,
    licenses: true,
    payments: true
  });
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(prev => ({ ...prev, plans: true }));
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });
        
      if (fetchError) throw fetchError;
      
      // Format the data to match our SubscriptionPlan type
      const formattedPlans: SubscriptionPlan[] = data?.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description || '',
        monthlyPrice: plan.price_monthly,
        yearlyPrice: plan.price_yearly,
        maxTechnicians: plan.limits?.technicians || 0,
        maxAdmins: plan.limits?.admins || 0,
        dailyDiagnostics: plan.limits?.diagnostics_per_day || 0,
        storageLimit: plan.limits?.storage_gb || 0,
        features: plan.features || [],
        trialPeriod: plan.trial_period,
        isActive: plan.is_active,
        createdAt: new Date(plan.created_at),
        updatedAt: new Date(plan.updated_at)
      })) || [];
      
      setPlans(formattedPlans);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError('Failed to load subscription plans');
      toast.error('Error loading subscription plans');
    } finally {
      setIsLoading(prev => ({ ...prev, plans: false }));
    }
  };

  const fetchCompanyLicenses = async (companyId?: string) => {
    setIsLoading(prev => ({ ...prev, licenses: true }));
    setError(null);
    
    try {
      let query = supabase
        .from('licenses')
        .select(`
          *,
          company:company_id(name),
          plan:plan_id(name)
        `)
        .order('created_at', { ascending: false });
        
      // Filter by company if provided
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error: fetchError } = await query;
        
      if (fetchError) throw fetchError;
      
      // Format the data to match our License type
      const formattedLicenses: License[] = data?.map(license => ({
        id: license.id,
        companyId: license.company_id,
        companyName: license.company?.name || 'Unknown Company',
        planId: license.plan_id,
        planName: license.plan?.name || 'Unknown Plan',
        status: license.status,
        activeTechnicians: license.active_technicians || 0,
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        lastPayment: license.last_payment_date ? new Date(license.last_payment_date) : undefined,
        nextPayment: license.next_payment_date ? new Date(license.next_payment_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      })) || [];
      
      setLicenses(formattedLicenses);
    } catch (err) {
      console.error('Error fetching licenses:', err);
      setError('Failed to load licenses');
      toast.error('Error loading licenses');
    } finally {
      setIsLoading(prev => ({ ...prev, licenses: false }));
    }
  };

  const fetchPayments = async (licenseId?: string) => {
    setIsLoading(prev => ({ ...prev, payments: true }));
    setError(null);
    
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
        
      // Filter by license if provided
      if (licenseId) {
        query = query.eq('license_id', licenseId);
      }
      
      const { data, error: fetchError } = await query;
        
      if (fetchError) throw fetchError;
      
      // Format the data to match our Payment type
      const formattedPayments: Payment[] = data?.map(payment => ({
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
      })) || [];
      
      setPayments(formattedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
      toast.error('Error loading payments');
    } finally {
      setIsLoading(prev => ({ ...prev, payments: false }));
    }
  };

  // Initialize data fetching
  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    licenses,
    payments,
    isLoading,
    error,
    fetchPlans,
    fetchCompanyLicenses,
    fetchPayments
  };
}
