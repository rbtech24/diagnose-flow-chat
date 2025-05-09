
export interface Company {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'trial' | 'expired' | 'inactive';
  planName?: string;
  subscription_tier?: string; // Used in Supabase
  trial_status?: string; // Used in Supabase
  trial_period?: number; // Used in Supabase
  trial_end_date?: string; // Used in Supabase
  created_at?: string; // Used in Supabase
  updated_at?: string; // Used in Supabase
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
