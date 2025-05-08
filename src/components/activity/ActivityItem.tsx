
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ReactNode } from "react";

interface ActivityItemProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
  type: string;
  severity: 'info' | 'warning' | 'error';
}

export function ActivityItem({
  title,
  description,
  timestamp,
  icon,
  type,
  severity
}: ActivityItemProps) {
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'info': 
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'warning': 
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'error': 
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return "Unknown date";
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
      <div className={`mt-1 rounded-full p-2 ${severity === 'error' ? 'bg-red-100' : severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h4 className="font-medium">{title}</h4>
          <span className="text-xs text-gray-500">{formatDate(timestamp)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <div className="mt-2">
          <Badge variant="secondary" className={getSeverityClass(severity)}>
            {type}
          </Badge>
        </div>
      </div>
    </div>
  );
}
