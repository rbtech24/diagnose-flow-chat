
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload";
import { ThemePreferences } from "@/components/profile/ThemePreferences";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { AccountDeletion } from "@/components/profile/AccountDeletion";

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  
  const handleUpdateProfile = (values: any) => {
    updateUser({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });
  };

  return (
    <div className="container mx-auto p-6 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account details and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <Card className="md:row-span-2 h-fit">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileImageUpload
              imageUrl={user?.avatarUrl || 'https://i.pravatar.cc/300'}
              onUpload={(url) => updateUser({ avatarUrl: url })}
            />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="profile" className="flex-1">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm 
              defaultValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                title: 'System Administrator',
              }}
              onSubmit={handleUpdateProfile}
              title="Personal Information"
              description="Update your personal details and contact information"
            />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Theme Preferences</CardTitle>
                <CardDescription>Customize the appearance of the admin dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemePreferences />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="md:col-start-2">
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Critical account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountDeletion />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
