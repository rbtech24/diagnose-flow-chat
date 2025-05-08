
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FeatureRequestDetailAdmin } from "@/components/feature-request/FeatureRequestDetailAdmin";
import { FeatureComment, FeatureRequestStatus } from "@/types/feature-request";
import { 
  fetchFeatureRequestById, 
  fetchFeatureComments, 
  voteForFeature, 
  addFeatureComment,
  updateFeatureRequest 
} from "@/api/featureRequestsApi";

export default function AdminFeatureRequestDetail() {
  const [featureRequest, setFeatureRequest] = useState<any | null>(null);
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      setLoading(true);
      try {
        const request = await fetchFeatureRequestById(id);
        setFeatureRequest(request);
        
        const commentsList = await fetchFeatureComments(id);
        setComments(commentsList);
      } catch (error) {
        console.error("Error loading feature request data:", error);
        toast({
          title: "Error",
          description: "Failed to load feature request details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [id, toast]);

  const handleVote = async (requestId: string) => {
    if (!featureRequest) return;
    
    try {
      const result = await voteForFeature(requestId);
      
      if (result) {
        setFeatureRequest({
          ...featureRequest,
          votes_count: featureRequest.votes_count + 1,
          user_has_voted: true
        });
        
        toast({
          description: "Your vote has been recorded",
        });
      } else {
        toast({
          description: "You have already voted for this feature",
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to register your vote.",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async (featureId: string, content: string): Promise<void> => {
    if (!featureRequest) return;
    
    setSubmitting(true);
    try {
      const newComment = await addFeatureComment({
        feature_id: featureId,
        content
      });
      
      setComments(prevComments => [...prevComments, newComment]);
      
      toast({
        description: "Your comment has been added",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateStatus = async (id: string, status: FeatureRequestStatus): Promise<void> => {
    try {
      const updatedRequest = await updateFeatureRequest(id, { status });
      setFeatureRequest({
        ...featureRequest,
        status: updatedRequest.status
      });
      
      toast({
        description: `Status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdatePriority = async (id: string, priority: string): Promise<void> => {
    try {
      const updatedRequest = await updateFeatureRequest(id, { priority });
      setFeatureRequest({
        ...featureRequest,
        priority: updatedRequest.priority
      });
      
      toast({
        description: `Priority updated to ${priority}`,
      });
    } catch (error) {
      console.error("Error updating priority:", error);
      toast({
        title: "Error",
        description: "Failed to update priority.",
        variant: "destructive"
      });
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
      
      <FeatureRequestDetailAdmin
        featureRequest={featureRequest}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        isAdmin={true}
      />
    </div>
  );
}
