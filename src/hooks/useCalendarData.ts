
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'repair' | 'maintenance' | 'appointment';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  customerName: string;
  address: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CalendarStats {
  todayJobs: number;
  weekJobs: number;
  overdueJobs: number;
  onTimeRate: number;
}

export function useCalendarData(selectedDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CalendarStats>({
    todayJobs: 0,
    weekJobs: 0,
    overdueJobs: 0,
    onTimeRate: 0
  });
  const { handleAsyncError } = useErrorHandler();

  const fetchEvents = async (date: Date) => {
    const result = await handleAsyncError(async () => {
      setIsLoading(true);
      
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      // Fetch repairs/appointments for the selected date using correct column names
      const { data: repairsData, error } = await supabase
        .from('repairs')
        .select(`
          *,
          customer:customers(first_name, last_name, email)
        `)
        .gte('scheduled_at', dayStart.toISOString())
        .lt('scheduled_at', dayEnd.toISOString())
        .order('scheduled_at');

      if (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }

      const formattedEvents: CalendarEvent[] = (repairsData || []).map(repair => {
        const scheduledAt = new Date(repair.scheduled_at);
        const estimatedDuration = typeof repair.estimated_duration === 'number' ? repair.estimated_duration : 60;
        
        return {
          id: repair.id,
          title: repair.diagnosis || `Repair Service`,
          description: repair.diagnosis || 'Repair service appointment',
          startTime: scheduledAt,
          endTime: new Date(scheduledAt.getTime() + (estimatedDuration * 60000)),
          type: 'repair' as const,
          status: repair.status as CalendarEvent['status'],
          customerName: repair.customer ? 
            `${repair.customer.first_name || ''} ${repair.customer.last_name || ''}`.trim() || 
            repair.customer.email || 'Unknown Customer' : 'Unknown Customer',
          address: 'Service Address',
          priority: (repair.priority as CalendarEvent['priority']) || 'medium'
        };
      });

      setEvents(formattedEvents);
      
      // Calculate stats
      const today = new Date();
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Fetch stats data
      const { data: statsData } = await supabase
        .from('repairs')
        .select('scheduled_at, status, completed_at, estimated_duration, actual_duration')
        .gte('scheduled_at', weekStart.toISOString())
        .lt('scheduled_at', weekEnd.toISOString());

      const todayEvents = (statsData || []).filter(repair => 
        new Date(repair.scheduled_at).toDateString() === today.toDateString()
      );

      const overdueEvents = (statsData || []).filter(repair => 
        new Date(repair.scheduled_at) < today && repair.status !== 'completed'
      );

      const completedOnTime = (statsData || []).filter(repair => {
        const actualDuration = typeof repair.actual_duration === 'number' ? repair.actual_duration : 0;
        const estimatedDuration = typeof repair.estimated_duration === 'number' ? repair.estimated_duration : 0;
        return repair.status === 'completed' && actualDuration <= estimatedDuration;
      });

      setStats({
        todayJobs: todayEvents.length,
        weekJobs: (statsData || []).length,
        overdueJobs: overdueEvents.length,
        onTimeRate: statsData && statsData.length > 0 
          ? Math.round((completedOnTime.length / statsData.length) * 100) 
          : 0
      });
      
      return formattedEvents;
    }, 'fetchCalendarEvents');
    
    setIsLoading(false);
    return result.data || [];
  };

  const startJob = async (eventId: string) => {
    await handleAsyncError(async () => {
      const { error } = await supabase
        .from('repairs')
        .update({ 
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'in_progress' as const }
          : event
      ));
    }, 'startJob');
  };

  const viewDetails = (eventId: string) => {
    console.log('Viewing details for event:', eventId);
    // Implement navigation to event details
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  return {
    events,
    isLoading,
    stats,
    startJob,
    viewDetails,
    refreshEvents: () => fetchEvents(selectedDate)
  };
}
