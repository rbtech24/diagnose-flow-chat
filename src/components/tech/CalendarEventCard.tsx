
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  customer: string;
  location: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface CalendarEventCardProps {
  event: CalendarEvent;
  onStartJob: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

export function CalendarEventCard({ event, onStartJob, onViewDetails }: CalendarEventCardProps) {
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
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {event.customer}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(event.priority)}>
              {event.priority}
            </Badge>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {event.time} ({event.duration})
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(event.id)}>
              View Details
            </Button>
            {event.status === 'scheduled' && (
              <Button size="sm" onClick={() => onStartJob(event.id)}>
                Start Job
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
