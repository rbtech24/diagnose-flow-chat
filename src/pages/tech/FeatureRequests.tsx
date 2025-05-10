
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";

export default function TechFeatureRequests() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatureRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("feature_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to a safe format
        const formattedRequests: FeatureRequest[] = data.map(request => {
          // Make sure created_by_user has the right shape
          let createdByUser = {
            name: 'Unknown User',
            email: '',
            role: 'tech' as "admin" | "company" | "tech",
            avatar_url: undefined
          };

          if (typeof request.created_by_user === 'object' && request.created_by_user !== null) {
            const user = request.created_by_user;
            
            if (typeof user === 'object') {
              // Validate the user role is one of the valid values
              let userRole: "admin" | "company" | "tech" = 'tech';
              
              if (typeof user.role === 'string') {
                if (user.role === 'admin' || user.role === 'company' || user.role === 'tech') {
                  userRole = user.role as "admin" | "company" | "tech";
                }
              }
              
              createdByUser = {
                name: 'name' in user ? String(user.name) : 
                     ('full_name' in user ? String(user.full_name) : 'Unknown User'),
                email: 'email' in user ? String(user.email) : '',
                role: userRole,
                avatar_url: 'avatar_url' in user ? String(user.avatar_url) : undefined
              };
            }
          }

          return {
            id: request.id,
            title: request.title,
            description: request.description,
            status: (request.status || 'pending') as FeatureRequestStatus,
            priority: (request.priority || 'medium') as FeatureRequestPriority,
            company_id: request.company_id,
            user_id: request.user_id || '',
            created_at: request.created_at,
            updated_at: request.updated_at,
            votes_count: request.votes_count || 0,
            user_has_voted: request.user_has_voted || false,
            comments_count: request.comments_count || 0,
            created_by_user: createdByUser
          };
        });

        setFeatureRequests(formattedRequests);
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

    fetchFeatureRequests();
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
