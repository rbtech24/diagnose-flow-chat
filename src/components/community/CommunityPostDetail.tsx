
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ThumbsUp, MessageSquare, CheckCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isSolved: boolean;
  comments: CommentType[];
}

interface CommentType {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  upvotes: number;
  isAnswer: boolean;
}

interface CommunityPostDetailProps {
  post: CommunityPost;
  onBack: () => void;
  onAddComment: (postId: string, content: string, files: File[]) => Promise<any>;
  onMarkAsAnswer: (postId: string, commentId: string) => Promise<any>;
  onUpvote: (postId: string, commentId?: string) => Promise<any>;
}

export function CommunityPostDetail({
  post,
  onBack,
  onAddComment,
  onMarkAsAnswer,
  onUpvote
}: CommunityPostDetailProps) {
  const [newComment, setNewComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(post.id, newComment, files);
      setNewComment("");
      setFiles([]);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'question':
        return { label: 'Question', color: 'bg-blue-100 text-blue-800' };
      case 'tech-sheet-request':
        return { label: 'Tech Sheet Request', color: 'bg-green-100 text-green-800' };
      case 'wire-diagram-request':
        return { label: 'Wire Diagram Request', color: 'bg-amber-100 text-amber-800' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const typeInfo = getPostTypeLabel(post.type);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Community
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                {post.isSolved && (
                  <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Solved
                  </Badge>
                )}
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onUpvote(post.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {post.upvotes}
              </Button>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={post.author.avatarUrl} />
              <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')}</div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Responses ({post.comments.length})
        </h3>

        {post.comments.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <div className="text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No responses yet. Be the first to respond!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          post.comments.map(comment => (
            <Card key={comment.id} className={comment.isAnswer ? "border-green-500" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={comment.author.avatarUrl} />
                      <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  {comment.isAnswer && (
                    <Badge className="bg-green-100 text-green-800 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accepted Solution
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{comment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onUpvote(post.id, comment.id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.upvotes}
                </Button>
                {!post.isSolved && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => onMarkAsAnswer(post.id, comment.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Solution
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-md">Add a Response</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your response here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-32 mb-4"
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Response"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
