
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';
import { Company } from '@/types/company';

interface UserManagementState {
  users: User[];
  companies: Company[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  isLoadingCompanies: boolean;
  fetchUsers: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchCompanyById: (id: string) => Promise<Company | null>;
  getCurrentUser: () => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<User>;
  createCompany: (companyData: Partial<Company>) => Promise<Company>;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  companies: [],
  currentUser: null,
  isLoadingUsers: false,
  isLoadingCompanies: false,

  fetchUsers: async () => {
    try {
      set({ isLoadingUsers: true });
      
      // Fetch users from the users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'tech',
        companyId: user.company_id || undefined,
        status: user.status || 'active'
      }));
      
      set({ users: formattedUsers, isLoadingUsers: false });
    } catch (err) {
      console.error('Error fetching users:', err);
      set({ isLoadingUsers: false });
    }
  },

  fetchCompanies: async () => {
    try {
      set({ isLoadingCompanies: true });
      
      // Fetch companies from the companies table
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      const formattedCompanies: Company[] = data.map(company => ({
        id: company.id,
        name: company.name || '',
        status: company.trial_status || 'active',
        planName: company.subscription_tier || 'basic',
        trialEndDate: company.trial_end_date ? new Date(company.trial_end_date) : undefined,
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at)
      }));
      
      set({ companies: formattedCompanies, isLoadingCompanies: false });
    } catch (err) {
      console.error('Error fetching companies:', err);
      set({ isLoadingCompanies: false });
    }
  },

  fetchUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'tech',
        companyId: data.company_id || undefined,
        status: data.status || 'active'
      };
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  },

  fetchCompanyById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        name: data.name || '',
        status: data.trial_status || 'active',
        planName: data.subscription_tier || 'basic',
        trialEndDate: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (err) {
      console.error('Error fetching company:', err);
      return null;
    }
  },

  getCurrentUser: async () => {
    const currentUser = get().currentUser;
    
    if (currentUser) {
      return currentUser;
    }
    
    try {
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();
      
      if (error || !data) {
        return null;
      }
      
      const user: User = {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'tech',
        companyId: data.company_id || undefined,
        status: data.status || 'active'
      };
      
      set({ currentUser: user });
      return user;
    } catch (err) {
      console.error('Error getting current user:', err);
      return null;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      // Convert User type to database schema
      const dbUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_id: userData.companyId,
        status: userData.status,
      };
      
      const { error } = await supabase
        .from('users')
        .update(dbUser)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        ),
        currentUser: state.currentUser?.id === id 
          ? { ...state.currentUser, ...userData }
          : state.currentUser
      }));
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  },

  updateCompany: async (id: string, companyData: Partial<Company>) => {
    try {
      // Convert Company type to database schema
      const dbCompany = {
        name: companyData.name,
        trial_status: companyData.status,
        subscription_tier: companyData.planName,
        trial_end_date: companyData.trialEndDate
      };
      
      const { error } = await supabase
        .from('companies')
        .update(dbCompany)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      set(state => ({
        companies: state.companies.map(company => 
          company.id === id ? { ...company, ...companyData } : company
        )
      }));
    } catch (err) {
      console.error('Error updating company:', err);
      throw err;
    }
  },

  createUser: async (userData: Partial<User>) => {
    try {
      if (!userData.email || !userData.role) {
        throw new Error('Email and role are required');
      }
      
      // Convert User type to database schema
      const dbUser = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_id: userData.companyId,
        status: userData.status || 'active',
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert(dbUser)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newUser: User = {
        id: data.id,
        name: data.name || '',
        email: data.email,
        role: data.role,
        companyId: data.company_id,
        status: data.status
      };
      
      // Update local state
      set(state => ({
        users: [...state.users, newUser]
      }));
      
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  createCompany: async (companyData: Partial<Company>) => {
    try {
      if (!companyData.name) {
        throw new Error('Company name is required');
      }
      
      // Convert Company type to database schema
      const dbCompany = {
        name: companyData.name,
        trial_status: companyData.status || 'active',
        subscription_tier: companyData.planName || 'basic',
        trial_end_date: companyData.trialEndDate,
        trial_period: 30
      };
      
      const { data, error } = await supabase
        .from('companies')
        .insert(dbCompany)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newCompany: Company = {
        id: data.id,
        name: data.name,
        status: data.trial_status || 'active',
        planName: data.subscription_tier || 'basic',
        trialEndDate: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      // Update local state
      set(state => ({
        companies: [...state.companies, newCompany]
      }));
      
      return newCompany;
    } catch (err) {
      console.error('Error creating company:', err);
      throw err;
    }
  }
}));
