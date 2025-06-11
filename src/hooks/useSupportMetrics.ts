
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupportMetrics {
  id: string;
  company_id: string;
  agent_id?: string;
  metric_date: string;
  tickets_handled: number;
  avg_response_time?: number;
  avg_resolution_time?: number;
  customer_satisfaction?: number;
  sla_compliance_rate?: number;
  created_at: string;
}

export interface MetricsSummary {
  totalTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  slaCompliance: number;
  customerSatisfaction: number;
  ticketsByStatus: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  agentPerformance: Array<{
    agent_id: string;
    agent_name: string;
    tickets_handled: number;
    avg_response_time: number;
    satisfaction_rating: number;
  }>;
}

export function useSupportMetrics(companyId?: string, dateRange?: { start: string; end: string }) {
  const [metrics, setMetrics] = useState<SupportMetrics[]>([]);
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('support_metrics')
        .select('*')
        .eq('company_id', companyId);

      if (dateRange) {
        query = query
          .gte('metric_date', dateRange.start)
          .lte('metric_date', dateRange.end);
      }

      const { data, error } = await query.order('metric_date', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = async () => {
    if (!companyId) return;

    try {
      // Get ticket counts by status
      const { data: statusData } = await supabase
        .from('support_tickets')
        .select('status')
        .eq('company_id', companyId);

      // Get ticket counts by priority
      const { data: priorityData } = await supabase
        .from('support_tickets')
        .select('priority')
        .eq('company_id', companyId);

      // Get agent performance data
      const { data: agentData } = await supabase
        .from('support_metrics')
        .select(`
          agent_id,
          tickets_handled,
          avg_response_time,
          customer_satisfaction,
          support_team_members!inner(name)
        `)
        .eq('company_id', companyId);

      // Calculate summary statistics
      const totalTickets = statusData?.length || 0;
      const avgResponseTime = metrics.reduce((sum, m) => sum + (m.avg_response_time || 0), 0) / metrics.length || 0;
      const avgResolutionTime = metrics.reduce((sum, m) => sum + (m.avg_resolution_time || 0), 0) / metrics.length || 0;
      const slaCompliance = metrics.reduce((sum, m) => sum + (m.sla_compliance_rate || 0), 0) / metrics.length || 0;
      const customerSatisfaction = metrics.reduce((sum, m) => sum + (m.customer_satisfaction || 0), 0) / metrics.length || 0;

      // Group tickets by status
      const ticketsByStatus = statusData?.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Group tickets by priority
      const ticketsByPriority = priorityData?.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Calculate agent performance
      const agentPerformance = agentData?.map(agent => ({
        agent_id: agent.agent_id || '',
        agent_name: (agent as any).support_team_members?.name || 'Unknown',
        tickets_handled: agent.tickets_handled,
        avg_response_time: agent.avg_response_time || 0,
        satisfaction_rating: agent.customer_satisfaction || 0,
      })) || [];

      setSummary({
        totalTickets,
        avgResponseTime,
        avgResolutionTime,
        slaCompliance,
        customerSatisfaction,
        ticketsByStatus,
        ticketsByPriority,
        agentPerformance,
      });
    } catch (err) {
      console.error('Error calculating summary:', err);
      setError('Failed to calculate metrics summary');
    }
  };

  const recordMetric = async (metricData: Omit<SupportMetrics, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('support_metrics')
        .insert({
          ...metricData,
          company_id: companyId,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchMetrics();
      return data;
    } catch (err) {
      console.error('Error recording metric:', err);
      throw new Error('Failed to record metric');
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchMetrics();
    }
  }, [companyId, dateRange]);

  useEffect(() => {
    if (metrics.length > 0) {
      calculateSummary();
    }
  }, [metrics]);

  return {
    metrics,
    summary,
    isLoading,
    error,
    fetchMetrics,
    calculateSummary,
    recordMetric,
  };
}
