
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";
import { fetchFeatureRequests } from "@/api/featureRequestsApi";

export default function TechFeatureRequests() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getFeatureRequests = async () => {
      try {
        setLoading(true);
        const data = await fetchFeatureRequests();
        setFeatureRequests(data);
      } catch (error) {
        console.error("Error fetching feature requests:", error);
        toast({
          title: "Error",
          description: "Failed to load feature requests",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    getFeatureRequests();
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feature Requests</h1>
        <Button asChild>
          <Link to="/tech/new-feature-request">Create New Request</Link>
        </Button>
      </div>

      {featureRequests.length === 0 ? (
        <div className="text-center p-10 border rounded-lg">
          <p className="text-lg text-gray-500">No feature requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {featureRequests.map((request) => (
            <Link
              to={`/tech/feature-requests/${request.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50"
              key={request.id}
            >
              <div className="flex justify-between">
                <h2 className="font-medium text-lg">{request.title}</h2>
                <div className="space-x-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {request.status}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {request.votes_count} votes
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{request.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  {request.comments_count || 0} comments
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
