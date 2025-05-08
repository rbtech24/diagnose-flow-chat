
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TechnicianInvite } from '@/types/user';
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
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User | undefined>;
  deleteUser: (id: string) => Promise<boolean>;
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
  
  // Company Actions
  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<Company | undefined>;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'technicianCount'>) => Promise<Company>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<Company | undefined>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Technician Invite Actions
  fetchTechnicianInvites: (companyId?: string) => Promise<void>;
  addTechnicianInvite: (invite: Omit<TechnicianInvite, 'id' | 'createdAt' | 'expiresAt' | 'status'>) => Promise<TechnicianInvite>;
  cancelTechnicianInvite: (inviteId: string) => Promise<boolean>;
}

// In a real app, these would come from a database
const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Initial data (in a real app, this would be loaded from the backend)
const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@repairautopilot.com",
    role: "admin",
    phone: "(555) 123-4567",
    subscriptionStatus: "active",
  },
  {
    id: "company-1",
    name: "Sarah Smith",
    email: "sarah@acmerepairs.com",
    role: "company",
    phone: "(555) 987-6543",
    companyId: "company-acme-1",
    subscriptionStatus: "active",
    isMainAdmin: true,
  },
  {
    id: "tech-1",
    name: "Mike Johnson",
    email: "mike@acmerepairs.com",
    role: "tech",
    phone: "(555) 456-7890",
    companyId: "company-acme-1",
  }
];

const initialCompanies: Company[] = [
  {
    id: "company-acme-1",
    name: "Acme Repairs",
    contactName: "Sarah Smith",
    email: "contact@acmerepairs.com",
    phone: "(555) 987-6543",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    country: "USA",
    planId: "plan-premium-1",
    planName: "Premium",
    status: "active",
    technicianCount: 5,
    createdAt: new Date(2023, 0, 15),
    updatedAt: new Date(2023, 2, 10),
  },
  {
    id: "company-fast-2",
    name: "Fast Fix Solutions",
    contactName: "John Davis",
    email: "contact@fastfix.com",
    phone: "(555) 123-4567",
    address: "456 Oak Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "USA",
    planId: "plan-basic-1",
    planName: "Basic",
    status: "trial",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    technicianCount: 3,
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 5),
  },
  {
    id: "company-expert-3",
    name: "Expert Appliance Repair",
    contactName: "Lisa Johnson",
    email: "contact@expertrepair.com",
    phone: "(555) 567-8901",
    address: "789 Pine St",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    country: "USA",
    planId: "plan-enterprise-1",
    planName: "Enterprise",
    status: "active",
    technicianCount: 8,
    createdAt: new Date(2023, 1, 20),
    updatedAt: new Date(2023, 4, 15),
  }
];

