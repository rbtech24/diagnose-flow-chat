
/**
 * This file contains TypeScript definitions for the database schema
 * to help with type checking when interacting with Supabase.
 */

export interface DbCompany {
  id: string;
  name: string;
  contact_name?: string; 
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  plan_id?: string;
  plan_name?: string;
  subscription_tier?: string;
  status?: string;
  trial_status?: string;
  technician_count?: number;
  created_at: string;
  updated_at: string;
  trial_end_date?: string;
  subscription_ends_at?: string;
}

export interface DbUser {
  id: string;
  name?: string;
  email: string;
  role: string;
  status: string;
  company_id?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
  subscription_status?: string;
}

export interface DbTechnicianInvite {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company_id: string;
  created_by?: string;
  status: string;
  token: string;
  expires_at: string;
  created_at: string;
}
