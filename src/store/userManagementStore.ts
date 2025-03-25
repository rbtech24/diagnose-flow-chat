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
  status: 'active' | 'inactive' | 'pending';
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

// Mock data for companies
const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Ace Appliance Repair',
    contactName: 'John Smith',
    email: 'info@acerepair.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    planId: 'plan-1',
    planName: 'Professional',
    status: 'active',
    technicianCount: 12,
    createdAt: new Date(2022, 1, 15),
    updatedAt: new Date(2023, 3, 10),
    subscriptionEndsAt: new Date(2024, 3, 10)
  },
  {
    id: 'company-2',
    name: 'Quick Fix Electronics',
    contactName: 'Sarah Johnson',
    email: 'contact@quickfix.com',
    phone: '(555) 987-6543',
    address: '456 Tech Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'USA',
    planId: 'plan-2',
    planName: 'Enterprise',
    status: 'active',
    technicianCount: 25,
    createdAt: new Date(2021, 8, 22),
    updatedAt: new Date(2023, 5, 18),
    subscriptionEndsAt: new Date(2024, 5, 18)
  },
  {
    id: 'company-3',
    name: 'HomeWorks Repair',
    contactName: 'Michael Brown',
    email: 'service@homeworks.com',
    phone: '(555) 456-7890',
    address: '789 Repair Lane',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    planId: 'plan-1',
    planName: 'Professional',
    status: 'trial',
    technicianCount: 8,
    createdAt: new Date(2023, 2, 5),
    updatedAt: new Date(2023, 6, 12),
    trialEndsAt: new Date(2023, 11, 5)
  },
  {
    id: 'company-4',
    name: 'Elite HVAC Solutions',
    contactName: 'Jennifer Davis',
    email: 'info@elitehvac.com',
    phone: '(555) 234-5678',
    address: '101 Cooling Way',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    country: 'USA',
    planId: 'plan-3',
    planName: 'Basic',
    status: 'expired',
    technicianCount: 5,
    createdAt: new Date(2022, 5, 18),
    updatedAt: new Date(2023, 4, 30),
    subscriptionEndsAt: new Date(2023, 4, 30)
  },
  {
    id: 'company-5',
    name: 'Tech Masters',
    contactName: 'Robert Wilson',
    email: 'support@techmasters.com',
    phone: '(555) 876-5432',
    status: 'inactive',
    technicianCount: 0,
    createdAt: new Date(2023, 1, 10),
    updatedAt: new Date(2023, 7, 5)
  }
];

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@acerepair.com',
    role: 'company',
    status: 'active',
    companyId: 'company-1',
    companyName: 'Ace Appliance Repair',
    isMainAdmin: true
  },
  {
    id: 'user-2',
    name: 'Alice Brown',
    email: 'alice@acerepair.com',
    role: 'tech',
    status: 'active',
    companyId: 'company-1',
    companyName: 'Ace Appliance Repair'
  },
  {
    id: 'user-3',
    name: 'Sarah Johnson',
    email: 'sarah@quickfix.com',
    role: 'company',
    status: 'active',
    companyId: 'company-2',
    companyName: 'Quick Fix Electronics',
    isMainAdmin: true
  },
  {
    id: 'user-4',
    name: 'Michael Brown',
    email: 'michael@homeworks.com',
    role: 'company',
    status: 'active',
    companyId: 'company-3',
    companyName: 'HomeWorks Repair',
    isMainAdmin: true
  },
  {
    id: 'user-5',
    name: 'Jennifer Davis',
    email: 'jennifer@elitehvac.com',
    role: 'company',
    status: 'active',
    companyId: 'company-4',
    companyName: 'Elite HVAC Solutions',
    isMainAdmin: true
  },
  {
    id: 'user-6',
    name: 'Robert Wilson',
    email: 'robert@techmasters.com',
    role: 'company',
    status: 'inactive',
    companyId: 'company-5',
    companyName: 'Tech Masters',
    isMainAdmin: true
  },
  {
    id: 'user-7',
    name: 'David Thompson',
    email: 'david@quickfix.com',
    role: 'tech',
    status: 'active',
    companyId: 'company-2',
    companyName: 'Quick Fix Electronics'
  },
  {
    id: 'user-8',
    name: 'Emma Garcia',
    email: 'emma@quickfix.com',
    role: 'tech',
    status: 'active',
    companyId: 'company-2',
    companyName: 'Quick Fix Electronics'
  }
];

export const useUserManagementStore = create<UserManagementStore>((set, get) => ({
  companies: [],
  users: [],
  isLoadingCompanies: false,
  isLoadingUsers: false,
  
  fetchCompanies: async () => {
    set({ isLoadingCompanies: true });
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ companies: mockCompanies, isLoadingCompanies: false });
    } catch (error) {
      console.error('Error fetching companies:', error);
      set({ isLoadingCompanies: false });
    }
  },
  
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ users: mockUsers, isLoadingUsers: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ isLoadingUsers: false });
    }
  },
  
  fetchCompanyById: async (id: string) => {
    try {
      // First check if we already have the company in state
      const { companies } = get();
      let company = companies.find(c => c.id === id);
      
      // If not found and companies array is empty, fetch companies first
      if (!company && companies.length === 0) {
        await get().fetchCompanies();
        company = get().companies.find(c => c.id === id);
      }
      
      return company || null;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      return null;
    }
  },
  
  addCompany: async (companyData: Omit<Company, 'id'>) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCompany: Company = {
        ...companyData,
        id: `company-${Date.now()}`, // Generate a unique ID
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
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // First check if we already have the user in state
      const { users } = get();
      let user = users.find(u => u.id === id);
      
      // If not found and users array is empty, fetch users first
      if (!user && users.length === 0) {
        await get().fetchUsers();
        user = get().users.find(u => u.id === id);
      }
      
      return user || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },
  deleteUser: async (id: string) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call an API endpoint
      // For now, we'll just return success
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  },
  addUser: async (userData: Omit<User, 'id'>) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`, // Generate a unique ID
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
