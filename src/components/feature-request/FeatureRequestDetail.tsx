
import { useState } from "react";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ArrowUp, MessageSquare, Send, Calendar } from "lucide-react";
import { format } from "date-fns";

interface FeatureRequestDetailProps {
  featureRequest: FeatureRequest;
  onAddComment: (id: string, content: string) => void;
  onVote: (id: string) => void;
  onUpdateStatus?: (id: string, status: FeatureRequestStatus) => void;
  onUpdatePriority?: (id: string, priority: string) => void;
  isAdmin?: boolean;
}

export function FeatureRequestDetail({
  featureRequest,
  onAddComment,
  onVote,
  onUpdateStatus,
  onUpdatePriority,
  isAdmin = false,
}: FeatureRequestDetailProps) {
  const [comment, setComment] = useState("");
  
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

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(featureRequest.id, comment);
      setComment("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
            <div>
              <h2 className="text-2xl font-bold">{featureRequest.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <User className="h-4 w-4" /> 
                <span>Requested by {featureRequest.createdBy.name}</span>
                <Calendar className="h-4 w-4 ml-2" />
                <span>{format(new Date(featureRequest.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {isAdmin ? (
                <Select 
                  defaultValue={featureRequest.status}
                  onValueChange={(value) => onUpdateStatus && onUpdateStatus(featureRequest.id, value as FeatureRequestStatus)}
                >
                  <SelectTrigger className="w-[140px]">
                    <Badge className={statusColors[featureRequest.status as FeatureRequestStatus]}>
                      {featureRequest.status.replace('-', ' ')}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={statusColors[featureRequest.status as FeatureRequestStatus]}>
                  {featureRequest.status.replace('-', ' ')}
                </Badge>
              )}
              
              {isAdmin ? (
                <Select 
                  defaultValue={featureRequest.priority}
                  onValueChange={(value) => onUpdatePriority && onUpdatePriority(featureRequest.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <Badge className={priorityColors[featureRequest.priority]}>
                      {featureRequest.priority}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={priorityColors[featureRequest.priority]}>
                  {featureRequest.priority}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{featureRequest.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onVote(featureRequest.id)}
                className="flex items-center gap-1"
              >
                <ArrowUp className="h-4 w-4" />
                <span>{featureRequest.score} Votes</span>
              </Button>
              
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{featureRequest.comments.length} Comments</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Comments</h3>
        
        {featureRequest.comments.length > 0 ? (
          <div className="space-y-4">
            {featureRequest.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.createdBy.name}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No comments yet
            </CardContent>
          </Card>
        )}
        
        <div className="mt-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment} disabled={!comment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
