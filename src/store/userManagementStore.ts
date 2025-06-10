import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { Company } from '@/types/company';
import { Technician } from '@/types/technician';

// Define interfaces for the raw data returned from Supabase
interface RawTechnician {
  id: string;
  email: string;
  role: string;
  company_id: string;
  status: string;
  phone?: string;
  avatar_url?: string;
  name?: string;
  available_for_hire?: boolean;
  is_independent?: boolean;
  hourly_rate?: number;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface RawCompany {
  id: string;
  name: string;
  subscription_tier: string;
  trial_status?: string;
  trial_period?: number;
  trial_end_date?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  plan_name?: string;
}

interface UserManagementState {
  users: User[];
  companies: Company[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  isLoadingCompanies: boolean;
  isLoadingCurrentUser: boolean;
  setCurrentUser: (user: User | null) => void;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  addUser: (userData: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string, email?: string, role?: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<Company | null>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<boolean>;
  addCompany: (companyData: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  companies: [],
  currentUser: null,
  isLoadingUsers: false,
  isLoadingCompanies: false,
  isLoadingCurrentUser: false,

  setCurrentUser: (user: User | null) => {
    set({ currentUser: user });
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      // Fetch users from the API
      const { data, error } = await supabase.from('technicians').select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      
      // Transform data to match User type
      const users: User[] = transformTechniciansData(data as RawTechnician[]);
      
      set({ users, isLoadingUsers: false });
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      set({ isLoadingUsers: false });
    }
  },

  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      // Fetch companies from the API
      const { data, error } = await supabase.from('companies').select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        return;
      }
      
      // Transform data to match Company type
      const companies: Company[] = transformCompaniesData(data as RawCompany[]);
      
      set({ companies, isLoadingCompanies: false });
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
      set({ isLoadingCompanies: false });
    }
  },

  fetchUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      const tech = data as RawTechnician;

      // Transform to match User type
      const user: User = {
        id: tech.id,
        name: tech.name || (tech.email ? tech.email.split('@')[0] : '') || '',
        email: tech.email,
        role: (tech.role as 'admin' | 'company' | 'tech') || 'tech',
        companyId: tech.company_id,
        status: tech.status || 'active',
        avatarUrl: tech.avatar_url,
        activeJobs: 0, // Initialize with 0
      };

