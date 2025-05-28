
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  User, 
  Play,
  Eye
} from 'lucide-react';
import { CalendarEvent } from '@/hooks/useCalendarData';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onStartJob: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

export function CalendarEventCard({ event, onStartJob, onViewDetails }: CalendarEventCardProps) {
  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(event.status)}>
              {event.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(event.priority)}>
              {event.priority}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{event.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.address}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(event.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {event.status === 'scheduled' && (
            <Button
              size="sm"
              onClick={() => onStartJob(event.id)}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Start Job
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
