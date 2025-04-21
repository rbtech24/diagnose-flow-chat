
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const handleImageUpdate = async (url: string) => {
    try {
      await updateUser({ avatarUrl: url });
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          <ProfileImageUpload
            currentImageUrl={user?.avatarUrl}
            onImageUpdate={handleImageUpdate}
          />
        </div>
        
        <div>
          <ProfileDetailsForm />
        </div>
      </div>
    </div>
  );
}
