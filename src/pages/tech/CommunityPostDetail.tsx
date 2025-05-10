import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader2, MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchCommunityPostById,
  addCommentToPost,
  markCommentAsAnswer,
  upvotePost,
  upvoteComment
} from "@/api/communityApi";
import { CommunityPost, CommunityComment } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";

export default function CommunityPostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await fetchCommunityPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, toast]);

  const handleAddComment = async () => {
    if (!id || !commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await addCommentToPost(id, commentText);
      
      // Update local state
      if (post) {
        setPost({
          ...post,
          comments: [...post.comments, newComment]
        });
      }
      
      setCommentText("");
      toast({
        description: "Comment added successfully"
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsAnswer = async (commentId: string) => {
    if (!id) return;
    
    try {
      await markCommentAsAnswer(id, commentId);
      
      // Update local state
      if (post) {
        const updatedComments = post.comments.map(comment => ({
          ...comment,
          isAnswer: comment.id === commentId
        }));
        
        setPost({
          ...post,
          isSolved: true,
          comments: updatedComments
        });
      }
      
      toast({
        description: "Comment marked as answer"
      });
    } catch (error) {
      console.error("Error marking as answer:", error);
      toast({
        title: "Error",
        description: "Failed to mark as answer",
        variant: "destructive"
      });
    }
  };

  const handleUpvotePost = async () => {
    if (!id || !userId) return;
    
    try {
      await upvotePost(id);
      
      // Update local state
      if (post) {
        setPost({
          ...post,
          upvotes: post.upvotes + 1
        });
      }
      
      toast({
        description: "Post upvoted"
      });
    } catch (error) {
      console.error("Error upvoting post:", error);
      toast({
        title: "Error",
        description: "Failed to upvote post",
        variant: "destructive"
      });
    }
  };

  const handleUpvoteComment = async (commentId: string) => {
    if (!userId) return;
    
    try {
      await upvoteComment(commentId);
      
      // Update local state
      if (post) {
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId ? { ...comment, upvotes: comment.upvotes + 1 } : comment
        );
        
        setPost({
          ...post,
          comments: updatedComments
        });
      }
      
      toast({
        description: "Comment upvoted"
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast({
        title: "Error",
        description: "Failed to upvote comment",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPostTypeDisplay = (type: string) => {
    switch (type) {
      case "question": return "Question";
      case "tech-sheet-request": return "Tech Sheet Request";
      case "wire-diagram-request": return "Wire Diagram Request";
      case "discussion": return "Discussion";
      default: return type;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "question": return "bg-blue-100 text-blue-800";
      case "tech-sheet-request": return "bg-purple-100 text-purple-800";
      case "wire-diagram-request": return "bg-green-100 text-green-800";
      case "discussion": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-gray-500 mb-4">The post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/tech/community")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/tech/community")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author?.avatarUrl} />
                  <AvatarFallback>
                    {post.author?.name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.author?.name || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPostTypeColor(post.type)}>
                  {getPostTypeDisplay(post.type)}
                </Badge>
                {post.isSolved && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Solved
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-2xl mt-4">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={handleUpvotePost}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.upvotes}</span>
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments.length} comments</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {post.comments.length > 0
                ? `${post.comments.length} ${post.comments.length === 1 ? "Comment" : "Comments"}`
                : "No Comments Yet"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className={`relative ${comment.isAnswer ? "border-l-4 border-green-500 pl-4" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author?.avatarUrl} />
                          <AvatarFallback>
                            {comment.author?.name?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{comment.author?.name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(new Date(comment.createdAt))}
                            </p>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleUpvoteComment(comment.id)}
                            >
                              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                              <span>{comment.upvotes}</span>
                            </Button>
                            
                            {post.type === "question" && !post.isSolved && comment.authorId !== userId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-muted-foreground hover:text-green-700"
                                onClick={() => handleMarkAsAnswer(comment.id)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                <span>Mark as Answer</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {comment.isAnswer && (
                        <Badge className="bg-green-100 text-green-800">
                          Best Answer
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Be the first to comment on this post
              </p>
            )}
            
            <Separator />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Add a Comment</h3>
              <Textarea
                placeholder="Write your comment..."
                className="min-h-[100px] mb-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} disabled={!commentText.trim() || isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
