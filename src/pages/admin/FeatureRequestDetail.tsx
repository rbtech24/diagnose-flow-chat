
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority, FeatureComment } from "@/types/feature-request";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function AdminFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchFeatureRequestDetails();
    }
  }, [id]);

  const fetchFeatureRequestDetails = async () => {
    try {
      setLoading(true);
      
      // Get feature request details
      const { data: requestData, error: requestError } = await supabase
        .from("feature_requests")
        .select(`
          *,
          created_by_user:created_by(id, name, email, avatar_url, role)
        `)
        .eq("id", id)
        .single();
        
      if (requestError) throw requestError;
      
      // Get votes count
      const { count: votesCount, error: votesError } = await supabase
        .from("feature_votes")
        .select("id", { count: true, head: true })
        .eq("feature_id", id);
        
      if (votesError) throw votesError;
      
      // Get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("feature_comments")
        .select(`
          *,
          created_by_user:created_by(id, name, email, avatar_url, role)
        `)
        .eq("feature_id", id)
        .order("created_at", { ascending: true });
        
      if (commentsError) throw commentsError;
      
      // Check if current user has voted
      const { data: userData } = await supabase.auth.getUser();
      let userHasVoted = false;
      
      if (userData?.user) {
        const { data: userVote } = await supabase
          .from("feature_votes")
          .select("id")
          .eq("feature_id", id)
          .eq("user_id", userData.user.id)
          .maybeSingle();
          
        userHasVoted = !!userVote;
      }

      // Build the request object with all the data we need
      const featureRequestWithMetadata = {
        ...requestData,
        votes_count: votesCount || 0,
        comments_count: commentsData?.length || 0,
        user_has_voted: userHasVoted
      };
      
      setFeatureRequest(featureRequestWithMetadata as FeatureRequest);
      setComments(commentsData || []);
    } catch (err) {
      console.error("Error fetching feature request:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feature request details."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: FeatureRequestStatus) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);
        
      if (error) throw error;
      
      setFeatureRequest(prev => prev ? { 
        ...prev, 
        status, 
        updated_at: new Date().toISOString()
      } : null);
      
      toast({
        title: "Status updated",
        description: `Feature request status changed to ${status}`
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update feature request status."
      });
    }
  };

  const handleUpdatePriority = async (requestId: string, priority: string) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({
          priority,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);
        
      if (error) throw error;
      
      setFeatureRequest(prev => prev ? {
        ...prev,
        priority: priority as FeatureRequestPriority,
        updated_at: new Date().toISOString(),
      } : null);
      
      toast({
        title: "Priority updated",
        description: `Feature request priority changed to ${priority}`
      });
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update feature request priority."
      });
    }
  };

  const handleAddComment = async (requestId: string, content: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const { data: newComment, error } = await supabase
        .from("feature_comments")
        .insert({
          feature_id: requestId,
          content,
          created_by: userData.user.id
        })
        .select(`
          *,
          created_by_user:created_by(id, name, email, avatar_url, role)
        `)
        .single();
        
      if (error) throw error;
      
      // Update local state
      setComments(prev => [...prev, newComment as FeatureComment]);
      setFeatureRequest(prev => prev ? {
        ...prev,
        comments_count: (prev.comments_count || 0) + 1,
        updated_at: new Date().toISOString()
      } : null);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added to the feature request."
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        variant: "destructive",
        title: "Comment failed",
        description: "Failed to add your comment."
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading feature request details...</span>
        </div>
      </div>
    );
  }

  if (!featureRequest) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Feature Request Not Found</h2>
          <p className="text-gray-500 mb-4">The feature request you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/admin/feature-requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feature Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate("/admin/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
        
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500 mr-2">Status:</span>
            <Select
              value={featureRequest?.status}
              onValueChange={(value) => handleUpdateStatus(featureRequest?.id || "", value as FeatureRequestStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 mr-2">Priority:</span>
            <Select
              value={featureRequest?.priority}
              onValueChange={(value) => handleUpdatePriority(featureRequest?.id || "", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      {featureRequest && (
        <FeatureRequestDetail
          featureRequest={featureRequest}
          comments={comments}
          onAddComment={handleAddComment}
          isAdmin={true}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
        />
      )}
    </div>
  );
}
