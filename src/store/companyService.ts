
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'react-hot-toast';
import { DbCompany } from '@/types/database';

// Type for company data with additional fields
export interface CompanyWithMetadata extends DbCompany {
  technicianCount?: number;
  planName?: string;
}

export interface CompanyServiceParams {
  id?: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  subscription_tier?: string;
  status?: string;
}

export const companyService = {
  // Fetch all companies
  async fetchCompanies(): Promise<CompanyWithMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) throw error;

      // Add technicianCount field with default value for UI display
      const companiesWithCounts = (data || []).map(company => ({
        ...company,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: company.subscription_tier || 'Basic'
      }));

      return companiesWithCounts;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Fetch company by ID
  async fetchCompanyById(id: string): Promise<CompanyWithMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) return null;

      // Add metadata for UI display
      return {
        ...data,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      throw error;
    }
  },

  // Create a new company
  async createCompany(companyData: CompanyServiceParams): Promise<CompanyWithMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{
          name: companyData.name,
          contact_name: companyData.contact_name,
          email: companyData.email,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          zip_code: companyData.zip_code,
          country: companyData.country,
          subscription_tier: companyData.subscription_tier || 'basic',
          trial_status: 'active',
          trial_period: 30
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        technicianCount: 0,
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update an existing company
  async updateCompany(id: string, companyData: Partial<CompanyServiceParams>): Promise<CompanyWithMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Delete a company
  async deleteCompany(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
};
