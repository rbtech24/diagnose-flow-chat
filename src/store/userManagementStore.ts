
import { create } from 'zustand';
import { supabase } from '@/utils/supabaseClient';
import { User, UserWithPassword } from '@/types/user';
import { toast } from 'react-hot-toast';
import { companyService, CompanyServiceParams } from './companyService';

interface UserManagementState {
  users: User[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  isLoadingCurrentUser: boolean;
  companies: any[];
  isLoadingCompanies: boolean;
  error: string | null;
  
  // Fetch operations
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  fetchCompanies: () => Promise<any[]>; 
  fetchCompanyById: (id: string) => Promise<any | null>;
  
  // CRUD operations for users
  createUser: (user: Partial<User>) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
  addUser: (user: UserWithPassword) => Promise<any>;
  
  // CRUD operations for companies
  addCompany: (company: any) => Promise<any>;
  updateCompany: (id: string, companyData: Partial<CompanyServiceParams>) => Promise<any>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoadingUsers: false,
  isLoadingCurrentUser: false,
  companies: [],
  isLoadingCompanies: false,
  error: null,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchUserById: async (id: string) => {
    try {
      set({ isLoadingCurrentUser: true, error: null });
      
      // For now, let's use mock data to avoid the database issues
      const mockUser = {
        id: id,
        name: id === 'super-admin-id' ? 'Super Admin' : 'Test User',
        email: id === 'super-admin-id' ? 'admin@repairautopilot.com' : 'user@example.com',
        role: 'admin' as const,
        status: 'active' as const,
        companyId: null,
        companyName: '',
        isMainAdmin: id === 'super-admin-id' // Set isMainAdmin to true for super admin
      };
      
      set({ currentUser: mockUser });
      return mockUser;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      toast.error('Failed to load user details');
      set({ error: 'Failed to load user details' });
      return null;
    } finally {
      set({ isLoadingCurrentUser: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      // For now, let's use mock data to avoid the database issues
      const mockUsers: User[] = [
        {
          id: 'super-admin-id',
          name: 'Super Admin',
          email: 'admin@repairautopilot.com',
          role: 'admin',
          status: 'active',
          avatarUrl: '',
          isMainAdmin: true, // This is the super admin
        },
        {
          id: 'user-2',
          name: 'Company Manager',
          email: 'company@example.com',
          role: 'company',
          status: 'active',
          avatarUrl: '',
        },
        {
          id: 'user-3',
          name: 'Tech Support',
          email: 'tech@example.com',
          role: 'tech',
          status: 'active',
          avatarUrl: '',
        },
      ];

      set({ users: mockUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      set({ error: 'Failed to load users' });
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  fetchCompanies: async () => {
    set({ isLoadingCompanies: true, error: null });
    try {
      // For now, let's use mock data to avoid the database issues
      const mockCompanies = [
        {
          id: 'company-1',
          name: 'Acme Corporation',
          email: 'info@acme.com',
          technicianCount: 5,
          planName: 'Enterprise',
          status: 'active'
        },
        {
          id: 'company-2',
          name: 'Stark Industries',
          email: 'info@stark.com',
          technicianCount: 12,
          planName: 'Professional',
          status: 'trial'
        },
        {
          id: 'company-3',
          name: 'Wayne Enterprises',
          email: 'info@wayne.com',
          technicianCount: 8,
          planName: 'Enterprise',
          status: 'active'
        },
      ];
      
      set({ companies: mockCompanies });
      return mockCompanies;
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
      set({ error: 'Failed to load companies' });
      return [];
    } finally {
      set({ isLoadingCompanies: false });
    }
  },

  fetchCompanyById: async (id: string) => {
    try {
      set({ error: null });
      const companyData = await companyService.fetchCompanyById(id);
      return companyData;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      toast.error('Failed to load company details');
      set({ error: 'Failed to load company details' });
      return null;
    }
  },

  createUser: async (user: Partial<User>) => {
    try {
      set({ error: null });
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
      set({ error: 'Failed to create user' });
      return null;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      set({ error: null });
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
      set({ error: 'Failed to update user' });
      return false;
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ error: null });
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
      set({ error: 'Failed to delete user' });
      return false;
    }
  },

  resetUserPassword: async (id: string, newPassword: string) => {
    try {
      set({ error: null });
      // This function is a placeholder; you'll need to implement the actual password reset logic.
      // It might involve calling a Supabase function or using your own backend to handle the password reset.

      // Simulate a successful password reset
      toast.success('Password reset successfully!');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
      set({ error: 'Failed to reset password' });
      return false;
    }
  },

  addCompany: async (company: CompanyServiceParams) => {
    try {
      set({ error: null });
      const companyData = await companyService.createCompany(company);
      if (companyData) {
        toast.success('Company created successfully!');
        get().fetchCompanies(); // Refresh companies
      }
      return companyData;
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to create company');
      set({ error: 'Failed to create company' });
      return null;
    }
  },

  updateCompany: async (id: string, companyData: Partial<CompanyServiceParams>) => {
    try {
      set({ error: null });
      const updatedCompany = await companyService.updateCompany(id, companyData);
      if (updatedCompany) {
        toast.success('Company updated successfully!');
        get().fetchCompanies(); // Refresh companies list
      }
      return updatedCompany;
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
      set({ error: 'Failed to update company' });
      return null;
    }
  },

  deleteCompany: async (id: string) => {
    try {
      set({ error: null });
      const success = await companyService.deleteCompany(id);
      if (success) {
        toast.success('Company deleted successfully!');
        get().fetchCompanies(); // Refresh companies
      }
      return success;
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
      set({ error: 'Failed to delete company' });
      return false;
    }
  },

  addUser: async (user: UserWithPassword) => {
    try {
      set({ error: null });
      // Mock successful user creation
      const mockNewUser = {
        id: `user-${Date.now()}`,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company_id: user.companyId,
        status: user.status,
        isMainAdmin: false, // New users are never super admins
      };

      // Update the users list with the new user
      const currentUsers = get().users;
      set({ users: [...currentUsers, mockNewUser as User] });
      
      toast.success('User added successfully!');
      return mockNewUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      set({ error: 'Failed to add user' });
      return null;
    }
  }
}));
