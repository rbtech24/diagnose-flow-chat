
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UserWithPassword } from "@/types/user";
import { toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubscriptionStore } from "@/store/subscriptionStore";

// Create a form schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  role: z.enum(["admin", "company", "tech"]),
  companyId: z.string().optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminUserNew() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { createUser } = useUserManagementStore();
  const { companies, isLoadingCompanies, fetchCompanies } = useUserManagementStore(); 
  const navigate = useNavigate();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "tech",
      companyId: ""
    }
  });

  // Fetch companies on component mount
  useState(() => {
    fetchCompanies();
  });

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const newUser: UserWithPassword = {
        id: `user-${Date.now()}`, // Generate a temporary ID
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone || "",
        password: values.password,
        companyId: values.companyId,
        status: "active",
      };

      const success = await createUser(newUser);

      if (success) {
        toast.success("User created successfully!");
        navigate("/admin/users");
      } else {
        setFormError("Failed to create user. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating user:", err);
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                {...form.register("name")} 
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                {...form.register("email")} 
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                id="password" 
                {...form.register("password")} 
                className={form.formState.errors.password ? "border-red-500" : ""}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                type="tel" 
                id="phone" 
                {...form.register("phone")} 
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select 
                onValueChange={(value) => form.setValue("role", value as "admin" | "company" | "tech")} 
                defaultValue={form.getValues("role")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="tech">Technician</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.role.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="companyId">Company</Label>
              <Select
                onValueChange={(value) => form.setValue("companyId", value)}
                defaultValue={form.getValues("companyId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Company (Independent)</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
