
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Shield, UserPlus } from "lucide-react";
import { User } from "@/types/user";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AdminPasswordResetForm } from "@/components/admin/AdminPasswordResetForm";

// Form schema for new admin
const newAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type NewAdminValues = z.infer<typeof newAdminSchema>;

export default function AdminAccounts() {
  const [admins, setAdmins] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@repairautopilot.com",
      role: "admin",
    },
    {
      id: "2",
      name: "Secondary Admin",
      email: "admin2@repairautopilot.com",
      role: "admin",
    }
  ]);
  
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [maxAdmins] = useState(3);
  const [resetPasswordAdminId, setResetPasswordAdminId] = useState<string | null>(null);
  
  const form = useForm<NewAdminValues>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });
  
  const handleAddAdmin = (values: NewAdminValues) => {
    // In a real app, this would call an API to create the user
    const newAdmin: User = {
      id: String(admins.length + 1),
      name: values.name,
      email: values.email,
      role: "admin",
    };
    
    setAdmins([...admins, newAdmin]);
    setIsAddAdminOpen(false);
    form.reset();
    toast.success("Admin account created successfully");
  };
  
  const handleResetPassword = (adminId: string) => {
    // Open the reset password dialog by setting the adminId
    setResetPasswordAdminId(adminId);
  };
  
  const handlePasswordResetSuccess = () => {
    // Close the reset password dialog
    setResetPasswordAdminId(null);
    toast.success("Admin password has been reset successfully");
  };
  
  const handlePasswordResetCancel = () => {
    // Close the reset password dialog
    setResetPasswordAdminId(null);
  };
  
  const handleRemoveAdmin = (adminId: string) => {
    setAdmins(admins.filter(admin => admin.id !== adminId));
    toast.success("Admin account removed");
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Accounts</h1>
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogTrigger asChild>
            <Button disabled={admins.length >= maxAdmins}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin Account</DialogTitle>
              <DialogDescription>
                Create a new administrator account with full system access.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddAdmin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        The admin will be prompted to change this on first login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Admin Account</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            System Administrators
          </CardTitle>
          <CardDescription>
            Manage administrator accounts with full system access.
            Currently using {admins.length} of {maxAdmins} available admin accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{admin.name}</h3>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Administrator</Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResetPassword(admin.id)}
                    >
                      Reset Password
                    </Button>
                    {admin.id !== "1" && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveAdmin(admin.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Note: The primary admin account cannot be removed. All admins have full system access.
          </p>
        </CardFooter>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog 
        open={resetPasswordAdminId !== null} 
        onOpenChange={(isOpen) => {
          if (!isOpen) setResetPasswordAdminId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Admin Password</DialogTitle>
            <DialogDescription>
              Enter a new password for this administrator account.
            </DialogDescription>
          </DialogHeader>
          
          {resetPasswordAdminId && (
            <AdminPasswordResetForm
              userId={resetPasswordAdminId}
              onSuccess={handlePasswordResetSuccess}
              onCancel={handlePasswordResetCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
