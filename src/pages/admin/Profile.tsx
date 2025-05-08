
import { useState } from "react";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Key } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  // Mock admin data - would typically come from API/context
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@repairautopilot.com",
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

  const tabs = [
    {
      id: "general",
      label: "General",
      content: <ProfileForm defaultValues={adminData} onSubmit={handleProfileUpdate} title="Admin Profile" description="Update your administrator profile information." />
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
      tabs={tabs}
    />
  );
}
