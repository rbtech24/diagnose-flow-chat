
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureComment } from "@/types/feature-request";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchFeatureRequestById, fetchFeatureComments, voteForFeature, addFeatureComment } from "@/api/featureRequestsApi";
import { useToast } from "@/components/ui/use-toast";

export default function CompanyFeatureRequestDetailPage() {
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

  const handleAddComment = async (requestId: string, content: string): Promise<void> => {
    if (!featureRequest) return;
    
    setSubmitting(true);
    try {
      const newComment = await addFeatureComment({
        feature_id: requestId,
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
          <Button onClick={() => navigate("/company/feature-requests")}>
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
        <Button variant="ghost" onClick={() => navigate("/company/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
      </div>
      
      {featureRequest && (
        <FeatureRequestDetail
          featureRequest={featureRequest}
          comments={comments}
          onAddComment={handleAddComment}
          onVote={handleVote}
        />
      )}
    </div>
  );
}
