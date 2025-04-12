
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FeatureRequestCardProps {
  featureRequest?: FeatureRequest;
  onVote?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  canVote?: boolean;
  // For backwards compatibility
  request?: FeatureRequest;
  onClick?: () => void;
}

export function FeatureRequestCard({ 
  featureRequest,
  request, // For backward compatibility
  onVote = () => {}, 
  onViewDetails = () => {},
  onClick, // For backward compatibility
  canVote = true 
}: FeatureRequestCardProps) {
  // For backward compatibility
  const currentRequest = featureRequest || request;
  if (!currentRequest) {
    console.error("FeatureRequestCard: No feature request provided");
    return null;
  }

  const handleViewDetails = () => {
    if (onClick) {
      onClick();
    } else if (onViewDetails) {
      onViewDetails(currentRequest.id);
    }
  };

  const statusColors: Record<FeatureRequestStatus, string> = {
    "pending": "bg-yellow-100 text-yellow-800",
    "approved": "bg-blue-100 text-blue-800",
    "rejected": "bg-red-100 text-red-800",
    "in-progress": "bg-purple-100 text-purple-800",
    "completed": "bg-green-100 text-green-800",
    "planned": "bg-blue-100 text-blue-800",
    "implemented": "bg-green-100 text-green-800",
    "under-review": "bg-yellow-100 text-yellow-800"
  };

  const priorityColors = {
    "low": "bg-gray-100 text-gray-800",
    "medium": "bg-blue-100 text-blue-800",
    "high": "bg-orange-100 text-orange-800",
    "critical": "bg-red-100 text-red-800"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{currentRequest.title}</h3>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(currentRequest.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={statusColors[currentRequest.status]}>
              {currentRequest.status.replace('-', ' ')}
            </Badge>
            {currentRequest.priority && (
              <Badge className={priorityColors[currentRequest.priority]}>
                {currentRequest.priority}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-2">{currentRequest.description}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <span className="font-medium">Requested by:</span>
          <span className="ml-1">{currentRequest.createdBy?.name || "Unknown"}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onVote(currentRequest.id)}
            disabled={!canVote}
            className="flex items-center gap-1"
          >
            <ArrowUp className="h-4 w-4" />
            <span>{currentRequest.score}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{currentRequest.comments?.length || 0}</span>
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
