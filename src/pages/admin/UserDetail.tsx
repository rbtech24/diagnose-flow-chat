import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useUserManagementStore } from "@/store/userManagementStore";
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";
import { Loader2 } from "lucide-react";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchUserById, updateUser } = useUserManagementStore();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const { toast } = useToast();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (id) {
        setIsLoading(true);
        const fetchedUser = await fetchUserById(id);
        setUser(fetchedUser);
        if (fetchedUser) {
          setName(fetchedUser.name);
          setEmail(fetchedUser.email);
          setRole(fetchedUser.role);
          setStatus(fetchedUser.status);
        }
        setIsLoading(false);
      }
    };

    loadUser();
  }, [id, fetchUserById]);

  const handleUpdateUser = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      await updateUser(user.id, {
        name,
        email,
        role,
        status,
      });
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      navigate("/admin/accounts");
    } catch (error) {
      console.error("Error updating user", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPasswordDialogOpen = () => {
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordDialogClose = () => {
    setIsResetPasswordModalOpen(false);
  };

  const handleResetPasswordSuccess = () => {
    toast({
      title: "Success",
      description: "Password reset successfully.",
    });
    handleResetPasswordDialogClose();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading User...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fetching user details. Please wait.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>User Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No user found with ID: {id}</p>
          </CardContent>
          <Button onClick={() => navigate("/admin/accounts")}>
            Back to Accounts
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>View and edit user information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                type="text"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/admin/accounts")}>
              Back to Accounts
            </Button>
            <div>
              <Button
                onClick={handleUpdateUser}
                disabled={isUpdating}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update User
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Reset Password</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reset the password for {user.name}?
                    </DialogDescription>
                  </DialogHeader>
                  <AdminPasswordResetForm
                    userId={user.id}
                    userEmail={user.email || ''}
                    onSuccess={handleResetPasswordSuccess}
                    onCancel={handleResetPasswordDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      {isResetPasswordModalOpen && user && (
        <Dialog open={isResetPasswordModalOpen} onOpenChange={handleResetPasswordDialogClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {user.name}
              </DialogDescription>
            </DialogHeader>
            <AdminPasswordResetForm
              userId={user.id}
              userEmail={user.email || ''}
              onSuccess={handleResetPasswordSuccess}
              onCancel={handleResetPasswordDialogClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
