
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, License, Payment, BillingCycle } from '@/types/subscription';
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
      const formattedPlans: SubscriptionPlan[] = data?.map(plan => {
        // Ensure features is always an array of strings
        const features = Array.isArray(plan.features) 
          ? plan.features.map(f => String(f))
          : typeof plan.features === 'string' 
            ? [plan.features] 
            : [];

        // Handle limits safely
        const limits = typeof plan.limits === 'object' && plan.limits 
          ? plan.limits 
          : {};
            
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          monthlyPrice: plan.price_monthly,
          yearlyPrice: plan.price_yearly,
          maxTechnicians: limits.technicians || 0,
          maxAdmins: limits.admins || 0,
          dailyDiagnostics: limits.diagnostics_per_day || 0,
          storageLimit: limits.storage_gb || 0,
          features: features,
          trialPeriod: plan.trial_period,
          isActive: plan.is_active,
          createdAt: new Date(plan.created_at),
          updatedAt: new Date(plan.updated_at)
        };
      }) || [];
      
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
      // For actual implementation, we would need a proper table in Supabase
      // Let's use mock data for now
      const mockLicenses: License[] = [
        {
          id: "lic-1",
          companyId: companyId || "comp-1",
          companyName: "Acme Corp",
          planId: "plan-pro",
          planName: "Professional",
          status: 'active',
          activeTechnicians: 8,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01'),
          lastPayment: new Date('2024-04-01'),
          nextPayment: new Date('2024-05-01'),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-04-01')
        }
      ];
      
      setLicenses(mockLicenses);
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
      // For actual implementation, we would need a proper table in Supabase
      // Let's use mock data for now
      const mockPayments: Payment[] = [
        {
          id: "pay-1",
          licenseId: licenseId || "lic-1",
          companyId: "comp-1",
          amount: 89,
          currency: "USD",
          status: "completed",
          paymentMethod: "credit_card",
          paymentDate: new Date('2024-04-01'),
          invoiceUrl: "https://example.com/invoice/1",
          createdAt: new Date('2024-04-01')
        }
      ];
      
      setPayments(mockPayments);
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
