
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, License, Payment, BillingCycle } from '@/types/subscription';
import { toast } from 'sonner';
import { mockSubscriptionPlans, mockLicenses, mockPayments } from '@/data/mockSubscriptions';

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
      // We'll use mock data for now to avoid database integration issues
      setPlans(mockSubscriptionPlans);
    } catch (err) {
      console.error('Error processing subscription plans:', err);
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
      // Using mock data for now
      let filteredLicenses = [...mockLicenses];
      
      if (companyId) {
        filteredLicenses = filteredLicenses.filter(license => license.companyId === companyId);
      }
      
      setLicenses(filteredLicenses);
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
      // Using mock data for now
      let filteredPayments = [...mockPayments];
      
      if (licenseId) {
        filteredPayments = filteredPayments.filter(payment => payment.licenseId === licenseId);
      }
      
      setPayments(filteredPayments);
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
