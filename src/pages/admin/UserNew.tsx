import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithPassword } from "@/types/user";
import { toast } from "react-hot-toast";

export default function AdminUserNew() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { createUser } = useUserManagementStore();
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    setError("");

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
        setError("Failed to create user. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.message || "An unexpected error occurred.");
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
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const values = Object.fromEntries(formData);
            await handleSubmit(values);
          }} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" name="password" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input type="tel" id="phone" name="phone" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select name="role">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="companyId">Company ID</Label>
              <Input type="text" id="companyId" name="companyId" />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
