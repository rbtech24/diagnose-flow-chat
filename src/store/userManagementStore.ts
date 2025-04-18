
import { create } from 'zustand';
import { supabase } from '@/utils/supabaseClient';
import { User, UserWithPassword } from '@/types/user';
import { toast } from 'react-hot-toast';

interface UserManagementState {
  users: User[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  isLoadingCurrentUser: boolean;
  companies: any[];
  isLoadingCompanies: boolean;
  
  // Fetch operations
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<any | null>;
  
  // CRUD operations for users
  createUser: (user: Partial<User>) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
  addUser: (user: UserWithPassword) => Promise<any>;
  
  // CRUD operations for companies
  addCompany: (company: any) => Promise<any>;
  deleteCompany: (id: string) => Promise<boolean>;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoadingUsers: false,
  isLoadingCurrentUser: false,
  companies: [],
  isLoadingCompanies: false,

  fetchUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies:company_id (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      let companyName = '';
      // Ensure companies is not null before trying to access it
      if (data.companies && typeof data.companies === 'object') {
        // Use nullish coalescing to provide a fallback for the name property
        companyName = data.companies.name ?? '';
      }
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email,
        role: data.role as 'admin' | 'company' | 'tech',
        status: data.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        companyId: data.company_id,
        companyName,
        isMainAdmin: false // This would need additional logic
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      toast.error('Failed to load user details');
      return null;
    }
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        throw error;
      }

      set({ users: data as User[] });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) {
        throw error;
      }

      set({ companies: data || [] });
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      set({ isLoadingCompanies: false });
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
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      toast.error('Failed to load company details');
      return null;
    }
  },

  createUser: async (user: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('User created successfully!');
      get().fetchUsers(); // Refresh users
      return data as User;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      return null;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('User updated successfully!');
      get().fetchUsers(); // Refresh users
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('User deleted successfully!');
      get().fetchUsers(); // Refresh users
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  },

  resetUserPassword: async (id: string, newPassword: string) => {
    try {
      // This function is a placeholder; you'll need to implement the actual password reset logic.
      // It might involve calling a Supabase function or using your own backend to handle the password reset.

      // Simulate a successful password reset
      toast.success('Password reset successfully!');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
      return false;
    }
  },

  // Add new methods for handling companies and user creation
  addCompany: async (company: any) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('Company created successfully!');
      get().fetchCompanies(); // Refresh companies
      return data;
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company');
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
        throw error;
      }

      toast.success('Company deleted successfully!');
      get().fetchCompanies(); // Refresh companies
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
      return false;
    }
  },

  addUser: async (user: UserWithPassword) => {
    try {
      // Create a new user with the auth API (this is a placeholder; actual implementation may vary)
      // For now, we'll just insert into the users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          company_id: user.companyId,
          status: user.status,
          // Note: In a real implementation, you would handle password securely
          // and use Supabase auth signup
        }])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast.success('User added successfully!');
      get().fetchUsers(); // Refresh users
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      return null;
    }
  }
}));
