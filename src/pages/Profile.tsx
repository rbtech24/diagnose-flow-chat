
import { useEffect, useState } from "react";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm";
import { UserProfileHeader } from "@/components/profile/UserProfileHeader";
import { UserStats } from "@/components/profile/UserStats";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { user, updateUser, isLoading } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      setIsProfileLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleImageUpdate = async (url: string) => {
    try {
      await updateUser({ avatarUrl: url });
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-center text-gray-600">Loading your profile...</p>
        </Card>
      </div>
    );
  }

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
      {isProfileLoading ? (
        <div className="space-y-4">
          <div className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
      ) : (
        <>
          <UserProfileHeader user={user} />
          <UserStats user={user} />
        </>
      )}
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="avatar">Profile Image</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {isProfileLoading ? (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="h-10 bg-gray-100 animate-pulse rounded w-1/3"></div>
                <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-10 bg-gray-100 animate-pulse rounded w-1/2"></div>
              </div>
            </Card>
          ) : (
            <ProfileDetailsForm />
          )}
        </TabsContent>
        
        <TabsContent value="avatar">
          <Card className="p-6">
            <div className="max-w-md mx-auto">
              {isProfileLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-32 w-32 bg-gray-100 animate-pulse rounded-full"></div>
                  <div className="h-10 bg-gray-100 animate-pulse rounded w-1/2"></div>
                </div>
              ) : (
                <ProfileImageUpload
                  currentImageUrl={user.avatarUrl}
                  onImageUpdate={handleImageUpdate}
                />
              )}
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
