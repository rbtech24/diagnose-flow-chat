
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestVote } from "@/types/feature-request";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";
import { currentUser } from "@/data/mockTickets";
import { ArrowLeft } from "lucide-react";

export default function TechFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundRequest = mockFeatureRequests.find(request => request.id === id);
      setFeatureRequest(foundRequest || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleVote = (requestId: string) => {
    if (!featureRequest) return;
    
    const newVote: FeatureRequestVote = {
      id: `vote-${Date.now()}`,
      userId: currentUser.id,
      featureRequestId: requestId,
      createdAt: new Date(),
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role as "admin" | "company" | "tech", // Explicitly cast to union type
        avatarUrl: currentUser.avatarUrl,
      },
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
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role as "admin" | "company" | "tech", // Explicitly cast to union type
        avatarUrl: currentUser.avatarUrl,
      },
    };
    
    setFeatureRequest({
      ...featureRequest,
      comments: [...featureRequest.comments, newComment],
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
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Feature Request Not Found</h2>
          <p className="text-gray-500 mb-4">The feature request you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/tech/feature-requests")}>
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
        <Button variant="ghost" onClick={() => navigate("/tech/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
      </div>
      
      {featureRequest && (
        <FeatureRequestDetail
          featureRequest={featureRequest}
          onAddComment={handleAddComment}
          onVote={handleVote}
        />
      )}
    </div>
  );
}
