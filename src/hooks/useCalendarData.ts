
import { useState, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

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
      
      // Mock data for now - replace with actual API call
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'HVAC Repair - Smith Residence',
          description: 'Air conditioning unit not cooling properly',
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 0),
          type: 'repair',
          status: 'scheduled',
          customerName: 'John Smith',
          address: '123 Main St, Anytown, USA',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Routine Maintenance - Johnson Home',
          description: 'Quarterly HVAC system check',
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 30),
          type: 'maintenance',
          status: 'scheduled',
          customerName: 'Sarah Johnson',
          address: '456 Oak Ave, Anytown, USA',
          priority: 'medium'
        }
      ];

      // Filter events for selected date
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const filteredEvents = mockEvents.filter(event => 
        event.startTime >= dayStart && event.startTime < dayEnd
      );

      setEvents(filteredEvents);
      
      // Calculate stats
      const today = new Date();
      const todayEvents = mockEvents.filter(event => 
        event.startTime.toDateString() === today.toDateString()
      );
      
      setStats({
        todayJobs: todayEvents.length,
        weekJobs: mockEvents.length,
        overdueJobs: 0,
        onTimeRate: 95
      });
      
      return filteredEvents;
    }, 'fetchCalendarEvents');
    
    setIsLoading(false);
    return result.data || [];
  };

  const startJob = async (eventId: string) => {
    await handleAsyncError(async () => {
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'in_progress' }
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
