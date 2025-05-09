
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
  fetchCompanies: () => Promise<Company[]>;
  fetchUsers: () => Promise<User[]>;
  fetchUserById: (userId: string) => Promise<User | null>;
  fetchCompanyById: (companyId: string) => Promise<Company | null>;
  createCompany: (companyData: Omit<Company, 'id'>) => Promise<Company | null>;
  updateCompany: (companyId: string, companyData: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (companyId: string) => Promise<boolean>;
  createUser: (userData: Omit<User, 'id'>) => Promise<User | null>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (userId: string, email?: string, role?: string) => Promise<boolean>;
  setCurrentUser: (user: User | null) => void;
  resetUserPassword: (userId: string, newPassword: string) => Promise<boolean>;
  addCompany: (companyData: Partial<Company>) => Promise<Company>;
  addUser: (userData: Partial<User>) => Promise<User>;
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
      
      // Convert database results to Company type
      const typedCompanies: Company[] = data.map(item => ({
        id: item.id,
        name: item.name,
        status: item.trial_status || 'active',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        // Map other fields as needed
      }));
      
      set({ companies: typedCompanies });
      return typedCompanies;
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      return [];
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
      
      // Convert database results to User type with role casting
      const typedUsers: User[] = data.map(item => ({
        id: item.id,
        name: item.name || '',
        email: item.email,
        role: (item.role as 'admin' | 'company' | 'tech'),
        phone: item.phone,
        avatarUrl: item.avatar_url,
        companyId: item.company_id,
        status: item.status,
        createdAt: item.created_at ? new Date(item.created_at) : undefined,
        trialEndsAt: item.trial_ends_at ? new Date(item.trial_ends_at) : undefined,
        subscriptionStatus: item.subscription_status as any,
        // Map other fields as needed
      }));
      
      set({ users: typedUsers });
      return typedUsers;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    } finally {
      set({ isLoadingUsers: false });
    }
  },
  createCompany: async (companyData) => {
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

      // Convert to Company type
      const newCompany: Company = {
        id: response.id,
        name: response.name,
        status: response.status || 'active',
        // Add other fields as needed
      };

      set(state => ({
        companies: [newCompany, ...state.companies],
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

      return newCompany;
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

      // Convert to Company type
      const updatedCompany: Company = {
        ...response,
        id: response.id,
        name: response.name,
        status: response.status || 'active',
        // Add other fields as needed
      };

      set(state => ({
        companies: state.companies.map(company =>
          company.id === companyId ? { ...company, ...updatedCompany } : company
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

      return updatedCompany;
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
        .insert([{
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          company_id: userData.companyId,
          status: userData.status || 'active'
          // Add other fields as needed
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }

      // Convert to User type
      const newUser: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as 'admin' | 'company' | 'tech',
        phone: response.phone,
        companyId: response.company_id,
        status: response.status,
        // Add other fields as needed
      };

      set(state => ({
        users: [newUser, ...state.users],
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

      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      return null;
    }
  },
  updateUser: async (userId: string, userData: Partial<User>) => {
    try {
      // Convert from our app model to database model
      const dbUserData: any = {
        ...userData,
        company_id: userData.companyId,
        avatar_url: userData.avatarUrl
      };
      
      delete dbUserData.companyId;
      delete dbUserData.avatarUrl;
      
      const { data: response, error } = await supabase
        .from('users')
        .update(dbUserData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      // Convert to User type
      const updatedUser: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as 'admin' | 'company' | 'tech',
        phone: response.phone,
        companyId: response.company_id,
        avatarUrl: response.avatar_url,
        status: response.status,
        // Add other fields as needed
      };

      set(state => ({
        users: state.users.map(user =>
          user.id === userId ? { ...user, ...updatedUser } : user
        ),
      }));

      try {
        await logActivity({
          activity_type: 'user_updated',
          description: `User ${response.email} updated`,
          metadata: { 
            userId: response.id,
            role: response.role,
            companyId: response.company_id 
          }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      return null;
    }
  },
  deleteUser: async (userId: string, email?: string, role?: string) => {
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
          description: `User deleted: ${email || ''}`,
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
  fetchUserById: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        throw error;
      }

      if (!data) return null;

      // Convert to User type
      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as 'admin' | 'company' | 'tech',
        phone: data.phone,
        avatarUrl: data.avatar_url,
        companyId: data.company_id,
        status: data.status,
        // Add other fields as needed
      };

      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  },
  fetchCompanyById: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error("Error fetching company:", error);
        throw error;
      }

      if (!data) return null;

      // Convert to Company type
      const company: Company = {
        id: data.id,
        name: data.name,
        status: data.status || 'active',
        // Add other fields as needed
      };

      return company;
    } catch (error) {
      console.error("Failed to fetch company:", error);
      return null;
    }
  },
  resetUserPassword: async (userId: string, newPassword: string) => {
    try {
      // In a real application, you would encrypt the password
      // For this example, just update the user record
      const { error } = await supabase
        .from('users')
        .update({ password_updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error("Error resetting password:", error);
        throw error;
      }

      try {
        await logActivity({
          activity_type: 'user_password_reset',
          description: `Password reset for user`,
          metadata: { userId }
        });
      } catch (error) {
        console.error('Failed to log activity:', error);
      }

      return true;
    } catch (error) {
      console.error("Failed to reset password:", error);
      return false;
    }
  },
  addCompany: async (companyData: Partial<Company>) => {
    try {
      const { data: response, error } = await supabase
        .from('companies')
        .insert([{
          name: companyData.name,
          // Add other fields as needed
        }])
        .select()
        .single();

      if (error) {
        console.error("Error adding company:", error);
        throw error;
      }

      // Convert to Company type
      const newCompany: Company = {
        id: response.id,
        name: response.name,
        status: response.status || 'active',
        // Add other fields as needed
      };

      set(state => ({
        companies: [newCompany, ...state.companies],
      }));

      return newCompany;
    } catch (error) {
      console.error("Failed to add company:", error);
      throw error;
    }
  },
  addUser: async (userData: Partial<User>) => {
    try {
      const { data: response, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          company_id: userData.companyId,
          status: userData.status || 'active'
          // Add other fields as needed
        }])
        .select()
        .single();

      if (error) {
        console.error("Error adding user:", error);
        throw error;
      }

      // Convert to User type
      const newUser: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role as 'admin' | 'company' | 'tech',
        phone: response.phone,
        companyId: response.company_id,
        status: response.status,
        // Add other fields as needed
      };

      set(state => ({
        users: [newUser, ...state.users],
      }));

      return newUser;
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  },
}));
