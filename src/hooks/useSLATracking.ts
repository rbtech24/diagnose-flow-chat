
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SLAPolicy {
  id: string;
  company_id: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  response_time: number; // in minutes
  resolution_time: number; // in minutes
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketSLATracking {
  id: string;
  ticket_id: string;
  sla_policy_id: string;
  response_due_at: string;
  resolution_due_at: string;
  first_response_at?: string;
  resolved_at?: string;
  response_sla_met?: boolean;
  resolution_sla_met?: boolean;
  created_at: string;
  sla_policy?: SLAPolicy;
}

export function useSLATracking(companyId?: string) {
  const [slaPolices, setSLAPolicies] = useState<SLAPolicy[]>([]);
  const [ticketSLAs, setTicketSLAs] = useState<TicketSLATracking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSLAPolicies = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sla_policies')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('priority');

      if (error) throw error;
      
      // Transform the data to match our interface types
      const policies: SLAPolicy[] = (data || []).map(policy => ({
        ...policy,
        priority: policy.priority as 'low' | 'medium' | 'high' | 'critical'
      }));
      
      setSLAPolicies(policies);
    } catch (err) {
      console.error('Error fetching SLA policies:', err);
      setError('Failed to load SLA policies');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketSLA = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_sla_tracking')
        .select(`
          *,
          sla_policy:sla_policies(*)
        `)
        .eq('ticket_id', ticketId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      console.error('Error fetching ticket SLA:', err);
      return null;
    }
  };

  const calculateSLAStatus = (slaTracking: TicketSLATracking) => {
    const now = new Date();
    const responseDue = new Date(slaTracking.response_due_at);
    const resolutionDue = new Date(slaTracking.resolution_due_at);

    const responseOverdue = !slaTracking.first_response_at && now > responseDue;
    const resolutionOverdue = !slaTracking.resolved_at && now > resolutionDue;

    let status = 'on-track';
    if (responseOverdue || resolutionOverdue) {
      status = 'breached';
    } else if (now > new Date(responseDue.getTime() - 30 * 60 * 1000)) { // 30 min warning
      status = 'at-risk';
    }

    return {
      status,
      responseOverdue,
      resolutionOverdue,
      responseTimeRemaining: Math.max(0, responseDue.getTime() - now.getTime()),
      resolutionTimeRemaining: Math.max(0, resolutionDue.getTime() - now.getTime()),
    };
  };

  const updateSLAPolicy = async (policyId: string, updates: Partial<SLAPolicy>) => {
    try {
      const { data, error } = await supabase
        .from('sla_policies')
        .update(updates)
        .eq('id', policyId)
        .select()
        .single();

      if (error) throw error;
      await fetchSLAPolicies();
      return data;
    } catch (err) {
      console.error('Error updating SLA policy:', err);
      throw new Error('Failed to update SLA policy');
    }
  };

  const createSLAPolicy = async (policyData: Omit<SLAPolicy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sla_policies')
        .insert({
          ...policyData,
          company_id: companyId,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchSLAPolicies();
      return data;
    } catch (err) {
      console.error('Error creating SLA policy:', err);
      throw new Error('Failed to create SLA policy');
    }
  };

  const markFirstResponse = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('ticket_sla_tracking')
        .update({ 
          first_response_at: new Date().toISOString(),
          response_sla_met: true 
        })
        .eq('ticket_id', ticketId)
        .is('first_response_at', null);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking first response:', err);
      throw new Error('Failed to mark first response');
    }
  };

  const markResolved = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('ticket_sla_tracking')
        .update({ 
          resolved_at: new Date().toISOString(),
          resolution_sla_met: true 
        })
        .eq('ticket_id', ticketId)
        .is('resolved_at', null);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking resolved:', err);
      throw new Error('Failed to mark resolved');
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchSLAPolicies();
    }
  }, [companyId]);

  return {
    slaPolices,
    ticketSLAs,
    isLoading,
    error,
    fetchSLAPolicies,
    fetchTicketSLA,
    calculateSLAStatus,
    updateSLAPolicy,
    createSLAPolicy,
    markFirstResponse,
    markResolved,
  };
}
