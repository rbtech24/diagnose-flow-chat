import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserManagementStore } from "@/store/userManagementStore";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "company", "tech"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  companyId: z.string().optional(),
  assignmentType: z.enum(["none", "company", "subscription"]),
  planId: z.string().optional(),
  subscriptionStatus: z.enum(["trial", "active", "expired", "canceled"]).optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

export default function UserNew() {
  const navigate = useNavigate();
  const { addUser, companies } = useUserManagementStore();
  const [subscriptionPlans] = useState([
    { id: "basic-monthly", name: "Basic Plan (Monthly)", price: 9.99, billingCycle: "monthly" },
    { id: "pro-monthly", name: "Professional Plan (Monthly)", price: 19.99, billingCycle: "monthly" },
    { id: "enterprise-monthly", name: "Enterprise Plan (Monthly)", price: 49.99, billingCycle: "monthly" },
    { id: "basic-yearly", name: "Basic Plan (Yearly)", price: 99.99, billingCycle: "yearly" },
    { id: "pro-yearly", name: "Professional Plan (Yearly)", price: 199.99, billingCycle: "yearly" },
    { id: "enterprise-yearly", name: "Enterprise Plan (Yearly)", price: 499.99, billingCycle: "yearly" },
  ]);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "tech",
      phone: "",
      password: "",
      companyId: undefined,
      assignmentType: "none",
      planId: undefined,
      subscriptionStatus: "trial",
    },
  });

  const selectedRole = form.watch("role");
  const assignmentType = form.watch("assignmentType");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userData = {
        role: data.role,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        status: "active", // Add status field which is required
        // Only include company ID if assignment type is company
        companyId: data.assignmentType === "company" ? data.companyId : undefined,
        // Only include subscription details if assignment type is subscription
        planId: data.assignmentType === "subscription" ? data.planId : undefined,
        subscriptionStatus: data.assignmentType === "subscription" ? data.subscriptionStatus : undefined,
        // If admin role, no company is assigned
        ...(data.role === "admin" && { companyId: undefined, planId: undefined, subscriptionStatus: undefined })
      };
      
      const newUser = await addUser(userData);
      navigate(`/admin/users/${newUser.id}`);
    } catch (error) {
      console.error("Failed to create user:", error);
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
        <h1 className="text-3xl font-bold">Add New User</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Create a new user account in the system
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
                      <Input placeholder="(555) 123-4567" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {selectedRole !== "admin" && (
                <FormField
                  control={form.control}
                  name="assignmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Assignment</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none">No assignment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="company" id="company" />
                            <Label htmlFor="company">Assign to company</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="subscription" id="subscription" />
                            <Label htmlFor="subscription">Assign subscription plan</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedRole !== "admin" && assignmentType === "company" && (
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {selectedRole === "company" 
                          ? "The company this manager will oversee" 
                          : "The company this technician belongs to"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedRole !== "admin" && assignmentType === "subscription" && (
                <>
                  <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Plan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subscriptionPlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - ${plan.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                          The subscription plan for this user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subscriptionStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      The user will be asked to change this on first login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/users")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
