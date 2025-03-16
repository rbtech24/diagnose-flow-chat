
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
              ? { ...plan, isActive: !plan.isActive, updatedAt: new Date() } 
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
        return get().plans.filter(plan => plan.isActive);
      }
    }),
    {
      name: 'subscription-storage',
    }
  )
);
