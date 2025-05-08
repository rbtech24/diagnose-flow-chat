
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
  description?: string;
}

export const companyService = {
  // Fetch all companies
  async fetchCompanies(): Promise<CompanyWithMetadata[]> {
    try {
      console.log("CompanyService: Fetching companies");
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) {
        console.error('CompanyService: Error fetching companies:', error);
        throw error;
      }

      console.log(`CompanyService: ${data?.length || 0} companies fetched`);
      
      // Add technicianCount field with default value for UI display
      const companiesWithCounts = (data || []).map(company => ({
        ...company,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: company.subscription_tier || 'Basic'
      }));

      return companiesWithCounts;
    } catch (error) {
      console.error('CompanyService: Error in fetchCompanies:', error);
      throw error;
    }
  },

  // Fetch company by ID
  async fetchCompanyById(id: string): Promise<CompanyWithMetadata | null> {
    try {
      console.log(`CompanyService: Fetching company with ID: ${id}`);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('CompanyService: Error fetching company by ID:', error);
        throw error;
      }

      if (!data) {
        console.log('CompanyService: No company found with ID:', id);
        return null;
      }

      console.log('CompanyService: Company fetched successfully:', data.name);
      
      // Add metadata for UI display
      return {
        ...data,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('CompanyService: Error in fetchCompanyById:', error);
      throw error;
    }
  },

  // Create a new company
  async createCompany(companyData: CompanyServiceParams): Promise<CompanyWithMetadata | null> {
    try {
      console.log('CompanyService: Creating new company:', companyData.name);
      
      if (!companyData.name) {
        const error = new Error('Company name is required');
        console.error('CompanyService:', error);
        throw error;
      }
      
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
          description: companyData.description,
          subscription_tier: companyData.subscription_tier || 'basic',
          trial_status: 'active',
          trial_period: 30
        }])
        .select()
        .single();

      if (error) {
        console.error('CompanyService: Error creating company in Supabase:', error);
        throw error;
      }

      if (!data) {
        console.error('CompanyService: Company creation returned no data');
        throw new Error('No data returned from company creation');
      }

      console.log('CompanyService: Company created successfully:', data.id);
      
      return {
        ...data,
        technicianCount: 0,
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('CompanyService: Error in createCompany:', error);
      throw error;
    }
  },

  // Update an existing company
  async updateCompany(id: string, companyData: Partial<CompanyServiceParams>): Promise<CompanyWithMetadata | null> {
    try {
      console.log(`CompanyService: Updating company with ID: ${id}`);
      const { data, error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('CompanyService: Error updating company:', error);
        throw error;
      }

      console.log('CompanyService: Company updated successfully');
      
      return {
        ...data,
        technicianCount: 0, // Will be populated in a more advanced implementation
        planName: data.subscription_tier || 'Basic'
      };
    } catch (error) {
      console.error('CompanyService: Error in updateCompany:', error);
      throw error;
    }
  },

  // Delete a company
  async deleteCompany(id: string): Promise<boolean> {
    try {
      console.log(`CompanyService: Deleting company with ID: ${id}`);
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('CompanyService: Error deleting company:', error);
        throw error;
      }

      console.log('CompanyService: Company deleted successfully');
      return true;
    } catch (error) {
      console.error('CompanyService: Error in deleteCompany:', error);
      throw error;
    }
  }
};
