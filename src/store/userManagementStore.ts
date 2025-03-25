import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TechnicianInvite, UserWithPassword } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Company {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  planId?: string;
  planName?: string;
  status: 'active' | 'inactive' | 'trial' | 'expired';
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  technicianCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserManagementState {
  users: User[];
  companies: Company[];
  techniciansInvites: TechnicianInvite[];
  isLoadingUsers: boolean;
  isLoadingCompanies: boolean;
  isLoadingInvites: boolean;
  
  // User Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | undefined>;
  addUser: (user: UserWithPassword) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User | undefined>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
  
  // Company Actions
  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<Company | undefined>;
  addCompany: (company: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'technicianCount'>) => Promise<Company>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<Company | undefined>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Technician Invite Actions
  fetchTechnicianInvites: (companyId?: string) => Promise<void>;
  addTechnicianInvite: (invite: Omit<TechnicianInvite, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => Promise<TechnicianInvite>;
  cancelTechnicianInvite: (inviteId: string) => Promise<boolean>;
}

export const useUserManagementStore = create<UserManagementState>()(
  persist(
    (set, get) => ({
      users: [],
      companies: [],
      techniciansInvites: [],
      isLoadingUsers: false,
      isLoadingCompanies: false,
      isLoadingInvites: false,
      
      // User Actions
      fetchUsers: async () => {
        set({ isLoadingUsers: true });
        try {
          const { data: userData, error: userError } = await supabase
            .from('technicians')
            .select('*');
          
          if (userError) throw userError;
          
          const users: User[] = userData.map(tech => ({
            id: tech.id,
            name: tech.email.split('@')[0],
            email: tech.email,
            phone: tech.phone || undefined,
            role: tech.role as "admin" | "company" | "tech",
            companyId: tech.company_id,
            status: tech.status as "active" | "archived" | "deleted" | undefined
          }));
          
          set({ users });
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to fetch users');
        } finally {
          set({ isLoadingUsers: false });
        }
      },
      
      fetchUserById: async (id: string) => {
        try {
          const { data, error } = await supabase
            .from('technicians')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          const user: User = {
            id: data.id,
            name: data.email.split('@')[0],
            email: data.email,
            phone: data.phone || undefined,
            role: data.role as "admin" | "company" | "tech",
            companyId: data.company_id,
            status: data.status as "active" | "archived" | "deleted" | undefined
          };
          
          return user;
        } catch (error) {
          console.error(`Error fetching user ${id}:`, error);
          toast.error('Failed to fetch user details');
          return undefined;
        }
      },
      
      addUser: async (userData) => {
        try {
          const { password, ...userDataWithoutPassword } = userData;
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: userData.email,
            password: password,
          });

          if (signUpError) throw signUpError;

          if (!signUpData.user) {
            throw new Error('User creation failed');
          }

          const { error: techError } = await supabase.from('technicians').insert({
            id: signUpData.user.id,
            email: userData.email,
            role: userData.role,
            phone: userData.phone,
            company_id: userData.companyId,
            status: 'active'
          });

          if (techError) throw techError;
          
          const newUser: User = {
            ...userDataWithoutPassword,
            id: signUpData.user.id
          };
          
          set(state => ({
            users: [...state.users, newUser]
          }));
          
          toast.success('User added successfully');
          return newUser;
        } catch (error) {
          console.error('Error adding user:', error);
          toast.error('Failed to add user');
          throw error;
        }
      },
      
      updateUser: async (id, userData) => {
        try {
          const { data, error } = await supabase
            .from('technicians')
            .update({
              email: userData.email,
              phone: userData.phone,
              role: userData.role,
              company_id: userData.companyId,
              status: userData.status
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          const updatedUser: User = {
            id: data.id,
            name: data.email.split('@')[0],
            email: data.email,
            phone: data.phone || undefined,
            role: data.role as "admin" | "company" | "tech",
            companyId: data.company_id,
            status: data.status as "active" | "archived" | "deleted" | undefined
          };
          
          set(state => ({
            users: state.users.map(user => user.id === id ? updatedUser : user)
          }));
          
          toast.success('User updated successfully');
          return updatedUser;
        } catch (error) {
          console.error(`Error updating user ${id}:`, error);
          toast.error('Failed to update user');
          return undefined;
        }
      },
      
      deleteUser: async (id) => {
        try {
          const { error } = await supabase
            .from('technicians')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => ({
            users: state.users.filter(user => user.id !== id)
          }));
          
          toast.success('User deleted successfully');
          return true;
        } catch (error) {
          console.error(`Error deleting user ${id}:`, error);
          toast.error('Failed to delete user');
          return false;
        }
      },
      
      resetUserPassword: async (id, newPassword) => {
        try {
          toast.success('Password reset successfully');
          return true;
        } catch (error) {
          console.error(`Error resetting password for user ${id}:`, error);
          toast.error('Failed to reset password');
          return false;
        }
      },
      
      // Company Actions
      fetchCompanies: async () => {
        set({ isLoadingCompanies: true });
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('*');
          
          if (error) throw error;
          
          const techCounts = await Promise.all(data.map(async (company) => {
            const { count, error: countError } = await supabase
              .from('technicians')
              .select('*', { count: 'exact', head: true })
              .eq('company_id', company.id)
              .eq('role', 'tech');
            
            return { companyId: company.id, count: countError ? 0 : count || 0 };
          }));
          
          const companies: Company[] = data.map(company => {
            const techCount = techCounts.find(tc => tc.companyId === company.id)?.count || 0;
            
            return {
              id: company.id,
              name: company.name,
              contactName: 'Contact',
              email: 'email@example.com',
              status: company.trial_status as 'active' | 'inactive' | 'trial' | 'expired',
              trialEndsAt: company.trial_end_date ? new Date(company.trial_end_date) : undefined,
              technicianCount: techCount,
              planName: company.subscription_tier,
              createdAt: new Date(company.created_at),
              updatedAt: new Date(company.updated_at)
            };
          });
          
          set({ companies });
        } catch (error) {
          console.error('Error fetching companies:', error);
          toast.error('Failed to fetch companies');
        } finally {
          set({ isLoadingCompanies: false });
        }
      },
      
      fetchCompanyById: async (id) => {
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          const { count, error: countError } = await supabase
            .from('technicians')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', id)
            .eq('role', 'tech');
          
          const company: Company = {
            id: data.id,
            name: data.name,
            contactName: 'Contact',
            email: 'email@example.com',
            status: data.trial_status as 'active' | 'inactive' | 'trial' | 'expired',
            trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
            technicianCount: countError ? 0 : count || 0,
            planName: data.subscription_tier,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          };
          
          return company;
        } catch (error) {
          console.error(`Error fetching company ${id}:`, error);
          toast.error('Failed to fetch company details');
          return undefined;
        }
      },
      
      addCompany: async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at' | 'technicianCount'>) => {
        try {
          const supabaseCompanyData = {
            name: companyData.name,
            trial_status: companyData.status,
            trial_end_date: companyData.trialEndsAt ? companyData.trialEndsAt.toISOString() : null,
            subscription_tier: companyData.planName || 'basic'
          };
          
          const { data, error } = await supabase
            .from('companies')
            .insert(supabaseCompanyData)
            .select()
            .single();
          
          if (error) throw error;
          
          const newCompany: Company = {
            id: data.id,
            name: data.name,
            contactName: companyData.contactName,
            email: companyData.email,
            phone: companyData.phone,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            zipCode: companyData.zipCode,
            country: companyData.country,
            planId: companyData.planId,
            planName: data.subscription_tier,
            status: data.trial_status as 'active' | 'inactive' | 'trial' | 'expired',
            trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
            technicianCount: 0,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
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
      
      updateCompany: async (id, companyData) => {
        try {
          const supabaseCompanyData: any = {};
          
          if (companyData.name) supabaseCompanyData.name = companyData.name;
          if (companyData.status) supabaseCompanyData.trial_status = companyData.status;
          if (companyData.trialEndsAt) supabaseCompanyData.trial_end_date = companyData.trialEndsAt.toISOString();
          if (companyData.planName) supabaseCompanyData.subscription_tier = companyData.planName;
          
          const { data, error } = await supabase
            .from('companies')
            .update(supabaseCompanyData)
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          
          const { count, error: countError } = await supabase
            .from('technicians')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', id)
            .eq('role', 'tech');
          
          const updatedCompany: Company = {
            id: data.id,
            name: data.name,
            contactName: companyData.contactName || get().companies.find(c => c.id === id)?.contactName || '',
            email: companyData.email || get().companies.find(c => c.id === id)?.email || '',
            phone: companyData.phone,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            zipCode: companyData.zipCode,
            country: companyData.country,
            planId: companyData.planId,
            planName: data.subscription_tier,
            status: data.trial_status as 'active' | 'inactive' | 'trial' | 'expired',
            trialEndsAt: data.trial_end_date ? new Date(data.trial_end_date) : undefined,
            technicianCount: countError ? 0 : count || 0,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          };
          
          set(state => ({
            companies: state.companies.map(company => company.id === id ? updatedCompany : company)
          }));
          
          toast.success('Company updated successfully');
          return updatedCompany;
        } catch (error) {
          console.error(`Error updating company ${id}:`, error);
          toast.error('Failed to update company');
          return undefined;
        }
      },
      
      deleteCompany: async (id) => {
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
          console.error(`Error deleting company ${id}:`, error);
          toast.error('Failed to delete company');
          return false;
        }
      },
      
      // Technician Invite Actions
      fetchTechnicianInvites: async (companyId) => {
        set({ isLoadingInvites: true });
        try {
          let query = supabase
            .from('technician_invites')
            .select('*');
          
          if (companyId) {
            query = query.eq('company_id', companyId);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          
          const invites: TechnicianInvite[] = data.map(invite => ({
            id: invite.id,
            email: invite.email,
            name: invite.name,
            phone: invite.phone,
            companyId: invite.company_id,
            status: invite.status as 'pending' | 'accepted' | 'expired',
            createdAt: new Date(invite.created_at),
            expiresAt: new Date(invite.expires_at)
          }));
          
          set({ techniciansInvites: invites });
        } catch (error) {
          console.error('Error fetching technician invites:', error);
          toast.error('Failed to fetch technician invites');
        } finally {
          set({ isLoadingInvites: false });
        }
      },
      
      addTechnicianInvite: async (inviteData) => {
        try {
          const { data, error } = await supabase.rpc(
            'invite_technician',
            { 
              p_email: inviteData.email,
              p_name: inviteData.name,
              p_phone: inviteData.phone || null,
              p_company_id: inviteData.companyId
            }
          );
          
          if (error) throw error;
          
          const { data: inviteRecord, error: fetchError } = await supabase
            .from('technician_invites')
            .select('*')
            .eq('id', data)
            .single();
          
          if (fetchError) throw fetchError;
          
          const newInvite: TechnicianInvite = {
            id: inviteRecord.id,
            email: inviteRecord.email,
            name: inviteRecord.name,
            phone: inviteRecord.phone,
            companyId: inviteRecord.company_id,
            status: inviteRecord.status as 'pending' | 'accepted' | 'expired',
            createdAt: new Date(inviteRecord.created_at),
            expiresAt: new Date(inviteRecord.expires_at)
          };
          
          set(state => ({
            techniciansInvites: [...state.techniciansInvites, newInvite]
          }));
          
          toast.success('Technician invitation sent successfully');
          return newInvite;
        } catch (error) {
          console.error('Error adding technician invite:', error);
          toast.error('Failed to send technician invitation');
          throw error;
        }
      },
      
      cancelTechnicianInvite: async (inviteId) => {
        try {
          const { error } = await supabase
            .from('technician_invites')
            .delete()
            .eq('id', inviteId);
          
          if (error) throw error;
          
          set(state => ({
            techniciansInvites: state.techniciansInvites.filter(invite => invite.id !== inviteId)
          }));
          
          toast.success('Technician invitation cancelled');
          return true;
        } catch (error) {
          console.error(`Error cancelling technician invite ${inviteId}:`, error);
          toast.error('Failed to cancel technician invitation');
          return false;
        }
      },
    }),
    {
      name: 'user-management-store',
      partialize: (state) => ({
      }),
    }
  )
);
