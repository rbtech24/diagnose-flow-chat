
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Company } from '@/types/company';

interface UserManagementState {
  users: User[];
  companies: Company[];
  fetchUsers: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchCompanyById: (id: string) => Promise<Company | null>;
  addUser: (userData: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string, email?: string, role?: string) => Promise<boolean>;
  addCompany: (companyData: Omit<Company, 'id'>) => Promise<Company>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  resetUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  companies: [],

  fetchCompanies: async () => {
    try {
      const { data, error } = await supabase.from('companies').select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        return;
      }
      
      const companies = data.map(company => ({
        ...company,
        status: company.trial_status === 'active' ? 'active' : 'inactive'
      })) as Company[];
      
      set({ companies });
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  },

  fetchUsers: async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      
      set({ users: data as User[] });
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  },

  fetchUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      return data as User;
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
      
      return {
        ...data,
        status: data.trial_status === 'active' ? 'active' : 'inactive'
      } as Company;
    } catch (error) {
      console.error('Error in fetchCompanyById:', error);
      return null;
    }
  },

  addCompany: async (companyData: Omit<Company, 'id'>) => {
    try {
      // Prepare the data for Supabase
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: companyData.name,
          subscription_tier: companyData.subscription_tier || 'basic',
          trial_status: companyData.status === 'trial' ? 'active' : null,
          trial_period: companyData.trial_period || 30
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding company:', error);
        throw error;
      }
      
      const newCompany = {
        ...data,
        status: data.trial_status === 'active' ? 'active' : 'inactive'
      } as Company;
      
      set((state) => ({
        companies: [...state.companies, newCompany]
      }));
      
      return newCompany;
    } catch (error) {
      console.error('Error in addCompany:', error);
      throw error;
    }
  },

  updateCompany: async (id: string, companyData: Partial<Company>) => {
    try {
      // Prepare the data for Supabase
      const supabaseData: any = {};
      
      if (companyData.name) supabaseData.name = companyData.name;
      if (companyData.subscription_tier) supabaseData.subscription_tier = companyData.subscription_tier;
      if (companyData.status) {
        supabaseData.trial_status = companyData.status === 'active' || companyData.status === 'trial' ? 'active' : 'inactive';
      }
      if (companyData.trial_period) supabaseData.trial_period = companyData.trial_period;
      
      const { data, error } = await supabase
        .from('companies')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating company:', error);
        return null;
      }
      
      const updatedCompany = {
        ...data,
        status: data.trial_status === 'active' ? 'active' : 'inactive'
      } as Company;
      
      set((state) => ({
        companies: state.companies.map(company => 
          company.id === id ? updatedCompany : company
        )
      }));
      
      return updatedCompany;
    } catch (error) {
      console.error('Error in updateCompany:', error);
      return null;
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
      
      set((state) => ({
        companies: state.companies.filter(company => company.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Error in deleteCompany:', error);
      return false;
    }
  },

  addUser: async (userData: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          status: userData.status,
          company_id: userData.companyId,
          subscription_status: userData.subscriptionStatus,
          trial_ends_at: userData.trialEndsAt
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding user:', error);
        throw error;
      }
      
      const newUser = {
        ...data,
        id: data.id,
        companyId: data.company_id,
        trialEndsAt: data.trial_ends_at,
        subscriptionStatus: data.subscription_status
      } as User;
      
      set((state) => ({
        users: [...state.users, newUser]
      }));
      
      return newUser;
    } catch (error) {
      console.error('Error in addUser:', error);
      throw error;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      // Prepare the data for Supabase
      const supabaseData: any = {};
      
      if (userData.name !== undefined) supabaseData.name = userData.name;
      if (userData.email !== undefined) supabaseData.email = userData.email;
      if (userData.phone !== undefined) supabaseData.phone = userData.phone;
      if (userData.role !== undefined) supabaseData.role = userData.role;
      if (userData.status !== undefined) supabaseData.status = userData.status;
      if (userData.companyId !== undefined) supabaseData.company_id = userData.companyId;
      if (userData.subscriptionStatus !== undefined) supabaseData.subscription_status = userData.subscriptionStatus;
      if (userData.trialEndsAt !== undefined) supabaseData.trial_ends_at = userData.trialEndsAt;
      if (userData.avatarUrl !== undefined) supabaseData.avatar_url = userData.avatarUrl;
      
      const { data, error } = await supabase
        .from('users')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return null;
      }
      
      const updatedUser = {
        ...data,
        companyId: data.company_id,
        trialEndsAt: data.trial_ends_at,
        subscriptionStatus: data.subscription_status
      } as User;
      
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        )
      }));
      
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  },

  deleteUser: async (id: string, email?: string, role?: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }
      
      set((state) => ({
        users: state.users.filter(user => user.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  },
  
  resetUserPassword: async (userId: string, newPassword: string) => {
    try {
      // In a real app, you would implement this with your auth provider
      console.log(`Password reset for user ${userId} to ${newPassword}`);
      
      // This is just a mock implementation
      return true;
    } catch (error) {
      console.error('Error in resetUserPassword:', error);
      return false;
    }
  }
}));
