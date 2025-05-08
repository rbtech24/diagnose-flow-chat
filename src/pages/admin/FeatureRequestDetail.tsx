
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestStatus, FeatureComment } from "@/types/feature-request";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";

export default function AdminFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatureRequest();
  }, [id]);
  
  const fetchFeatureRequest = async () => {
    if (!id) return;
      
    try {
      setLoading(true);
      
      // For development, use mock data
      const mockRequest = mockFeatureRequests.find(req => req.id === id);
      if (mockRequest) {
        setFeatureRequest(mockRequest);
        // Mock comments
        setComments([]);
        setLoading(false);
        return;
      } else {
        toast.error("Feature request not found");
        setFeatureRequest(null);
      }
    } catch (error) {
      console.error("Error fetching feature request:", error);
      toast.error("Failed to load feature request details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: FeatureRequestStatus) => {
    try {
      // For demo purposes, update the local state directly
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
      // For demo purposes, update the local state directly
      if (featureRequest) {
        setFeatureRequest({
          ...featureRequest,
          priority: priority as any
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
      // Create a new comment in local state
      const newComment: FeatureComment = {
        id: `comment-${Date.now()}`,
        feature_id: featureId,
        content,
        user_id: 'demo-user-id',
        created_at: new Date().toISOString(),
        created_by_user: {
          name: "Demo User",
          email: "demo@example.com",
          role: "admin",
        },
      };
      
      setComments(prevComments => [...prevComments, newComment]);
      
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
