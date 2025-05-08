import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";
import { sendPasswordResetEmail } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import UserCompanyAssignment from "@/components/admin/UserCompanyAssignment";

// Sample activity data for when no real data is available
const sampleUserActivity = [
  {
    title: "Logged in",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    title: "Updated profile",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday
  },
  {
    title: "Created support ticket",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
  }
];

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isAssignCompanyDialogOpen, setIsAssignCompanyDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const { toast } = useToast();
  const { users, companies, fetchUserById, fetchCompanyById, deleteUser, resetUserPassword, updateUser } = useUserManagementStore();
  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userActivity, setUserActivity] = useState(sampleUserActivity);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const user = await fetchUserById(id);
        if (user) {
          setUserData(user);
          
          if (user.companyId) {
            const company = await fetchCompanyById(user.companyId);
            setCompanyData(company);
          }
        } else {
          toast({
            title: "User not found",
            description: "The requested user could not be found.",
            variant: "destructive",
          });
          navigate("/admin/users");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, fetchUserById, fetchCompanyById, navigate, toast]);

  const handleSendPasswordResetEmail = async () => {
    if (!userData) return;
    
    try {
      const { error } = await sendPasswordResetEmail(userData.email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: `A password reset email has been sent to ${userData.email}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!id) return;
    
    try {
      const success = await deleteUser(id);
      if (success) {
        toast({
          title: "User deleted",
          description: "The user has been successfully deleted.",
        });
        navigate("/admin/users");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = () => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    if (!id) return;
    
    try {
      const updatedUser = await updateUser(id, {
        avatarUrl
      });
      
      if (updatedUser) {
        setUserData(updatedUser);
        toast({
          title: "Success",
          description: "Profile picture updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCompanyChange = async (companyId: string | null) => {
    if (!id) return;
    
    try {
      const updatedUser = await updateUser(id, {
        companyId
      });
      
      if (updatedUser) {
        setUserData({...userData, companyId});
        
        // Fetch the company data if a new company is assigned
        if (companyId) {
          const company = await fetchCompanyById(companyId);
          setCompanyData(company);
        } else {
          setCompanyData(null);
        }
        
        toast({
          title: companyId ? "Company assigned" : "Company unassigned",
          description: companyId 
            ? "User has been successfully assigned to the company." 
            : "User has been unassigned from the company.",
        });
      }
    } catch (error) {
      console.error('Error updating company assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update company assignment.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Skeleton className="h-64" />
          <Skeleton className="md:col-span-2 h-64" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/admin/users")}>
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
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
            <div className="flex flex-col items-center mb-6">
              <AvatarUpload
                currentAvatarUrl={userData.avatarUrl}
                name={userData.name}
                onAvatarChange={handleAvatarChange}
                size="lg"
              />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div>
                <Badge 
                  variant={
                    userData.role === "admin" ? "default" : 
                    userData.role === "company" ? "secondary" : "outline"
                  }
                >
                  {userData.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {userData.role === "admin" 
                    ? "System Administrator" 
                    : userData.companyId && companyData 
                      ? companyData.name 
                      : "No Company Assigned"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
              )}
              {userData.companyId && companyData && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{companyData.name}</span>
                </div>
              )}
              {userData.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(userData.createdAt)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.map((activity, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <UserCompanyAssignment 
          userId={id}
          currentCompanyId={userData.companyId}
          userRole={userData.role}
          onCompanyChange={handleCompanyChange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setIsResetDialogOpen(true)}>
              Reset Password Directly
            </Button>
            <Button variant="outline" onClick={handleSendPasswordResetEmail}>
              Send Password Reset Email
            </Button>
            <Button variant="outline" onClick={handleEditUser}>
              Edit Profile
            </Button>
            {userData.role === "tech" && (
              <Button 
                variant="outline" 
                onClick={() => setIsAssignCompanyDialogOpen(true)}
                disabled={!!userData.companyId}
              >
                {userData.companyId ? "Already Assigned to Company" : "Assign to Company"}
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deactivate Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete the user account. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
          </DialogHeader>
          <AdminPasswordResetForm 
            userId={userData.id} 
            onSuccess={() => {
              setIsResetDialogOpen(false);
              toast({
                title: "Success",
                description: "Password has been reset successfully.",
              });
            }}
            onCancel={() => setIsResetDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
