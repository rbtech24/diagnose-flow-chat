
import { useState } from "react";
import { FeatureRequest, FeatureRequestStatus, FeatureComment, FeatureRequestPriority } from "@/types/feature-request";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ArrowUp, Calendar, Send } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface FeatureRequestDetailProps {
  featureRequest: FeatureRequest;
  comments: FeatureComment[];
  onAddComment: (id: string, content: string) => void;
  onUpdateStatus?: (id: string, status: FeatureRequestStatus) => void;
  onUpdatePriority?: (id: string, priority: string) => void;
  onVote?: (id: string) => void;
  isAdmin?: boolean;
}

export function FeatureRequestDetail({
  featureRequest,
  comments,
  onAddComment,
  onUpdateStatus,
  onUpdatePriority,
  onVote,
  isAdmin = false,
}: FeatureRequestDetailProps) {
  const [comment, setComment] = useState("");
  
  const statusColors: Record<FeatureRequestStatus, string> = {
    "pending": "bg-yellow-100 text-yellow-800",
    "submitted": "bg-yellow-100 text-yellow-800",
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
  
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
            <div>
              <h2 className="text-2xl font-bold">{featureRequest.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(featureRequest.created_at), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {featureRequest.created_by_user?.name || "Unknown User"}
                </div>
                <Badge variant="outline" className="font-normal">
                  {featureRequest.created_by_user?.role || "user"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <Badge className={statusColors[featureRequest.status as FeatureRequestStatus]}>
                {featureRequest.status.replace('-', ' ')}
              </Badge>
              {featureRequest.priority && (
                <Badge className={priorityColors[featureRequest.priority as keyof typeof priorityColors]}>
                  {featureRequest.priority}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                {featureRequest.votes_count || 0} votes
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none mt-4">
            <p className="whitespace-pre-line">{featureRequest.description}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-xl">Comments ({comments.length})</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.created_by_user?.avatar_url} alt={comment.created_by_user?.name || "User"} />
                  <AvatarFallback>{getInitials(comment.created_by_user?.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {comment.created_by_user?.name || "Unknown User"}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-normal">
                      {comment.created_by_user?.role || "user"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <p className="whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-4">
            <Textarea 
              placeholder="Add a comment..." 
              className="w-full min-h-[100px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
