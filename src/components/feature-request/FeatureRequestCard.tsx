
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { format } from "date-fns";

export interface FeatureRequestCardProps {
  request: FeatureRequest;
  onVote?: () => void;
  currentUserId?: string;
}

export function FeatureRequestCard({ request, onVote, currentUserId }: FeatureRequestCardProps) {
  const statusColors: Record<string, string> = {
    "pending": "bg-yellow-100 text-yellow-800",
    "submitted": "bg-blue-100 text-blue-800",
    "approved": "bg-green-100 text-green-800",
    "in-progress": "bg-purple-100 text-purple-800",
    "in_progress": "bg-purple-100 text-purple-800",
    "completed": "bg-blue-100 text-blue-800",
    "rejected": "bg-red-100 text-red-800",
    "planned": "bg-green-100 text-green-800"
  };
  
  const priorityColors = {
    "low": "bg-gray-100 text-gray-800",
    "medium": "bg-blue-100 text-blue-800",
    "high": "bg-orange-100 text-orange-800",
    "critical": "bg-red-100 text-red-800"
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="hover:border-primary/50 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{request.title}</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusColors[request.status]}>
              {request.status === "in_progress" ? "In Progress" : 
               request.status === "in-progress" ? "In Progress" :
               request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={priorityColors[request.priority]}>
              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
            </Badge>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-2 mb-2">{request.description}</p>
        
        {request.created_by_user && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <span>Requested by {request.created_by_user.name || "User"}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            onClick={onVote}
            disabled={request.user_has_voted}
          >
            <ThumbsUp className={`h-4 w-4 ${request.user_has_voted ? 'text-blue-500' : ''}`} />
            <span>{request.votes_count}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{request.comments_count}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(request.created_at)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