export const useUserManagementStore = create<UserManagementState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      companies: initialCompanies,
      techniciansInvites: [],
      isLoadingUsers: false,
      isLoadingCompanies: false,
      isLoadingInvites: false,
      
      // User Actions
      fetchUsers: async () => {
        set({ isLoadingUsers: true });
        try {
          // In a real app, this would be an API call to fetch users
          // For now, we'll just use the mock data
          // const { data, error } = await supabase.from('users').select('*');
          // if (error) throw error;
          // set({ users: data });
          
          // We'll simulate a delay to mimic an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          // We're already setting the initial users in the store
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to fetch users');
        } finally {
          set({ isLoadingUsers: false });
        }
      },
      
      fetchUserById: async (id: string) => {
        try {
          // In a real app, this would be an API call to fetch a user by ID
          // For now, we'll just find the user in our store
          // const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
          // if (error) throw error;
          // return data;
          
          return get().users.find(user => user.id === id);
        } catch (error) {
          console.error(`Error fetching user ${id}:`, error);
          toast.error('Failed to fetch user details');
          return undefined;
        }
      },
      
      addUser: async (userData) => {
        try {
          // In a real app, this would be an API call to add a user
          // For now, we'll just add the user to our store
          // const { data, error } = await supabase.from('users').insert([userData]).select().single();
          // if (error) throw error;
          
          const newUser: User = {
            ...userData,
            id: generateId()
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
          // In a real app, this would be an API call to update a user
          // For now, we'll just update the user in our store
          // const { data, error } = await supabase.from('users').update(userData).eq('id', id).select().single();
          // if (error) throw error;
          
          let updatedUser: User | undefined;
          
          set(state => {
            const updatedUsers = state.users.map(user => {
              if (user.id === id) {
                updatedUser = { ...user, ...userData };
                return updatedUser;
              }
              return user;
            });
            
            return { users: updatedUsers };
          });
          
          if (updatedUser) {
            toast.success('User updated successfully');
            return updatedUser;
          }
          
          toast.error('User not found');
          return undefined;
        } catch (error) {
          console.error(`Error updating user ${id}:`, error);
          toast.error('Failed to update user');
          return undefined;
        }
      },
      
      deleteUser: async (id) => {
        try {
          // In a real app, this would be an API call to delete a user
          // For now, we'll just remove the user from our store
          // const { error } = await supabase.from('users').delete().eq('id', id);
          // if (error) throw error;
          
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
          // In a real app, this would be an API call to reset a user's password
          // For now, we'll just simulate success
          // In production, you'd typically send a reset link or set a temporary password
          
          // const { error } = await supabase.auth.admin.updateUserById(id, {
          //   password: newPassword,
          // });
          // if (error) throw error;
          
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
          // In a real app, this would be an API call to fetch companies
          // For now, we'll just use the mock data
          // const { data, error } = await supabase.from('companies').select('*');
          // if (error) throw error;
          // set({ companies: data });
          
          // We'll simulate a delay to mimic an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          // We're already setting the initial companies in the store
        } catch (error) {
          console.error('Error fetching companies:', error);
          toast.error('Failed to fetch companies');
        } finally {
          set({ isLoadingCompanies: false });
        }
      },
      
      fetchCompanyById: async (id) => {
        try {
          // In a real app, this would be an API call to fetch a company by ID
          // For now, we'll just find the company in our store
          // const { data, error } = await supabase.from('companies').select('*').eq('id', id).single();
          // if (error) throw error;
          // return data;
          
          return get().companies.find(company => company.id === id);
        } catch (error) {
          console.error(`Error fetching company ${id}:`, error);
          toast.error('Failed to fetch company details');
          return undefined;
        }
      },
      
      addCompany: async (companyData) => {
        try {
          // In a real app, this would be an API call to add a company
          // For now, we'll just add the company to our store
          // const { data, error } = await supabase.from('companies').insert([companyData]).select().single();
          // if (error) throw error;
          
          const newCompany: Company = {
            ...companyData,
            id: generateId(),
            technicianCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
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
          // In a real app, this would be an API call to update a company
          // For now, we'll just update the company in our store
          // const { data, error } = await supabase.from('companies').update(companyData).eq('id', id).select().single();
          // if (error) throw error;
          
          let updatedCompany: Company | undefined;
          
          set(state => {
            const updatedCompanies = state.companies.map(company => {
              if (company.id === id) {
                updatedCompany = { 
                  ...company, 
                  ...companyData,
                  updatedAt: new Date()
                };
                return updatedCompany;
              }
              return company;
            });
            
            return { companies: updatedCompanies };
          });
          
          if (updatedCompany) {
            toast.success('Company updated successfully');
            return updatedCompany;
          }
          
          toast.error('Company not found');
          return undefined;
        } catch (error) {
          console.error(`Error updating company ${id}:`, error);
          toast.error('Failed to update company');
          return undefined;
        }
      },
      
      deleteCompany: async (id) => {
        try {
          // In a real app, this would be an API call to delete a company
          // For now, we'll just remove the company from our store
          // const { error } = await supabase.from('companies').delete().eq('id', id);
          // if (error) throw error;
          
          set(state => ({
            companies: state.companies.filter(company => company.id !== id),
            // Also remove all users associated with this company
            users: state.users.filter(user => user.companyId !== id)
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
          // In a real app, this would be an API call to fetch technician invites
          // For now, we'll just simulate fetching invites
          
          // let query = supabase.from('technician_invites').select('*');
          // if (companyId) {
          //   query = query.eq('companyId', companyId);
          // }
          // const { data, error } = await query;
          // if (error) throw error;
          // set({ techniciansInvites: data });
          
          // For now, we'll just return the technician invites in the store
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Error fetching technician invites:', error);
          toast.error('Failed to fetch technician invites');
        } finally {
          set({ isLoadingInvites: false });
        }
      },
      
      addTechnicianInvite: async (inviteData) => {
        try {
          // In a real app, this would be an API call to add a technician invite
          // For now, we'll just add the invite to our store
          // const { data, error } = await supabase.from('technician_invites').insert([inviteData]).select().single();
          // if (error) throw error;
          
          const newInvite: TechnicianInvite = {
            ...inviteData,
            id: generateId(),
            status: 'pending',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          };
          
          set(state => ({
            techniciansInvites: [...state.techniciansInvites, newInvite]
          }));
          
          // Update technician count for the company
          get().updateCompany(inviteData.companyId, {
            technicianCount: get().companies.find(c => c.id === inviteData.companyId)?.technicianCount! + 1
          });
          
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
          // In a real app, this would be an API call to cancel a technician invite
          // For now, we'll just remove the invite from our store
          // const { error } = await supabase.from('technician_invites').delete().eq('id', inviteId);
          // if (error) throw error;
          
          const invite = get().techniciansInvites.find(i => i.id === inviteId);
          
          if (invite) {
            set(state => ({
              techniciansInvites: state.techniciansInvites.filter(invite => invite.id !== inviteId)
            }));
            
            // Update technician count for the company
            get().updateCompany(invite.companyId, {
              technicianCount: Math.max(0, get().companies.find(c => c.id === invite.companyId)?.technicianCount! - 1)
            });
          }
          
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
      // Only persist the users and companies arrays, not the loading states
      partialize: (state) => ({
        users: state.users,
        companies: state.companies,
        techniciansInvites: state.techniciansInvites,
      }),
    }
  )
);
