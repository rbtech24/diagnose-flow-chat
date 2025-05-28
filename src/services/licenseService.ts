
import { supabase } from "@/integrations/supabase/client";
import { License, Payment } from "@/types/subscription-consolidated";

export interface LicenseCreateData {
  company_id: string;
  company_name?: string;
  plan_id: string;
  plan_name: string;
  active_technicians?: number;
  max_technicians: number;
  trial_period?: number;
}

export interface LicenseUpdateData {
  company_name?: string;
  plan_name?: string;
  status?: License['status'];
  active_technicians?: number;
  max_technicians?: number;
  end_date?: Date;
  trial_ends_at?: Date;
  next_payment?: Date;
}

export class LicenseService {
  static async getAllLicenses(): Promise<License[]> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          subscription_plans!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(license => ({
        id: license.id,
        company_id: license.company_id,
        company_name: license.company_name,
        plan_id: license.plan_id,
        plan_name: license.plan_name,
        status: license.status as License['status'],
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        nextPayment: license.next_payment ? new Date(license.next_payment) : undefined,
        activeTechnicians: license.active_technicians,
        maxTechnicians: license.max_technicians,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching all licenses:', error);
      throw error;
    }
  }

  static async getLicensesByCompany(companyId: string): Promise<License[]> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          subscription_plans!inner(name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(license => ({
        id: license.id,
        company_id: license.company_id,
        company_name: license.company_name,
        plan_id: license.plan_id,
        plan_name: license.plan_name,
        status: license.status as License['status'],
        startDate: new Date(license.start_date),
        endDate: license.end_date ? new Date(license.end_date) : undefined,
        trialEndsAt: license.trial_ends_at ? new Date(license.trial_ends_at) : undefined,
        nextPayment: license.next_payment ? new Date(license.next_payment) : undefined,
        activeTechnicians: license.active_technicians,
        maxTechnicians: license.max_technicians,
        createdAt: new Date(license.created_at),
        updatedAt: new Date(license.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching company licenses:', error);
      throw error;
    }
  }

  static async createLicense(licenseData: LicenseCreateData): Promise<License> {
    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + (licenseData.trial_period || 14));

      const { data, error } = await supabase
        .from('licenses')
        .insert({
          company_id: licenseData.company_id,
          company_name: licenseData.company_name,
          plan_id: licenseData.plan_id,
          plan_name: licenseData.plan_name,
          status: 'trial',
          active_technicians: licenseData.active_technicians || 0,
          max_technicians: licenseData.max_technicians,
          trial_ends_at: trialEndDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        status: data.status as License['status'],
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        activeTechnicians: data.active_technicians,
        maxTechnicians: data.max_technicians,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating license:', error);
      throw error;
    }
  }

  static async updateLicense(licenseId: string, updateData: LicenseUpdateData): Promise<License> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .update({
          company_name: updateData.company_name,
          plan_name: updateData.plan_name,
          status: updateData.status,
          active_technicians: updateData.active_technicians,
          max_technicians: updateData.max_technicians,
          end_date: updateData.end_date?.toISOString(),
          trial_ends_at: updateData.trial_ends_at?.toISOString(),
          next_payment: updateData.next_payment?.toISOString()
        })
        .eq('id', licenseId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        company_id: data.company_id,
        company_name: data.company_name,
        plan_id: data.plan_id,
        plan_name: data.plan_name,
        status: data.status as License['status'],
        startDate: new Date(data.start_date),
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
        nextPayment: data.next_payment ? new Date(data.next_payment) : undefined,
        activeTechnicians: data.active_technicians,
        maxTechnicians: data.max_technicians,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating license:', error);
      throw error;
    }
  }

  static async deleteLicense(licenseId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('licenses')
        .delete()
        .eq('id', licenseId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting license:', error);
      throw error;
    }
  }

  static async getLicensePayments(licenseId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('license_id', licenseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(payment => ({
        id: payment.id,
        license_id: payment.license_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status as Payment['status'],
        payment_date: new Date(payment.payment_date),
        payment_method: payment.payment_method || ''
      }));
    } catch (error) {
      console.error('Error fetching license payments:', error);
      throw error;
    }
  }

  static async createPayment(paymentData: {
    license_id: string;
    amount: number;
    currency?: string;
    payment_method?: string;
  }): Promise<Payment> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          license_id: paymentData.license_id,
          amount: paymentData.amount,
          currency: paymentData.currency || 'USD',
          payment_method: paymentData.payment_method,
          status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        license_id: data.license_id,
        amount: data.amount,
        currency: data.currency,
        status: data.status as Payment['status'],
        payment_date: new Date(data.payment_date),
        payment_method: data.payment_method || ''
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }
}
