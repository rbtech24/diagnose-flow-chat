import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeatureRequest, FeatureComment } from "@/types/feature-request";

export interface FeatureRequestDetailProps {
  featureRequest: FeatureRequest;
  comments: FeatureComment[];
  onAddComment: (featureId: string, content: string) => Promise<void>;
  onVote: (featureId: string) => void;
}

export const FeatureRequestDetail: React.FC<FeatureRequestDetailProps> = ({
  featureRequest,
  comments,
  onAddComment,
  onVote,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(featureRequest.id, commentText);
      setCommentText("");
    }
  };

  const handleVoteClick = () => {
    onVote(featureRequest.id);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{featureRequest.title}</h2>
        <p className="text-muted-foreground">{featureRequest.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {featureRequest.created_by_user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={featureRequest.created_by_user.avatar_url} alt={featureRequest.created_by_user.name} />
                <AvatarFallback>{featureRequest.created_by_user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-sm text-muted-foreground">
              {featureRequest.created_by_user?.name || "Unknown user"} • {new Date(featureRequest.created_at).toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleVoteClick} disabled={featureRequest.user_has_voted}>
            {featureRequest.user_has_voted ? "Voted" : "Vote"} ({featureRequest.votes_count})
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-medium mb-4">Comments</h3>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.created_by_user?.avatar_url} alt={comment.created_by_user?.name || "User"} />
                  <AvatarFallback>{comment.created_by_user?.name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.created_by_user?.name || "Unknown User"}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No comments yet.</p>
        )}

        <form onSubmit={handleSubmitComment} className="mt-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="resize-none"
            />
            <Button type="submit" disabled={!commentText.trim()}>
              Add Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
