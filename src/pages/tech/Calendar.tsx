
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User,
  Plus,
  Filter
} from 'lucide-react';

interface ScheduledJob {
  id: string;
  title: string;
  customer: string;
  location: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const mockJobs: ScheduledJob[] = [
  {
    id: '1',
    title: 'Washing Machine Repair',
    customer: 'John Smith',
    location: '123 Main St',
    time: '09:00',
    duration: '2h',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Dishwasher Installation',
    customer: 'Sarah Johnson',
    location: '456 Oak Ave',
    time: '14:00',
    duration: '1.5h',
    status: 'scheduled',
    priority: 'medium'
  }
];

export default function TechCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs] = useState<ScheduledJob[]>(mockJobs);

  const todaysJobs = jobs.filter(job => {
    // In a real app, you'd filter by the selected date
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            {todaysJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No appointments scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaysJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {job.customer}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {job.time} ({job.duration})
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {job.status === 'scheduled' && (
                          <Button size="sm">
                            Start Job
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-sm text-gray-600">Today's Jobs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-sm text-gray-600">On-Time Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
