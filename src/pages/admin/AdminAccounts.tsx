
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Edit, Trash2, RefreshCw, Shield, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAccounts() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email?: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { users, fetchUsers, deleteUser } = useUserManagementStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Filter to show only admin users
  const adminUsers = users.filter(user => user.role === 'admin');
  const MAX_ADMINS = 3;
  const canAddMoreAdmins = adminUsers.length < MAX_ADMINS;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUsers();
      setIsLoading(false);
    };

    fetchData();
  }, [fetchUsers]);

  const handleOpenDeleteDialog = (user: { id: string; name: string }) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedUser(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      if (adminUsers.length <= 1) {
        toast({
          title: "Cannot Delete",
          description: "Cannot delete the last admin user. At least one admin must remain.",
          variant: "destructive",
        });
        handleCloseDeleteDialog();
        return;
      }

      const success = await deleteUser(selectedUser.id);
      if (success) {
        toast({
          title: "Admin Deleted",
          description: `${selectedUser.name} has been successfully removed from admin accounts.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete admin user. Please try again.",
          variant: "destructive",
        });
      }
      handleCloseDeleteDialog();
    }
  };

  const handleResetPasswordDialogOpen = (user: { id: string; name: string; email?: string }) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordDialogClose = () => {
    setSelectedUser(null);
    setIsResetPasswordModalOpen(false);
  };

  const handleResetPasswordSuccess = () => {
    toast({
      title: "Password Reset",
      description: "Admin password has been reset successfully.",
    });
    handleResetPasswordDialogClose();
  };

  const filteredUsers = adminUsers.filter((user) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const matchesSearchTerm = searchRegex.test(user.name) || searchRegex.test(user.email);
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Account Management</h1>
          <p className="text-muted-foreground">Manage system administrator accounts</p>
        </div>
        <Button 
          asChild 
          disabled={!canAddMoreAdmins}
          className={!canAddMoreAdmins ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Link to="/admin/users/new" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin Account
          </Link>
        </Button>
      </div>

      {/* Admin Limits Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            Admin Account Limits
          </CardTitle>
          <CardDescription>
            System administrator account usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Current admin accounts: <span className="font-medium">{adminUsers.length}</span> of <span className="font-medium">{MAX_ADMINS}</span> maximum
              </p>
              {!canAddMoreAdmins && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  Maximum admin limit reached
                </p>
              )}
            </div>
            <Badge variant={canAddMoreAdmins ? "outline" : "secondary"}>
              {adminUsers.length}/{MAX_ADMINS}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Search admin accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Show skeleton loaders while loading
              <>
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-[120px]" />
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ) : filteredUsers.length === 0 ? (
              // Show message when no admin users are found
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No admin accounts found.
                </TableCell>
              </TableRow>
            ) : (
              // Show admin user data when available
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'outline' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleResetPasswordDialogOpen({ id: user.id, name: user.name, email: user.email })}
                        >
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenDeleteDialog({ id: user.id, name: user.name })}
                          disabled={adminUsers.length <= 1}
                          className={adminUsers.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedUser?.name} from admin accounts? This will revoke their administrative privileges but not delete their user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Remove Admin</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isResetPasswordModalOpen && selectedUser && (
        <Dialog open={isResetPasswordModalOpen} onOpenChange={handleResetPasswordDialogClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Admin Password</DialogTitle>
              <DialogDescription>
                Set a new password for {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            <AdminPasswordResetForm
              userId={selectedUser.id}
              userEmail={selectedUser.email || ''}
              onSuccess={handleResetPasswordSuccess}
              onCancel={handleResetPasswordDialogClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
