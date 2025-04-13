
import { create } from 'zustand';

interface Company {
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
  addUser: (userData: Omit<User, 'id'>) => Promise<User | null>;
}

export const useUserManagementStore = create<UserManagementStore>((set, get) => ({
  companies: [],
  users: [],
  isLoadingCompanies: false,
  isLoadingUsers: false,
  
  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ companies: [], isLoadingCompanies: false });
    } catch (error) {
      console.error('Error fetching companies:', error);
      set({ isLoadingCompanies: false });
    }
  },
  
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ users: [], isLoadingUsers: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ isLoadingUsers: false });
    }
  },
  
  fetchCompanyById: async (id: string) => {
    try {
      // This would be replaced with an actual API call
      return null;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      return null;
    }
  },
  
  addCompany: async (companyData: Omit<Company, 'id'>) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCompany: Company = {
        ...companyData,
        id: `company-${Date.now()}`,
        technicianCount: 0,
      };
      
      set(state => ({
        companies: [...state.companies, newCompany]
      }));
      
      return newCompany;
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  },
  
  updateCompany: async (id: string, updates: Partial<Company>) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedCompany: Company | null = null;
      
      set(state => {
        const updatedCompanies = state.companies.map(company => {
          if (company.id === id) {
            updatedCompany = { ...company, ...updates, updatedAt: new Date() };
            return updatedCompany;
          }
          return company;
        });
        
        return { companies: updatedCompanies };
      });
      
      return updatedCompany;
    } catch (error) {
      console.error('Error updating company:', error);
      return null;
    }
  },
  
  deleteCompany: async (id: string) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        companies: state.companies.filter(company => company.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      return false;
    }
  },
  
  fetchUserById: async (id: string) => {
    try {
      // This would be replaced with an actual API call
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },
  
  deleteUser: async (id: string) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.filter(user => user.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },
  
  resetUserPassword: async (id: string, newPassword: string) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  },
  
  addUser: async (userData: Omit<User, 'id'>) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
      };
      
      set(state => ({
        users: [...state.users, newUser]
      }));
      
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }
}));
