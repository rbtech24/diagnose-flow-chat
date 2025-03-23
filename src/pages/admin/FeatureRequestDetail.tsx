
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestVote, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";
import { placeholderUser } from "@/utils/placeholderData";
import { ArrowLeft, FileX } from "lucide-react";

export default function AdminFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // This would be replaced with a real API call
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch data from the server
      // Since we're showing empty states, just set to null after loading
      setFeatureRequest(null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleVote = (requestId: string) => {
    if (!featureRequest) return;
    
    const newVote: FeatureRequestVote = {
      id: `vote-${Date.now()}`,
      userId: placeholderUser.id,
      featureRequestId: requestId,
      createdAt: new Date(),
      user: placeholderUser
    };
    
    setFeatureRequest({
      ...featureRequest,
      score: featureRequest.score + 1,
      votes: [...featureRequest.votes, newVote],
    });
  };

  const handleAddComment = (requestId: string, content: string) => {
    if (!featureRequest) return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      featureRequestId: requestId,
      content,
      createdAt: new Date(),
      createdBy: placeholderUser
    };
    
    setFeatureRequest({
      ...featureRequest,
      comments: [...featureRequest.comments, newComment],
    });
  };

  const handleStatusChange = (requestId: string, status: FeatureRequestStatus) => {
    if (!featureRequest) return;

    setFeatureRequest({
      ...featureRequest,
      status,
      updatedAt: new Date()
    });
  };

  const handlePriorityChange = (requestId: string, priority: FeatureRequestPriority) => {
    if (!featureRequest) return;

    setFeatureRequest({
      ...featureRequest,
      priority,
      updatedAt: new Date()
    });
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
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/admin/feature-requests")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feature Requests
          </Button>
        </div>
        
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Feature Request Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">The feature request you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/admin/feature-requests")}>
            View All Feature Requests
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
          onAddComment={handleAddComment}
          onVote={handleVote}
          onStatusChange={handleStatusChange}
          onUpdatePriority={handlePriorityChange}
          isAdmin={true}
        />
      )}
    </div>
  );
}
