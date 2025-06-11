
import { useState } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  
  // Use actual user data from auth context
  const [adminData, setAdminData] = useState({
    name: user?.name || "Super Admin",
    email: user?.email || "admin@repairautopilot.com",
    phone: "555-123-4567",
    title: "System Administrator",
    role: "Administrator",
    twoFactorEnabled: true,
    adminCount: 2,
    maxAdmins: 3
  });

  const handleProfileUpdate = (values: any) => {
    setAdminData({
      ...adminData,
      ...values
    });
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    if (updateUser) {
      await updateUser({ avatarUrl });
    }
  };

  const securityCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your account security settings and two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant={adminData.twoFactorEnabled ? "outline" : "default"}>
            {adminData.twoFactorEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
        
        <div className="pt-2">
          <Alert variant="default" className="bg-indigo-50 border-indigo-200">
            <ShieldAlert className="h-4 w-4 text-indigo-600" />
            <AlertTitle>Administrator Account</AlertTitle>
            <AlertDescription>
              This is an administrative account with system-wide permissions.
              Currently {adminData.adminCount} of {adminData.maxAdmins} admin accounts are in use.
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/admin-accounts">
                    Manage Admin Accounts
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );

  const profileTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture. Recommended size is 300x300 pixels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatarUrl={user?.avatarUrl}
            name={adminData.name}
            onAvatarChange={handleAvatarChange}
            size="lg"
          />
        </CardContent>
      </Card>
      
      <ProfileForm 
        defaultValues={adminData} 
        onSubmit={handleProfileUpdate} 
        title="Admin Profile" 
        description="Update your administrator profile information." 
      />
    </div>
  );

  const tabs = [
    {
      id: "general",
      label: "General",
      content: profileTab
    },
    {
      id: "security",
      label: "Security",
      content: (
        <div className="space-y-6">
          {securityCard}
          <PasswordForm />
        </div>
      )
    },
    {
      id: "api-keys",
      label: "API Keys",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-500" />
              API Access
            </CardTitle>
            <CardDescription>
              Manage your API keys for system integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Administrator accounts can generate API keys for integrating with external systems.
              Manage your existing keys or create new ones from the API Keys page.
            </p>
            <Button asChild>
              <Link to="/admin/api-keys">
                Manage API Keys
              </Link>
            </Button>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <ProfileLayout
      name={adminData.name}
      email={adminData.email}
      role={adminData.role}
      avatarUrl={user?.avatarUrl}
      tabs={tabs}
    />
  );
}
