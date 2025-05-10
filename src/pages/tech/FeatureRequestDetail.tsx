import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureRequestDetail } from "@/components/feature-request/FeatureRequestDetail";
import { FeatureRequest, FeatureComment, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TechFeatureRequestDetailPage() {
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(null);
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeatureRequest = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch the feature request
        const { data: requestData, error: requestError } = await supabase
          .from("feature_requests")
          .select("*")
          .eq("id", id)
          .single();

        if (requestError) {
          console.error("Error fetching feature request:", requestError);
          return;
        }

        // Fetch comments for this feature request
        const { data: commentsData, error: commentsError } = await supabase
          .from("feature_comments")
          .select("*")
          .eq("feature_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        }

        // Transform the data
        const formattedRequest: FeatureRequest = {
          id: requestData.id,
          title: requestData.title,
          description: requestData.description,
          status: requestData.status as FeatureRequestStatus,
          priority: requestData.priority as FeatureRequestPriority || "medium",
          company_id: requestData.company_id,
          user_id: requestData.user_id,
          created_at: requestData.created_at,
          updated_at: requestData.updated_at,
          votes_count: requestData.votes_count || 0,
          user_has_voted: requestData.user_has_voted || false,
          comments_count: requestData.comments_count || 0,
          created_by_user: requestData.created_by_user ? requestData.created_by_user : undefined
        };

        // Process comments and get author info for each
        const formattedComments: FeatureComment[] = [];
        
        for (const comment of commentsData || []) {
          // Try to get user profile info
          let userProfile;
          try {
            const { data: userData } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", comment.user_id)
              .single();
            
            userProfile = userData;
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
          
          formattedComments.push({
            id: comment.id,
            feature_id: comment.feature_id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            created_by_user: userProfile ? {
              name: userProfile.full_name || userProfile.name || "Unknown User",
              email: userProfile.email || "",
              avatar_url: userProfile.avatar_url,
              role: userProfile.role || "tech"
            } : undefined
          });
        }

        setFeatureRequest(formattedRequest);
        setComments(formattedComments);
      } catch (err) {
        console.error("Error in fetchFeatureRequest:", err);
        toast({
          title: "Error",
          description: "Failed to load feature request details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureRequest();
  }, [id, toast]);

  const handleVote = async (requestId: string) => {
    if (!featureRequest) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You need to be logged in to vote",
          variant: "destructive"
        });
        return;
      }

      // Check if user already voted
      const { data: existingVotes } = await supabase
        .from("feature_votes")
        .select("id")
        .eq("feature_id", requestId)
        .eq("user_id", userData.user.id)
        .single();

      if (existingVotes) {
        toast({
          description: "You've already voted for this feature",
        });
        return;
      }

      // Add vote
      const { error } = await supabase
        .from("feature_votes")
        .insert({
          feature_id: requestId,
          user_id: userData.user.id
        });

      if (error) {
        throw error;
      }

      // Update vote count in UI
      setFeatureRequest({
        ...featureRequest,
        votes_count: (featureRequest.votes_count || 0) + 1,
        user_has_voted: true
      });

      toast({
        description: "Vote added successfully",
      });
    } catch (err) {
      console.error("Error adding vote:", err);
      toast({
        title: "Error",
        description: "Failed to add your vote",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async (requestId: string, content: string): Promise<void> => {
    if (!featureRequest) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You need to be logged in to comment",
          variant: "destructive"
        });
        return Promise.reject("Not logged in");
      }

      // Add comment
      const { data, error } = await supabase
        .from("feature_comments")
        .insert({
          feature_id: requestId,
          user_id: userData.user.id,
          content: content
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      // Get user details
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      // Create new comment object with user details
      let newComment: FeatureComment = {
        id: data.id,
        feature_id: data.feature_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at
      };
      
      // Add user profile info if available
      if (userProfile) {
        newComment.created_by_user = {
          name: userProfile.full_name || userProfile.name || "Unknown User",
          email: userProfile.email || "",
          avatar_url: userProfile.avatar_url,
          role: userProfile.role || "tech"
        };
      }

      // Add to local state
      setComments(prevComments => [...prevComments, newComment]);
      
      // Update comment count
      setFeatureRequest({
        ...featureRequest,
        comments_count: (featureRequest.comments_count || 0) + 1
      });

      toast({
        description: "Comment added successfully",
      });

      return Promise.resolve();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive"
      });
      return Promise.reject(err);
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
          comments={comments}
          onAddComment={handleAddComment}
          onVote={handleVote}
        />
      )}
    </div>
  );
}
