
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
      // For now, we'll use mock data since we don't have a repairs/appointments table
      // In a real implementation, this would query the database
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Washing Machine Repair',
          customer: 'John Smith',
          location: '123 Main St',
          time: '09:00',
          duration: '2h',
          status: 'scheduled',
          priority: 'high',
          date: new Date()
        },
        {
          id: '2',
          title: 'Dishwasher Installation',
          customer: 'Sarah Johnson',
          location: '456 Oak Ave',
          time: '14:00',
          duration: '1.5h',
          status: 'scheduled',
          priority: 'medium',
          date: new Date()
        }
      ];

      // Filter events for selected date
      const filteredEvents = mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });

      setEvents(filteredEvents);
      
      // Calculate stats
      const today = new Date();
      const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      setStats({
        todayJobs: mockEvents.filter(e => new Date(e.date).toDateString() === today.toDateString()).length,
        weekJobs: mockEvents.filter(e => {
          const eventDate = new Date(e.date);
          return eventDate >= weekStart && eventDate <= weekEnd;
        }).length,
        overdueJobs: mockEvents.filter(e => 
          new Date(e.date) < today && e.status === 'scheduled'
        ).length,
        onTimeRate: 94
      });
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startJob = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'in-progress' as const }
        : event
    ));
  };

  const viewDetails = (eventId: string) => {
    console.log('View details for event:', eventId);
    // Implement navigation to event details
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
