
export interface Company {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'trial' | 'expired' | 'inactive';
  planName?: string;
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
