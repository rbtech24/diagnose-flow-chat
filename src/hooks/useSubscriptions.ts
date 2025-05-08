
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
      // Try to fetch plans from the database
      const { data, error: fetchError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });
        
      if (fetchError) {
        console.warn('Error fetching subscription plans:', fetchError);
        console.log('Using mock subscription plan data');
        
        // Use mock data if the table doesn't exist yet
        const mockPlans: SubscriptionPlan[] = [
          {
            id: "plan-basic",
            name: "Basic",
            description: "Essential diagnostics and support for small operations",
            monthlyPrice: 29,
            yearlyPrice: 299,
            maxTechnicians: 5,
            maxAdmins: 1,
            dailyDiagnostics: 20,
            storageLimit: 10,
            features: [
              "Up to 5 technicians",
              "20 diagnostics per day",
              "10GB storage",
              "Email support",
              "Basic workflows"
            ],
            trialPeriod: 14,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "plan-pro",
            name: "Professional",
            description: "Advanced features for growing businesses",
            monthlyPrice: 89,
            yearlyPrice: 899,
            maxTechnicians: 20,
            maxAdmins: 3,
            dailyDiagnostics: 100,
            storageLimit: 50,
            features: [
              "Up to 20 technicians",
              "Unlimited diagnostics",
              "50GB storage",
              "Priority support",
              "Custom workflows",
              "Advanced analytics"
            ],
            trialPeriod: 14,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "plan-enterprise",
            name: "Enterprise",
            description: "Full-featured solution for large organizations",
            monthlyPrice: 249,
            yearlyPrice: 2499,
            maxTechnicians: 0, // Unlimited
            maxAdmins: 0, // Unlimited
            dailyDiagnostics: 0, // Unlimited
            storageLimit: 100,
            features: [
              "Unlimited technicians",
              "Unlimited diagnostics",
              "100GB storage",
              "24/7 priority support",
              "Custom integrations",
              "Dedicated account manager",
              "On-premises deployment option"
            ],
            trialPeriod: 30,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        setPlans(mockPlans);
        return;
      }
      
      // If we're here, we have data from the database
      // Format it to match our SubscriptionPlan type
      const formattedPlans: SubscriptionPlan[] = data?.map(plan => {
        // Process the features array
        let features: string[] = [];
        try {
          if (Array.isArray(plan.features)) {
            features = plan.features.map(f => String(f));
          } else if (typeof plan.features === 'string') {
            features = [plan.features];
          } else if (typeof plan.features === 'object' && plan.features !== null) {
            // Attempt to parse JSON if it's an object
            const featuresObj = plan.features;
            features = Object.values(featuresObj).map(f => String(f));
          }
        } catch (e) {
          console.error('Error parsing features:', e);
        }

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
          maxTechnicians: typeof limits === 'object' ? (limits.technicians || 0) : 0,
          maxAdmins: typeof limits === 'object' ? (limits.admins || 0) : 0,
          dailyDiagnostics: typeof limits === 'object' ? (limits.diagnostics_per_day || 0) : 0,
          storageLimit: typeof limits === 'object' ? (limits.storage_gb || 0) : 0,
          features: features,
          trialPeriod: plan.trial_period,
          isActive: plan.is_active,
          createdAt: new Date(plan.created_at),
          updatedAt: new Date(plan.updated_at)
        };
      }) || [];
      
      setPlans(formattedPlans);
    } catch (err) {
      console.error('Error processing subscription plans:', err);
      setError('Failed to load subscription plans');
      toast.error('Error loading subscription plans');
      
      // Fallback to mock data
      setPlans([
        {
          id: "plan-basic",
          name: "Basic",
          description: "Essential diagnostics and support for small operations",
          monthlyPrice: 29,
          yearlyPrice: 299,
          maxTechnicians: 5,
          maxAdmins: 1,
          dailyDiagnostics: 20,
          storageLimit: 10,
          features: [
            "Up to 5 technicians",
            "20 diagnostics per day",
            "10GB storage",
            "Email support",
            "Basic workflows"
          ],
          trialPeriod: 14,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "plan-pro",
          name: "Professional",
          description: "Advanced features for growing businesses",
          monthlyPrice: 89,
          yearlyPrice: 899,
          maxTechnicians: 20,
          maxAdmins: 3,
          dailyDiagnostics: 100,
          storageLimit: 50,
          features: [
            "Up to 20 technicians",
            "Unlimited diagnostics",
            "50GB storage",
            "Priority support",
            "Custom workflows",
            "Advanced analytics"
          ],
          trialPeriod: 14,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "plan-enterprise",
          name: "Enterprise",
          description: "Full-featured solution for large organizations",
          monthlyPrice: 249,
          yearlyPrice: 2499,
          maxTechnicians: 0, // Unlimited
          maxAdmins: 0, // Unlimited
          dailyDiagnostics: 0, // Unlimited
          storageLimit: 100,
          features: [
            "Unlimited technicians",
            "Unlimited diagnostics",
            "100GB storage",
            "24/7 priority support",
            "Custom integrations",
            "Dedicated account manager",
            "On-premises deployment option"
          ],
          trialPeriod: 30,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
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
