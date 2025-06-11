
import { supabase } from "@/integrations/supabase/client";
import { License } from "@/types/subscription-consolidated";

export class BillingCycleService {
  static async checkUpcomingRenewals(daysAhead: number = 7): Promise<License[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('status', 'active')
      .lte('next_payment', futureDate.toISOString())
      .gte('next_payment', new Date().toISOString());

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
  }

  static async processExpiredTrials(): Promise<void> {
    const now = new Date().toISOString();

    // Update trial licenses that have expired
    const { error } = await supabase
      .from('licenses')
      .update({ 
        status: 'expired',
        updated_at: now
      })
      .eq('status', 'trial')
      .lt('trial_ends_at', now);

    if (error) {
      console.error('Error processing expired trials:', error);
      throw error;
    }
  }

  static async sendRenewalNotifications(): Promise<void> {
    try {
      const upcomingRenewals = await this.checkUpcomingRenewals(3); // 3 days notice

      for (const license of upcomingRenewals) {
        // Create notification for the company
        await supabase
          .from('notifications')
          .insert({
            company_id: license.company_id,
            type: 'warning',
            title: 'Subscription Renewal Reminder',
            message: `Your ${license.plan_name} subscription will renew on ${license.nextPayment?.toLocaleDateString()}`,
          });
      }
    } catch (error) {
      console.error('Error sending renewal notifications:', error);
    }
  }

  static async handleFailedPayments(licenseIds: string[]): Promise<void> {
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3); // 3-day grace period

    for (const licenseId of licenseIds) {
      await supabase
        .from('licenses')
        .update({ 
          status: 'past_due',
          grace_period_end: gracePeriodEnd.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', licenseId);

      // Send notification
      const { data: license } = await supabase
        .from('licenses')
        .select('company_id, plan_name')
        .eq('id', licenseId)
        .single();

      if (license) {
        await supabase
          .from('notifications')
          .insert({
            company_id: license.company_id,
            type: 'error',
            title: 'Payment Failed',
            message: `Payment for your ${license.plan_name} subscription failed. Please update your payment method.`,
          });
      }
    }
  }

  static async suspendOverdueAccounts(): Promise<void> {
    const now = new Date().toISOString();

    // Suspend accounts that are past their grace period
    const { error } = await supabase
      .from('licenses')
      .update({ 
        status: 'suspended',
        updated_at: now
      })
      .eq('status', 'past_due')
      .lt('grace_period_end', now);

    if (error) {
      console.error('Error suspending overdue accounts:', error);
      throw error;
    }
  }
}
