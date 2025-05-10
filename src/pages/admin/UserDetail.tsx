import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useUserManagementStore } from "@/store/userManagementStore";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { fetchUserById, updateUser, deleteUser, resetUserPassword } = useUserManagementStore();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<any>({});
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await fetchUserById(userId);
          setUser(userData);
          setUpdatedData(userData || {});
        } catch (error) {
          console.error('Error fetching user:', error);
          toast({
            title: "Error",
            description: "Failed to load user details",
            variant: "destructive"
          });
        }
      }
    };

    fetchUser();
  }, [userId, fetchUserById, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleRoleChange = (role: string) => {
    // Ensure role is one of the allowed types
    const roleValue: "admin" | "company" | "tech" = 
      ["admin", "company", "tech"].includes(role) ? 
        role as "admin" | "company" | "tech" : "tech";
    
    setUpdatedData({ ...updatedData, role: roleValue });
  };

  const handleStatusChange = (checked: boolean) => {
    setUpdatedData({ ...updatedData, status: checked ? 'active' : 'inactive' });
  };

  const saveChanges = async () => {
    if (!user) return;

    try {
      const result = await updateUser(user.id, updatedData);
      
      if (result) {
        toast({
          title: "Success",
          description: "User updated successfully"
        });
        setUser({ ...user, ...updatedData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const showResetPassword = () => {
    setIsResetPasswordOpen(true);
  };

  const hideResetPassword = () => {
    setIsResetPasswordOpen(false);
  };

  const handlePasswordResetSuccess = () => {
    setIsResetPasswordOpen(false);
    toast({
      title: "Success",
      description: "Password reset email has been sent"
    });
  };

  const confirmDeleteUser = () => {
    setIsDeleteDialogOpen(true);
  };

  const cancelDeleteUser = () => {
    setIsDeleteDialogOpen(false);
  };

  const performDeleteUser = async () => {
    if (!user) return;

    try {
      const result = await deleteUser(user.id, user.email, user.role);
      
      if (result) {
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
        navigate("/admin/users");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Loading user information...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>User Details</CardTitle>
            <CardDescription>View and manage user information</CardDescription>
          </div>
          <Badge variant={user?.status === 'active' ? 'outline' : 'secondary'}>
            {user?.status || 'Unknown'}
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={updatedData.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={updatedData.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                {isEditing ? (
                  <Select 
                    value={updatedData.role || 'tech'} 
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="role" value={updatedData.role || ''} disabled />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={updatedData.status === 'active'}
                    onCheckedChange={handleStatusChange}
                    disabled={!isEditing}
                  />
                  <span className="text-sm text-gray-500">
                    {updatedData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <div className="flex justify-end space-x-2">
                {isResetPasswordOpen ? (
                  <div className="w-full max-w-md mx-auto">
                    <AdminPasswordResetForm
                      userId={user.id}
                      userEmail={user.email}
                      onSuccess={handlePasswordResetSuccess}
                      onCancel={hideResetPassword}
                    />
                  </div>
                ) : isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={saveChanges}>Save Changes</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={showResetPassword}>Reset Password</Button>
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete User</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account and remove their data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={cancelDeleteUser}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={performDeleteUser}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
