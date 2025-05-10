
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NewCommunityPostForm } from "@/components/community/NewCommunityPostForm";
import { CommunityPostType } from "@/types/community";

export default function NewCommunityPost() {
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
          description: "You need to be logged in to create a post",
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

      // Upload attachments if any
      const attachments = [];
      if (values.attachments && values.attachments.length > 0) {
        for (const file of values.attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `community-posts/${userData.user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            continue;
          }
          
          const { data: fileUrl } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);
            
          attachments.push({
            fileName: file.name,
            fileUrl: fileUrl.publicUrl,
            fileType: file.type,
            fileSize: file.size,
            uploadedBy: userData.user.id
          });
        }
      }

      // Add community post
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          title: values.title,
          content: values.content,
          type: values.type as CommunityPostType,
          user_id: userData.user.id,
          tags: values.tag ? [values.tag] : [],
          attachments: attachments,
          author: userDetails ? {
            name: userDetails.full_name || "Unknown User",
            email: userDetails.phone_number || "",  // Using phone_number as fallback since email field may not exist
            avatar_url: userDetails.avatar_url,
            role: userDetails.role || "tech"
          } : null
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully"
      });

      navigate(`/tech/community/${data[0].id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/tech/community")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Community Post</h1>
        <div className="border rounded-lg p-6">
          <NewCommunityPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
