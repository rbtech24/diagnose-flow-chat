import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Company, User } from '@/types';
import { logActivity } from '@/api/activityLogsApi';

interface UserManagementState {
  companies: Company[];
  users: User[];
  currentUser: User | null;
  isLoadingCompanies: boolean;
  isLoadingUsers: boolean;
  fetchCompanies: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  createCompany: (companyData: Omit<Company, 'id'>) => Promise<Company | null>;
  updateCompany: (companyId: string, companyData: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (companyId: string) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (userId: string, email: string, role: string) => Promise<boolean>;
  setCurrentUser: (user: User | null) => void;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  companies: [],
  users: [],
  currentUser: null,
  isLoadingCompanies: false,
  isLoadingUsers: false,
  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }
      set({ companies: data || [] });
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      set({ isLoadingCompanies: false });
    }
  },
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      set({ users: data || [] });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },
  createCompany: async (companyData: Omit<Company, 'id'>) => {
    try {
      const { data: response, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) {
        console.error("Error creating company:", error);
        throw error;
      }

      set(state => ({
        companies: [response, ...state.companies],
      }));

      try {
        await logActivity({
          activity_type: 'company_created',
          description: `Company ${companyData.name} created`,
          metadata: { companyId: response.id }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return response;
    } catch (error) {
      console.error("Failed to create company:", error);
      return null;
    }
  },
  updateCompany: async (companyId: string, companyData: Partial<Company>) => {
    try {
      const { data: response, error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', companyId)
        .select()
        .single();

      if (error) {
        console.error("Error updating company:", error);
        throw error;
      }

      set(state => ({
        companies: state.companies.map(company =>
          company.id === companyId ? { ...company, ...response } : company
        ),
      }));

      try {
        await logActivity({
          activity_type: 'company_updated',
          description: `Company ${response.name} updated`,
          metadata: { companyId: response.id }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return response;
    } catch (error) {
      console.error("Failed to update company:", error);
      return null;
    }
  },
  deleteCompany: async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) {
        console.error("Error deleting company:", error);
        throw error;
      }

      set(state => ({
        companies: state.companies.filter(company => company.id !== companyId),
      }));

      return true;
    } catch (error) {
      console.error("Failed to delete company:", error);
      return false;
    }
  },
  createUser: async (userData: Omit<User, 'id'>) => {
    try {
      const { data: response, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }

      set(state => ({
        users: [response, ...state.users],
      }));

      try {
        await logActivity({
          activity_type: 'user_created',
          description: `User ${userData.email} created`,
          metadata: { 
            userId: response.id,
            role: userData.role,
            companyId: userData.companyId 
          }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return response;
    } catch (error) {
      console.error("Failed to create user:", error);
      return null;
    }
  },
  updateUser: async (userId: string, userData: Partial<User>) => {
    try {
      const { data: response, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...response } : user
        ),
      }));

      try {
        await logActivity({
          activity_type: 'user_updated',
          description: `User ${response.email} updated`,
          metadata: { 
            userId: response.id,
            role: response.role,
            companyId: response.companyId 
          }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return response;
    } catch (error) {
      console.error("Failed to update user:", error);
      return null;
    }
  },
  deleteUser: async (userId: string, email: string, role: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }

      set(state => ({
        users: state.users.filter(user => user.id !== userId),
      }));

      try {
        await logActivity({
          activity_type: 'user_deleted',
          description: `User deleted: ${email}`,
          metadata: { userId, email, role }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  },
  setCurrentUser: (user: User | null) => {
    set({ currentUser: user });
  },
}));
