
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch user data from an API based on the ID
  const userData = {
    name: id === "1" ? "John Doe" : id === "2" ? "Sarah Smith" : "Mike Johnson",
    email: id === "1" ? "john@example.com" : id === "2" ? "sarah@acmerepairs.com" : "mike@acmerepairs.com",
    role: id === "1" ? "admin" : id === "2" ? "company" : "tech",
    phone: "(555) 123-4567",
    companyName: id === "1" ? "System Admin" : "Acme Repairs",
    joinDate: "January 15, 2023"
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/users")} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{userData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge 
                  variant={
                    userData.role === "admin" ? "default" : 
                    userData.role === "company" ? "secondary" : "outline"
                  }
                >
                  {userData.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">{userData.companyName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md">
                <div className="font-medium">Logged in</div>
                <div className="text-sm text-muted-foreground">Today at 9:30 AM</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="font-medium">Updated profile</div>
                <div className="text-sm text-muted-foreground">Yesterday at 2:15 PM</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="font-medium">Created support ticket</div>
                <div className="text-sm text-muted-foreground">3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Reset Password</Button>
              <Button variant="outline">Edit Profile</Button>
              {userData.role === "tech" && (
                <Button variant="outline">Assign to Company</Button>
              )}
              <Button variant="destructive">Deactivate Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
