
export type Company = {
  id: string;
  name: string;
  subscription_tier: string;
  trial_status?: 'trial' | 'active' | 'expired' | 'inactive';
  trial_end_date?: Date;
  trial_period?: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'trial' | 'expired' | 'inactive';
  plan_name?: string;
}
