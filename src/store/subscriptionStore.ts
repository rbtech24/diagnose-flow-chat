
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubscriptionPlan, License } from '@/types/subscription';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  licenses: License[];
  addPlan: (plan: SubscriptionPlan) => void;
  updatePlan: (updatedPlan: SubscriptionPlan) => void;
  togglePlanStatus: (planId: string) => void;
  addLicense: (license: License) => void;
  updateLicense: (license: License) => void;
  deactivateLicense: (licenseId: string) => void;
  getActivePlans: () => SubscriptionPlan[];
  getDailyDiagnosticLimit: (planId: string, isOnTrial: boolean) => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plans: [],
      licenses: [],
      
      addPlan: (plan: SubscriptionPlan) => 
        set((state) => ({ plans: [...state.plans, plan] })),
      
      updatePlan: (updatedPlan: SubscriptionPlan) => 
        set((state) => ({ 
          plans: state.plans.map(p => p.id === updatedPlan.id ? updatedPlan : p) 
        })),
      
      togglePlanStatus: (planId: string) => 
        set((state) => ({
          plans: state.plans.map(plan => 
            plan.id === planId 
              ? { 
                  ...plan, 
                  is_active: !plan.is_active,
                  isActive: !plan.is_active, 
                  updatedAt: new Date() 
                } 
              : plan
          )
        })),
      
      addLicense: (license: License) =>
        set((state) => ({ licenses: [...state.licenses, license] })),
      
      updateLicense: (license: License) =>
        set((state) => ({
          licenses: state.licenses.map(l => l.id === license.id ? license : l)
        })),
      
      deactivateLicense: (licenseId: string) =>
        set((state) => ({
          licenses: state.licenses.map(license => 
            license.id === licenseId 
              ? { ...license, status: 'canceled' as const, updatedAt: new Date() } 
              : license
          )
        })),
      
      getActivePlans: () => {
        return get().plans.filter(plan => plan.is_active);
      },
      
      getDailyDiagnosticLimit: (planId: string, isOnTrial: boolean) => {
        // Default limits by plan
        const limits = {
          basic: 10,
          professional: 25,
          enterprise: 100,
          trial: 5
        };
        
        if (isOnTrial) return limits.trial;
        
        // Try to find the plan in our store
        const plan = get().plans.find(p => p.id === planId);
        if (plan && (plan.dailyDiagnostics !== undefined || plan.dailyDiagnostics === 0)) {
          return plan.dailyDiagnostics;
        }
        
        // Fallback to default limits
        switch (planId) {
          case "1": return limits.basic;
          case "2": return limits.professional;
          case "3": return limits.enterprise;
          default: return limits.basic;
        }
      }
    }),
    {
      name: 'subscription-storage',
    }
  )
);
