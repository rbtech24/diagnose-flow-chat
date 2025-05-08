
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeatureRequestCardProps {
  featureRequest: FeatureRequest;
  onVote: (id: string) => void;
  onViewDetails: (id: string) => void;
  canVote?: boolean;
  onUpdateStatus?: (id: string, status: FeatureRequestStatus) => void;
}

export function FeatureRequestCard({ 
  featureRequest, 
  onVote, 
  onViewDetails, 
  canVote = true,
  onUpdateStatus
}: FeatureRequestCardProps) {
  const statusColors: Record<FeatureRequestStatus, string> = {
    "pending": "bg-yellow-100 text-yellow-800",
    "approved": "bg-blue-100 text-blue-800",
    "rejected": "bg-red-100 text-red-800",
    "in-progress": "bg-purple-100 text-purple-800",
    "completed": "bg-green-100 text-green-800"
  };

  const priorityColors = {
    "low": "bg-gray-100 text-gray-800",
    "medium": "bg-blue-100 text-blue-800",
    "high": "bg-orange-100 text-orange-800",
    "critical": "bg-red-100 text-red-800"
  };

  const handleStatusChange = (status: FeatureRequestStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(featureRequest.id, status);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{featureRequest.title}</h3>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(featureRequest.created_at), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="flex gap-2 flex-col items-end">
            <Badge className={priorityColors[featureRequest.priority as keyof typeof priorityColors]}>
              {featureRequest.priority}
            </Badge>
            
            {onUpdateStatus ? (
              <Select 
                value={featureRequest.status} 
                onValueChange={(value) => handleStatusChange(value as FeatureRequestStatus)}
              >
                <SelectTrigger className={`h-7 text-xs w-[140px] ${statusColors[featureRequest.status as FeatureRequestStatus]}`}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={statusColors[featureRequest.status as FeatureRequestStatus]}>
                {featureRequest.status.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-2">{featureRequest.description}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className="font-medium">Requested by:</span>
          <span className="ml-1">{featureRequest.created_by_user?.name || "Unknown"}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); onVote(featureRequest.id); }}
            disabled={!canVote || featureRequest.user_has_voted}
            className="flex items-center gap-1"
          >
            <ArrowUp className={`h-4 w-4 ${featureRequest.user_has_voted ? "text-primary" : ""}`} />
            <span>{featureRequest.votes_count || 0}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{featureRequest.comments_count || 0}</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewDetails(featureRequest.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
