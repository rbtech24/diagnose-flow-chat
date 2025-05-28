
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarEventCard } from '@/components/tech/CalendarEventCard';
import { CalendarStats } from '@/components/tech/CalendarStats';
import { useCalendarData } from '@/hooks/useCalendarData';
import { 
  Calendar as CalendarIcon, 
  Plus,
  Filter
} from 'lucide-react';

export default function TechCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { events, isLoading, stats, startJob, viewDetails } = useCalendarData(selectedDate);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your scheduled appointments and jobs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Schedule for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    onStartJob={startJob}
                    onViewDetails={viewDetails}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-6">
        <CalendarStats
          todayJobs={stats.todayJobs}
          weekJobs={stats.weekJobs}
          overdueJobs={stats.overdueJobs}
          onTimeRate={stats.onTimeRate}
        />
      </div>
    </div>
  );
}
