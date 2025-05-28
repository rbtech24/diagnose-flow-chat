
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  title: string;
  customer: string;
  location: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  date: Date;
  customerId?: string;
  description?: string;
}

export function useCalendarData(selectedDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayJobs: 0,
    weekJobs: 0,
    overdueJobs: 0,
    onTimeRate: 94
  });

  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate]);

  const fetchCalendarData = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoading(false);
        return;
      }

      // Get the date range for the selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Query repairs for the selected date
      const { data: repairData, error } = await supabase
        .from('repairs')
        .select(`
          *,
          customers(first_name, last_name, service_addresses)
        `)
        .eq('technician_id', userData.user.id)
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
        .order('scheduled_at', { ascending: true });

      if (error) {
        console.error('Error fetching calendar data:', error);
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // Transform repair data to calendar events
      const transformedEvents: CalendarEvent[] = (repairData || []).map(repair => {
        const scheduledTime = new Date(repair.scheduled_at);
        const customer = repair.customers 
          ? `${repair.customers.first_name || ''} ${repair.customers.last_name || ''}`.trim()
          : 'Unknown Customer';
        
        const serviceAddress = repair.customers?.service_addresses?.[0];
        const location = serviceAddress 
          ? `${serviceAddress.street || ''}, ${serviceAddress.city || ''}`.trim()
          : 'No address provided';

        return {
          id: repair.id,
          title: `Repair Service - ${repair.diagnosis || 'General Repair'}`,
          customer,
          location,
          time: scheduledTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          duration: repair.estimated_duration || '2h',
          status: repair.status as CalendarEvent['status'],
          priority: repair.priority as CalendarEvent['priority'] || 'medium',
          date: scheduledTime,
          customerId: repair.customer_id,
          description: repair.notes
        };
      });

      setEvents(transformedEvents);
      
      // Calculate stats
      await calculateStats(userData.user.id);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = async (technicianId: string) => {
    try {
      const today = new Date();
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Today's jobs
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      const { data: todayJobs } = await supabase
        .from('repairs')
        .select('id')
        .eq('technician_id', technicianId)
        .gte('scheduled_at', todayStart.toISOString())
        .lte('scheduled_at', todayEnd.toISOString());

      // Week's jobs
      const { data: weekJobs } = await supabase
        .from('repairs')
        .select('id')
        .eq('technician_id', technicianId)
        .gte('scheduled_at', weekStart.toISOString())
        .lte('scheduled_at', weekEnd.toISOString());

      // Overdue jobs
      const { data: overdueJobs } = await supabase
        .from('repairs')
        .select('id')
        .eq('technician_id', technicianId)
        .eq('status', 'scheduled')
        .lt('scheduled_at', today.toISOString());

      // On-time rate calculation
      const { data: completedJobs } = await supabase
        .from('repairs')
        .select('scheduled_at, completed_at')
        .eq('technician_id', technicianId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      let onTimeCount = 0;
      const totalCompleted = completedJobs?.length || 0;

      if (completedJobs) {
        onTimeCount = completedJobs.filter(job => {
          const scheduled = new Date(job.scheduled_at);
          const completed = new Date(job.completed_at);
          const scheduledEndOfDay = new Date(scheduled);
          scheduledEndOfDay.setHours(23, 59, 59, 999);
          return completed <= scheduledEndOfDay;
        }).length;
      }

      const onTimeRate = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 100;

      setStats({
        todayJobs: todayJobs?.length || 0,
        weekJobs: weekJobs?.length || 0,
        overdueJobs: overdueJobs?.length || 0,
        onTimeRate
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats({
        todayJobs: 0,
        weekJobs: 0,
        overdueJobs: 0,
        onTimeRate: 100
      });
    }
  };

  const startJob = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ 
          status: 'in-progress',
          started_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Error starting job:', error);
        return;
      }

      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'in-progress' as const }
          : event
      ));
    } catch (error) {
      console.error('Error starting job:', error);
    }
  };

  const viewDetails = (eventId: string) => {
    // Navigate to repair details page
    window.location.href = `/tech/repairs/${eventId}`;
  };

  return {
    events,
    isLoading,
    stats,
    startJob,
    viewDetails,
    refreshData: fetchCalendarData
  };
}
