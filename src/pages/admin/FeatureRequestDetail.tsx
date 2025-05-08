
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestStatus, FeatureComment } from "@/types/feature-request";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatureRequest = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get the feature request
        const { data: requestData, error: requestError } = await supabase
          .from("feature_requests")
          .select(`
            *,
            created_by_user:created_by(name, email, avatar_url, role)
          `)
          .eq("id", id)
          .single();

        if (requestError) throw requestError;
        
        if (!requestData) {
          toast.error("Feature request not found");
          return;
        }

        // Get votes count
        const { count: votesCount, error: votesError } = await supabase
          .from("feature_votes")
          .select("*", { count: "exact", head: true })
          .eq("feature_id", id);

        if (votesError) throw votesError;
        
        // Check if current user has voted
        const { data: userSession } = await supabase.auth.getSession();
        const currentUserId = userSession?.session?.user?.id;
        
        let userHasVoted = false;
        if (currentUserId) {
          const { data: voteData } = await supabase
            .from("feature_votes")
            .select("*")
            .eq("feature_id", id)
            .eq("user_id", currentUserId)
            .maybeSingle();
            
          userHasVoted = !!voteData;
        }

        // Get comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("feature_comments")
          .select(`
            *,
            created_by_user:created_by(name, email, avatar_url, role)
          `)
          .eq("feature_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) throw commentsError;

        // Calculate comments count
        const commentsCount = commentsData?.length || 0;

        // Construct the feature request with additional data
        const featureRequestWithData = {
          ...requestData,
          votes_count: votesCount || 0,
          user_has_voted: userHasVoted,
          comments_count: commentsCount,
          priority: requestData.priority || "medium" // Ensure priority exists
        } as FeatureRequest;

        setFeatureRequest(featureRequestWithData);
        setComments(commentsData || []);
      } catch (error) {
        console.error("Error fetching feature request:", error);
        toast.error("Failed to load feature request details");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureRequest();
  }, [id]);

  const handleUpdateStatus = async (id: string, status: FeatureRequestStatus) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      
      if (featureRequest) {
        setFeatureRequest({
          ...featureRequest,
          status
        });
      }
      
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({ priority, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      
      if (featureRequest) {
        setFeatureRequest({
          ...featureRequest,
          priority
        });
      }
      
      toast.success(`Priority updated to ${priority}`);
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to update priority");
    }
  };

  const handleAddComment = async (featureId: string, content: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        toast.error("You must be logged in to add comments");
        return;
      }
      
      const { data: commentData, error } = await supabase
        .from("feature_comments")
        .insert({
          feature_id: featureId,
          content,
          created_by: userId
        })
        .select(`
          *,
          created_by_user:created_by(name, email, avatar_url, role)
        `)
        .single();
      
      if (error) throw error;
      
      setComments(prevComments => [...prevComments, commentData]);
      
      if (featureRequest) {
        setFeatureRequest({
          ...featureRequest,
          comments_count: (featureRequest.comments_count || 0) + 1
        });
      }
      
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
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
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
      </div>
      
      {featureRequest && (
        <FeatureRequestDetail
          featureRequest={featureRequest}
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          isAdmin={true}
        />
      )}
    </div>
  );
}
