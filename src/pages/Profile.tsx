
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserStats } from "@/components/profile/UserStats";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const handleImageUpdate = async (url: string) => {
    try {
      await updateUser({ avatarUrl: url });
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-center">Please sign in to view your profile.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <UserProfileHeader user={user} />
      <UserStats user={user} />
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="avatar">Profile Image</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ProfileDetailsForm />
        </TabsContent>
        
        <TabsContent value="avatar">
          <Card className="p-6">
            <div className="max-w-md mx-auto">
              <ProfileImageUpload
                currentImageUrl={user.avatarUrl}
                onImageUpdate={handleImageUpdate}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="p-6">
            <p className="text-center text-gray-500">
              Preference settings coming soon! Here you'll be able to customize notification 
              preferences, theme settings, and more.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
