
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupportMetricsSummary {
  totalTickets: number;
  openTickets: number;
  avgResponseTime: number; // in minutes
  resolutionRate: number; // percentage
  customerSatisfaction: number; // average rating
  slaCompliance: number; // percentage
  ticketsByStatus: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  topAgents: Array<{
    id: string;
    name: string;
    tickets_resolved: number;
    avg_rating: number;
  }>;
}

export interface SupportMetricsTrend {
  date: string;
  tickets_created: number;
  tickets_resolved: number;
  avg_response_time: number;
}

export function useSupportMetrics(companyId?: string) {
  const [summary, setSummary] = useState<SupportMetricsSummary | null>(null);
  const [trends, setTrends] = useState<SupportMetricsTrend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch tickets summary
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('status, priority, created_at, assigned_to')
        .eq('company_id', companyId);

      if (ticketsError) throw ticketsError;

      // Calculate metrics from tickets data
      const totalTickets = tickets?.length || 0;
      const openTickets = tickets?.filter(t => t.status === 'open').length || 0;
      
      const ticketsByStatus = {
        open: tickets?.filter(t => t.status === 'open').length || 0,
        in_progress: tickets?.filter(t => t.status === 'in_progress').length || 0,
        resolved: tickets?.filter(t => t.status === 'resolved').length || 0,
        closed: tickets?.filter(t => t.status === 'closed').length || 0,
      };

      const ticketsByPriority = {
        low: tickets?.filter(t => t.priority === 'low').length || 0,
        medium: tickets?.filter(t => t.priority === 'medium').length || 0,
        high: tickets?.filter(t => t.priority === 'high').length || 0,
        urgent: tickets?.filter(t => t.priority === 'urgent').length || 0,
      };

      // Mock data for other metrics (would come from actual calculations)
      const mockSummary: SupportMetricsSummary = {
        totalTickets,
        openTickets,
        avgResponseTime: 45, // Mock: 45 minutes average
        resolutionRate: 85, // Mock: 85% resolution rate
        customerSatisfaction: 4.2, // Mock: 4.2/5 average rating
        slaCompliance: 92, // Mock: 92% SLA compliance
        ticketsByStatus,
        ticketsByPriority,
        topAgents: [
          { id: '1', name: 'John Doe', tickets_resolved: 24, avg_rating: 4.8 },
          { id: '2', name: 'Jane Smith', tickets_resolved: 18, avg_rating: 4.6 },
          { id: '3', name: 'Mike Johnson', tickets_resolved: 15, avg_rating: 4.4 },
        ],
      };

      setSummary(mockSummary);

      // Mock trend data (would come from time-series queries)
      const mockTrends: SupportMetricsTrend[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString(),
          tickets_created: Math.floor(Math.random() * 10) + 5,
          tickets_resolved: Math.floor(Math.random() * 8) + 3,
          avg_response_time: Math.floor(Math.random() * 30) + 30,
        };
      });

      setTrends(mockTrends);

    } catch (err) {
      console.error('Error fetching support metrics:', err);
      setError('Failed to load support metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchMetrics();
    }
  }, [companyId]);

  return {
    summary,
    trends,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}
