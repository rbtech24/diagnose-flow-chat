
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { FeatureRequestStatus, FeatureRequestPriority } from "@/types/community";

export default function NewFeatureRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You need to be logged in to create a feature request",
          variant: "destructive"
        });
        return;
      }

      // Get user details
      const { data: userDetails } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

      // Add feature request
      const { data, error } = await supabase
        .from("feature_requests")
        .insert({
          title: values.title,
          description: values.description,
          status: "pending" as FeatureRequestStatus,
          priority: values.priority as FeatureRequestPriority || "medium",
          user_id: userData.user.id,
          created_by_user: userDetails ? {
            name: userDetails.full_name || "Unknown User",
            email: userDetails.phone_number || "", // Fallback as email doesn't exist in profile
            avatar_url: userDetails.avatar_url,
            role: userDetails.role && 
                ['tech', 'admin', 'company'].includes(userDetails.role) ? 
                userDetails.role as 'tech' | 'admin' | 'company' : 'tech'
          } : null
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feature request created successfully"
      });

      navigate(`/tech/feature-requests/${data[0].id}`);
    } catch (err) {
      console.error("Error creating feature request:", err);
      toast({
        title: "Error",
        description: "Failed to create feature request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/tech/feature-requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feature Requests
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Feature Request</h1>
        <div className="border rounded-lg p-6">
          <NewFeatureRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