      return user;
    } catch (error) {
      console.error('Error in fetchUserById:', error);
      return null;
    }
  },

  fetchCompanyById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }

      const rawCompany = data as RawCompany;
      
      // Transform to match Company type
      const company: Company = {
        id: rawCompany.id,
        name: rawCompany.name,
        subscription_tier: rawCompany.subscription_tier || 'basic',
        trial_status: (rawCompany.trial_status as 'trial' | 'active' | 'expired' | 'inactive') || 'inactive',
        trial_period: rawCompany.trial_period,
        trial_end_date: rawCompany.trial_end_date ? new Date(rawCompany.trial_end_date) : undefined,
        createdAt: new Date(rawCompany.created_at),
        updatedAt: new Date(rawCompany.updated_at),
        status: (rawCompany.status as 'active' | 'trial' | 'expired' | 'inactive') || 
               (rawCompany.trial_status as 'active' | 'trial' | 'expired' | 'inactive') || 'inactive',
        plan_name: rawCompany.plan_name || rawCompany.subscription_tier,
      };

      return company;
    } catch (error) {
      console.error('Error in fetchCompanyById:', error);
      return null;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      // Transform User type to match database schema
      const dbData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_id: userData.companyId,
        status: userData.status,
        avatar_url: userData.avatarUrl,
      };

      const { error } = await supabase
        .from('technicians')
        .update(dbData)
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      // Update local state
      const users = get().users;
      const updatedUsers = users.map(user => 
        user.id === id ? { ...user, ...userData } : user
      );
      set({ users: updatedUsers });

      return true;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return false;
    }
  },

  updateCompany: async (id: string, companyData: Partial<Company>) => {
    try {
      // Transform Company type to match database schema
      const dbData = {
        name: companyData.name,
        status: companyData.status,
        plan_name: companyData.plan_name,
        trial_end_date: companyData.trial_end_date instanceof Date 
          ? companyData.trial_end_date.toISOString() 
          : companyData.trial_end_date,
      };

      const { error } = await supabase
        .from('companies')
        .update(dbData)
        .eq('id', id);

      if (error) {
        console.error('Error updating company:', error);
        return false;
      }

      // Update local state
      const companies = get().companies;
      const updatedCompanies = companies.map(company => 
        company.id === id ? { ...company, ...companyData } : company
      );
      set({ companies: updatedCompanies });

      return true;
    } catch (error) {
      console.error('Error in updateCompany:', error);
      return false;
    }
  },

  addUser: async (userData: Partial<User>) => {
    try {
      // Check for required fields
      if (!userData.email || !userData.name || !userData.role) {
        console.error('Missing required fields for user creation');
        return null;
      }

      // Transform User type to match database schema
      const newUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_id: userData.companyId,
        status: userData.status || 'active',
      };

      // Generate UUID for new user
      const uuid = crypto.randomUUID();

      const { data, error } = await supabase
        .from('technicians')
        .insert([{ ...newUser, id: uuid }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      const rawTech = data as RawTechnician;
      
      // Transform response to User type
      const createdUser: User = {
        id: rawTech.id,
        name: rawTech.name || '',
        email: rawTech.email || '',
        role: (rawTech.role as 'admin' | 'company' | 'tech') || 'tech',
        companyId: rawTech.company_id || '',
        status: rawTech.status || 'inactive',
        avatarUrl: rawTech.avatar_url || '',
        activeJobs: 0 // Default value
      };

      // Update local state
      const users = get().users;
      set({ users: [...users, createdUser] });

      return createdUser;
    } catch (error) {
      console.error('Error in addUser:', error);
      return null;
    }
  },

  addCompany: async (companyData: Partial<Company>) => {
    try {
      // Check for required fields
      if (!companyData.name) {
        console.error('Missing required fields for company creation');
        return null;
      }

      // Transform Company type to match database schema
      const newCompany = {
        name: companyData.name,
        status: companyData.status || 'active',
        trial_status: companyData.status || 'active',
        subscription_tier: companyData.subscription_tier || 'basic',
        plan_name: companyData.plan_name || companyData.subscription_tier || 'basic',
        trial_end_date: companyData.trial_end_date instanceof Date
          ? companyData.trial_end_date.toISOString()
          : companyData.trial_end_date,
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([newCompany])
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        return null;
      }

      const rawCompany = data as RawCompany;
      
      // Transform response to Company type
      const createdCompany: Company = {
        id: rawCompany.id,
        name: rawCompany.name || '',
        status: (rawCompany.status as 'active' | 'trial' | 'expired' | 'inactive') || 
                (rawCompany.trial_status as 'active' | 'trial' | 'expired' | 'inactive') || 'inactive',
        plan_name: rawCompany.plan_name || rawCompany.subscription_tier || '',
        subscription_tier: rawCompany.subscription_tier || 'basic',
        trial_end_date: rawCompany.trial_end_date ? new Date(rawCompany.trial_end_date) : undefined,
        trial_status: rawCompany.trial_status as 'trial' | 'active' | 'expired' | 'inactive',
        createdAt: rawCompany.created_at ? new Date(rawCompany.created_at) : new Date(),
        updatedAt: rawCompany.updated_at ? new Date(rawCompany.updated_at) : new Date(),
      };

      // Update local state
      const companies = get().companies;
      set({ companies: [...companies, createdCompany] });

      return createdCompany;
    } catch (error) {
      console.error('Error in addCompany:', error);
      return null;
    }
  },

  deleteUser: async (id: string, email?: string, role?: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      // Update local state
      const users = get().users.filter(user => user.id !== id);
      set({ users });

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  },

  resetUserPassword: async (userId: string) => {
    try {
      // This function should send a reset password email to the user's email
      // Since we're using Supabase, we need to get the user's email first
      const user = await get().fetchUserById(userId);
      
      if (!user || !user.email) {
        console.error('User email not found');
        return false;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) {
        console.error('Error resetting password:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in resetUserPassword:', error);
      return false;
    }
  },

  deleteCompany: async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        return false;
      }

      // Update local state
      const companies = get().companies.filter(company => company.id !== id);
      set({ companies });

      return true;
    } catch (error) {
      console.error('Error in deleteCompany:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error logging out:', error);
        return;
      }

      // Clear current user
      set({ currentUser: null });
    } catch (error) {
      console.error('Error in logout:', error);
    }
  }
}));

// Helper functions for data transformation

const transformTechniciansData = (technicians: RawTechnician[]): User[] => {
  return technicians.map(tech => ({
    id: tech.id,
    name: tech.name || (tech.email ? tech.email.split('@')[0] : '') || '',
    email: tech.email,
    role: tech.role as 'admin' | 'company' | 'tech',
    status: tech.status || 'active',
    companyId: tech.company_id,
    avatarUrl: tech.avatar_url || '',
    activeJobs: 0,
  }));
};

const transformCompaniesData = (companies: RawCompany[]): Company[] => {
  return companies.map(company => ({
    id: company.id,
    name: company.name,
    subscription_tier: company.subscription_tier || 'basic',
    trial_status: company.trial_status as 'trial' | 'active' | 'expired' | 'inactive' || 'inactive',
    trial_period: company.trial_period,
    trial_end_date: company.trial_end_date ? new Date(company.trial_end_date) : undefined,
    createdAt: new Date(company.created_at),
    updatedAt: new Date(company.updated_at),
    status: company.status as 'active' | 'trial' | 'expired' | 'inactive' || 
            company.trial_status as 'active' | 'trial' | 'expired' | 'inactive' || 'inactive',
    plan_name: company.plan_name || company.subscription_tier,
  }));
};
