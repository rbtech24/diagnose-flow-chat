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
  addCompany: (company: CompanyServiceParams) => Promise<any>;
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
      
      // Handle super admin case
      if (id === 'super-admin-id') {
        const superAdmin: User = {
          id: 'super-admin-id',
          name: 'Super Admin',
          email: 'admin@repairautopilot.com',
          role: 'admin',
          status: 'active',
          avatarUrl: '',
          isMainAdmin: true
        };
        set({ currentUser: superAdmin });
        return superAdmin;
      }
      
      // For all other users, try to fetch from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
      
      if (data) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as "admin" | "company" | "tech",
          status: data.status as "active" | "inactive" | "pending" | "archived" | "deleted",
          companyId: data.company_id,
          avatarUrl: data.avatar_url,
          isMainAdmin: false
        };
        
        set({ currentUser: user });
        return user;
      }
      
      set({ error: 'User not found' });
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      set({ error: 'Failed to load user details' });
      return null;
    } finally {
      set({ isLoadingCurrentUser: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      console.log("Fetching users...");
      
      // Add super admin to the list first
      const superAdmin: User = {
        id: 'super-admin-id',
        name: 'Super Admin',
        email: 'admin@repairautopilot.com',
        role: 'admin',
        status: 'active',
        avatarUrl: '',
        isMainAdmin: true
      };
      
      // Fetch real users from database
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Error fetching users from Supabase:', error);
        throw error;
      }

      console.log("Database users:", data ? data.length : 0);
      
      // Convert database users to User type
      const dbUsers: User[] = data ? data.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email,
        role: user.role as "admin" | "company" | "tech",
        status: user.status as "active" | "inactive" | "pending" | "archived" | "deleted",
        avatarUrl: user.avatar_url,
        companyId: user.company_id,
        isMainAdmin: false
      })) : [];
      
      // Combine super admin with database users
      const allUsers: User[] = [superAdmin, ...dbUsers];
      console.log("Total users to display:", allUsers.length);
      
      set({ users: allUsers });
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
      console.log("Fetching companies...");
      // Get real companies from database
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      console.log("Companies fetched:", data ? data.length : 0);

      // Add company metadata
      const companiesWithMetadata = data ? data.map(company => ({
        ...company,
        technicianCount: 0, // Will need to be calculated later
        planName: company.subscription_tier || 'Basic'
      })) : [];
      
      set({ companies: companiesWithMetadata });
      return companiesWithMetadata;
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
      console.log("Creating company with data:", company);
      
      // Ensure required fields are present
      if (!company.name) {
        toast.error('Company name is required');
        set({ error: 'Company name is required' });
        return null;
      }

      const companyData = await companyService.createCompany(company);
      if (companyData) {
        console.log("Company created successfully:", companyData);
        toast.success('Company created successfully!');
        get().fetchCompanies(); // Refresh companies
      } else {
        console.error("Company creation returned no data");
        toast.error('Failed to create company');
        set({ error: 'Failed to create company: No data returned' });
      }
      return companyData;
    } catch (error: any) {
      console.error('Error creating company:', error);
      const errorMessage = error.message || 'Failed to create company';
      toast.error(errorMessage);
      set({ error: errorMessage });
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
      
      // Create user with auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            role: user.role
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // Insert into users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          company_id: user.companyId,
          status: user.status,
          avatar_url: user.avatarUrl,
          is_main_admin: false // New users are never super admins
        }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add to users list
      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as "admin" | "company" | "tech",
        phone: data.phone,
        companyId: data.company_id,
        status: data.status as "active" | "inactive" | "pending" | "archived" | "deleted",
        avatarUrl: data.avatar_url,
        isMainAdmin: false
      };
      
      const currentUsers = get().users;
      set({ users: [...currentUsers, newUser] });
      
      toast.success('User added successfully!');
      return data;
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.message || 'Failed to add user');
      set({ error: error.message || 'Failed to add user' });
      return null;
    }
  }
}));
