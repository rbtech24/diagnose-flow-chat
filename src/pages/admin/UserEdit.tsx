import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserManagementStore } from "@/store/userManagementStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import UserCompanyAssignment from "@/components/admin/UserCompanyAssignment";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "company", "tech"]),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  // We don't include password as it's edited separately
});

type UserFormValues = z.infer<typeof formSchema>;

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchUserById, updateUser, companies } = useUserManagementStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "tech",
      phone: "",
      companyId: undefined,
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const user = await fetchUserById(id);
        if (user) {
          setUserData(user);
          
          // Set form values
          form.reset({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || "",
            companyId: user.companyId || undefined,
          });
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
    
    loadUser();
  }, [id, fetchUserById, navigate, toast, form]);

  const selectedRole = form.watch("role");

  const handleAvatarChange = async (avatarUrl: string) => {
    if (!id) return;
    
    try {
      const updatedUser = await updateUser(id, {
        avatarUrl
      });
      
      if (updatedUser) {
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
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
        form.setValue("companyId", companyId || undefined);
        
        toast({
          title: "Company updated",
          description: "User's company assignment has been updated successfully.",
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

  const onSubmit = async (data: UserFormValues) => {
    if (!id) return;
    
    try {
      await updateUser(id, data);
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
      navigate(`/admin/users/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user information.",
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
            onClick={() => navigate(`/admin/users/${id}`)} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Loading user information...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/admin/users/${id}`)} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <AvatarUpload
                currentAvatarUrl={userData.avatarUrl}
                name={userData.name}
                onAvatarChange={handleAvatarChange}
                size="lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update user details and role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Input type="email" placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="company">Company Manager</SelectItem>
                          <SelectItem value="tech">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This will determine the user's access level
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove the CompanyId field since we have a dedicated component for that now */}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/admin/users/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Add company assignment component if role is not admin */}
      {userData && userData.role !== 'admin' && (
        <div className="mb-6">
          <UserCompanyAssignment 
            userId={id || ""}
            currentCompanyId={userData.companyId}
            userRole={userData.role}
            onCompanyChange={handleCompanyChange}
          />
        </div>
      )}
    </div>
  );
}
