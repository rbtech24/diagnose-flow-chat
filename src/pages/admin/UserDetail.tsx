
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Shield, KeyRound, Trash, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Simulate API call to get user data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!id) {
          toast({
            title: "User not found",
            description: "The requested user could not be found.",
            type: "error",
            variant: "destructive",
          });
          navigate('/admin/users');
          return;
        }

        // Mock user data
        const mockUser = {
          id,
          name: "John Technician",
          email: "john@example.com",
          role: "technician",
          company: "Acme Repairs, Inc.",
          companyId: "company-123",
          status: "active",
          lastLogin: "2023-06-01T14:30:00",
          createdAt: "2022-03-15T09:00:00",
          permissions: ["repair:read", "repair:write", "knowledge:read"],
          profileImage: "https://i.pravatar.cc/150?u=john",
        };
        
        setUserData(mockUser);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user data:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          type: "error",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [id, navigate, toast]);

  const handleSendPasswordReset = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${userData.email}.`,
        type: "success"
      });
      
      setIsPasswordResetOpen(false);
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        type: "error",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        type: "success"
      });
      
      navigate('/admin/users');
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        type: "error",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading user data...</div>;
  }

  if (!userData) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The requested user could not be found or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsPasswordResetOpen(true)}>
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img 
                      src={userData.profileImage || "https://i.pravatar.cc/150"} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
                    userData.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
                
                <div className="mt-2">
                  <Badge status={userData.status} />
                </div>
                
                <div className="w-full mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{userData.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="font-medium">{userData.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Active</span>
                    <span className="font-medium">
                      {new Date(userData.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="w-full mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full" onClick={() => setIsPasswordResetOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Password Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p>{userData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                      <p className="capitalize">{userData.role}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <p className="capitalize">{userData.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Company Association</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                      <p>{userData.company}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Company ID</h3>
                      <p>{userData.companyId}</p>
                    </div>
                  </div>
                  <Button variant="outline">View Company Details</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="permissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.permissions.map((permission: string) => (
                      <div key={permission} className="flex items-center">
                        <Shield className="h-5 w-5 text-green-500 mr-2" />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-6">
                    User activity tracking will be implemented soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {userData.email}
            </DialogDescription>
          </DialogHeader>
          <AdminPasswordResetForm 
            email={userData.email}
            onSubmit={handleSendPasswordReset}
            onCancel={() => setIsPasswordResetOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <DeleteUserDialog
        userId={userData.id}
        userName={userData.name}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}

// Helper component for user status badge
function Badge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };
  
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status] || colorMap.inactive}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
