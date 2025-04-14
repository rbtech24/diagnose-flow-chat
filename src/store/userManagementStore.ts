
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';

interface Company {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  planId?: string;
  planName?: string;
  status: 'active' | 'inactive' | 'trial' | 'expired';
  technicianCount?: number;
  createdAt: Date;
  updatedAt: Date;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'company' | 'tech';
  status: 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';
  companyId?: string;
  companyName?: string;
  isMainAdmin?: boolean;
}

interface UserManagementStore {
  companies: Company[];
  users: User[];
  isLoadingCompanies: boolean;
  isLoadingUsers: boolean;
  fetchCompanies: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<Company | null>;
  addCompany: (company: Omit<Company, 'id'>) => Promise<Company>;
  updateCompany: (id: string, updates: Partial<Company>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  fetchUserById: (id: string) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
  addUser: (userData: any) => Promise<User | null>;
}

export const useUserManagementStore = create<UserManagementStore>((set, get) => ({
  companies: [],
  users: [],
  isLoadingCompanies: false,
  isLoadingUsers: false,
  
  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedCompanies = data.map(company => ({
        id: company.id,
        name: company.name,
        contactName: company.contact_name || '',
        email: company.email || '',
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        zipCode: company.zip_code,
        country: company.country,
        planId: company.plan_id,
        planName: company.plan_name || company.subscription_tier,
        status: (company.status || company.trial_status) as 'active' | 'inactive' | 'trial' | 'expired',
        technicianCount: company.technician_count || 0,
        createdAt: new Date(company.created_at),
        updatedAt: new Date(company.updated_at),
        trialEndsAt: company.trial_end_date ? new Date(company.trial_end_date) : undefined,
        subscriptionEndsAt: company.subscription_ends_at ? new Date(company.subscription_ends_at) : undefined,
      }));
      
      set({ companies: formattedCompanies, isLoadingCompanies: false });
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
      set({ isLoadingCompanies: false });
    }
  },
  
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies:company_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email,
        role: user.role as 'admin' | 'company' | 'tech',
        status: user.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        companyId: user.company_id,
        companyName: user.companies?.name || '',
        isMainAdmin: false // This would need additional logic to determine
      }));
      
      set({ users: formattedUsers, isLoadingUsers: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      set({ isLoadingUsers: false });
    }
  },
  
  fetchCompanyById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        contactName: data.contact_name || '',
        email: data.email || '',
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        planId: data.plan_id,
        planName: data.plan_name || data.subscription_tier,
        status: (data.status || data.trial_status) as 'active' | 'inactive' | 'trial' | 'expired',
        technicianCount: data.technician_count || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
        subscriptionEndsAt: data.subscription_ends_at ? new Date(data.subscription_ends_at) : undefined,
      };
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      toast.error('Failed to load company details');
      return null;
    }
  },
  
  addCompany: async (companyData) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: companyData.name,
          contact_name: companyData.contactName,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          zip_code: companyData.zipCode,
          country: companyData.country,
          plan_id: companyData.planId,
          plan_name: companyData.planName,
          status: companyData.status,
          technician_count: companyData.technicianCount || 0,
          trial_end_date: companyData.trialEndsAt?.toISOString(),
          subscription_ends_at: companyData.subscriptionEndsAt?.toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newCompany: Company = {
        id: data.id,
        name: data.name,
        contactName: data.contact_name || '',
        email: data.email || '',
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        planId: data.plan_id,
        planName: data.plan_name,
        status: data.status as 'active' | 'inactive' | 'trial' | 'expired',
        technicianCount: data.technician_count || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
        subscriptionEndsAt: data.subscription_ends_at ? new Date(data.subscription_ends_at) : undefined,
      };
      
      set(state => ({
        companies: [...state.companies, newCompany]
      }));
      
      toast.success('Company added successfully');
      return newCompany;
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error('Failed to add company');
      throw error;
    }
  },
  
  updateCompany: async (id: string, updates: Partial<Company>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.contactName !== undefined) dbUpdates.contact_name = updates.contactName;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.city !== undefined) dbUpdates.city = updates.city;
      if (updates.state !== undefined) dbUpdates.state = updates.state;
      if (updates.zipCode !== undefined) dbUpdates.zip_code = updates.zipCode;
      if (updates.country !== undefined) dbUpdates.country = updates.country;
      if (updates.planId !== undefined) dbUpdates.plan_id = updates.planId;
      if (updates.planName !== undefined) dbUpdates.plan_name = updates.planName;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.technicianCount !== undefined) dbUpdates.technician_count = updates.technicianCount;
      if (updates.trialEndsAt !== undefined) dbUpdates.trial_end_date = updates.trialEndsAt?.toISOString();
      if (updates.subscriptionEndsAt !== undefined) dbUpdates.subscription_ends_at = updates.subscriptionEndsAt?.toISOString();
      
      // Always update the updated_at field
      dbUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('companies')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedCompany: Company = {
        id: data.id,
        name: data.name,
        contactName: data.contact_name || '',
        email: data.email || '',
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        planId: data.plan_id,
        planName: data.plan_name,
        status: data.status as 'active' | 'inactive' | 'trial' | 'expired',
        technicianCount: data.technician_count || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
        subscriptionEndsAt: data.subscription_ends_at ? new Date(data.subscription_ends_at) : undefined,
      };
      
      set(state => ({
        companies: state.companies.map(company => 
          company.id === id ? updatedCompany : company
        )
      }));
      
      toast.success('Company updated successfully');
      return updatedCompany;
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
      return null;
    }
  },
  
  deleteCompany: async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        companies: state.companies.filter(company => company.id !== id)
      }));
      
      toast.success('Company deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
      return false;
    }
  },
  
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
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email,
        role: data.role as 'admin' | 'company' | 'tech',
        status: data.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        companyId: data.company_id,
        companyName: data.companies?.name || '',
        isMainAdmin: false // This would need additional logic
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      toast.error('Failed to load user details');
      return null;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      // First update the status to deleted instead of actually deleting
      const { error } = await supabase
        .from('users')
        .update({ status: 'deleted', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        users: state.users.filter(user => user.id !== id)
      }));
      
      toast.success('User removed successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  },
  
  resetUserPassword: async (id: string, newPassword: string) => {
    try {
      // This would need to be implemented with a serverless function
      // For now we just simulate success
      toast.success('Password reset functionality not connected to backend');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
      return false;
    }
  },
  
  addUser: async (userData) => {
    try {
      // In a real implementation, we would create both an auth user and a profile
      // This is a simplified version
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || 'tempPassword123', // This would be randomly generated
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role,
          company_id: userData.companyId
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User creation failed');
      }
      
      // Create the user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as 'admin' | 'company' | 'tech',
          company_id: userData.companyId,
          status: (userData.status || 'active') as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted'
        }])
        .select()
        .single();
        
      if (profileError) throw profileError;
      
      const newUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as 'admin' | 'company' | 'tech',
        status: profile.status as 'active' | 'inactive' | 'pending' | 'archived' | 'deleted',
        companyId: profile.company_id,
        companyName: userData.companyName,
        isMainAdmin: userData.isMainAdmin
      };
      
      set(state => ({
        users: [...state.users, newUser]
      }));
      
      toast.success('User added successfully');
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      return null;
    }
  }
}));
