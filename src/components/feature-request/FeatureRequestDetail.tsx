
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { FeatureRequest, FeatureComment } from "@/types/feature-request";

interface FeatureRequestDetailProps {
  featureRequest: FeatureRequest;
  comments: FeatureComment[];
  onAddComment: (requestId: string, content: string) => void;
  onVote: (requestId: string) => void;
}

export const FeatureRequestDetail: React.FC<FeatureRequestDetailProps> = ({
  featureRequest,
  comments,
  onAddComment,
  onVote,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(featureRequest.id, newComment);
    setNewComment("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <h1 className="text-3xl font-bold">{featureRequest.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(featureRequest.status)}>
              {featureRequest.status.replace("-", " ")}
            </Badge>
            {featureRequest.priority && (
              <Badge className={getPriorityColor(featureRequest.priority)}>
                {featureRequest.priority}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <span>Submitted by {featureRequest.created_by_user?.name || "Unknown"}</span>
          <span className="mx-2">•</span>
          <span>{new Date(featureRequest.created_at).toLocaleDateString()}</span>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <p className="whitespace-pre-wrap">{featureRequest.description}</p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant={featureRequest.user_has_voted ? "secondary" : "outline"}
            onClick={() => onVote(featureRequest.id)}
            className={`flex items-center gap-2 ${featureRequest.user_has_voted ? 'bg-primary/10' : ''}`}
            disabled={featureRequest.user_has_voted}
          >
            <ArrowBigUp className="h-5 w-5" />
            {featureRequest.votes_count || 0} Votes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {featureRequest.comments_count || comments.length} Comments
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        
        <div className="mb-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea 
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!newComment.trim()}>
                Add Comment
              </Button>
            </div>
          </form>
        </div>
        
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 bg-background">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.created_by_user?.avatar_url} alt={comment.created_by_user?.name || "User"} />
                    <AvatarFallback>
                      {comment.created_by_user?.name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{comment.created_by_user?.name || "Unknown User"}</span>
                      <span className="mx-2 text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};
