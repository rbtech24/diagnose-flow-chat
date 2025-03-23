
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Share2, Edit, Trash2, ArrowUp, MessageSquare, CheckCircle2, FileText, AlertTriangle, Ban } from "lucide-react";
import { CommunityPost, CommunityPostComment } from "@/types/community";
import { format } from "date-fns";

export interface CommunityPostDetailProps {
  post: CommunityPost;
  onBack: () => void;
  onAddComment: (postId: string, content: string, files: File[]) => void;
  onMarkAsAnswer?: (postId: string, commentId: string) => void;
  onUpvote?: (postId: string, commentId?: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showModeratorControls?: boolean;
}

export function CommunityPostDetail({
  post,
  onBack,
  onAddComment,
  onMarkAsAnswer,
  onUpvote,
  onEdit,
  onDelete,
  showModeratorControls = false
}: CommunityPostDetailProps) {
  const [comment, setComment] = useState("");
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    onAddComment(post.id, comment, commentFiles);
    setComment("");
    setCommentFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCommentFiles(Array.from(e.target.files));
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "question":
        return "bg-blue-100 text-blue-800";
      case "issue":
        return "bg-red-100 text-red-800";
      case "discussion":
        return "bg-purple-100 text-purple-800";
      case "announcement":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="p-0"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to posts
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getTypeStyle(post.type)}>
                  {post.type}
                </Badge>
                {post.tags?.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={post.author?.avatarUrl || ""} alt={post.author?.name || "Author"} />
                  <AvatarFallback>{post.author?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author?.name || "Unknown"}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{post.views} views</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {(onEdit && showModeratorControls) && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(post.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {(onDelete && showModeratorControls) && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
          
          {post.attachments && post.attachments.length > 0 && (
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Attachments</h3>
              <div className="space-y-2">
                {post.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {attachment.filename || `Attachment ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onUpvote && onUpvote(post.id)}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Upvote ({post.upvotes})
            </Button>
            
            <div className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment: CommunityPostComment) => (
              <Card key={comment.id} className={`${comment.isAnswer ? 'border-green-500 bg-green-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={comment.author?.avatarUrl || ""} />
                        <AvatarFallback>{comment.author?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author?.name || "Unknown"}</span>
                          {comment.isAnswer && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Answer
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {showModeratorControls && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {!comment.isAnswer && post.type === "question" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onMarkAsAnswer && onMarkAsAnswer(post.id, comment.id)}
                          >
                            Mark as answer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 prose prose-sm max-w-none">
                    <p>{comment.content}</p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between py-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onUpvote && onUpvote(post.id, comment.id)}
                  >
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Upvote ({comment.upvotes || 0})
                  </Button>
                  
                  {(showModeratorControls && !comment.isAnswer) && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-yellow-500">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Flag
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Ban className="h-4 w-4 mr-1" />
                        Hide
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <p className="text-gray-500">No comments yet. Be the first to add a comment.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Add a comment</h3>
        </CardHeader>
        <form onSubmit={handleSubmitComment}>
          <CardContent>
            <Textarea
              placeholder="Write your comment here..."
              className="min-h-32"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="mt-4">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="comment-files"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("comment-files")?.click()}
                className="text-sm"
              >
                Attach files
              </Button>
              
              {commentFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {commentFiles.length} file(s) selected
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!comment.trim()}>
              Submit comment
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
