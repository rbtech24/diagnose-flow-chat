
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";
import { currentUser } from "@/data/mockTickets";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminFeatureRequestDetailPage() {
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

  const handleUpdateStatus = (requestId: string, status: FeatureRequestStatus) => {
    if (!featureRequest) return;
    
    setFeatureRequest({
      ...featureRequest,
      status,
      updatedAt: new Date(),
    });
  };

  const handleUpdatePriority = (requestId: string, priority: string) => {
    if (!featureRequest) return;
    
    setFeatureRequest({
      ...featureRequest,
      priority: priority as FeatureRequestPriority,
      updatedAt: new Date(),
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
        role: currentUser.role,
        avatarUrl: currentUser.avatarUrl,
      },
    };
    
    setFeatureRequest({
      ...featureRequest,
      comments: [...featureRequest.comments, newComment],
    });
  };
  
  // Admin doesn't need voting functionality but we provide an empty function
  // to satisfy the component prop requirements
  const handleVote = (requestId: string) => {
    // Admin doesn't vote, this is just to satisfy the prop requirement
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
      <div className="mb-6 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate("/admin/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
        
        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500 mr-2">Status:</span>
            <Select
              value={featureRequest.status}
              onValueChange={(value) => handleUpdateStatus(featureRequest.id, value as FeatureRequestStatus)}
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
              value={featureRequest.priority}
              onValueChange={(value) => handleUpdatePriority(featureRequest.id, value)}
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
      
      <FeatureRequestDetail
        featureRequest={featureRequest}
        onAddComment={handleAddComment}
        onVote={handleVote}
      />
    </div>
  );
}
