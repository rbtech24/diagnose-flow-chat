
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, UserCog, CheckCircle, XCircle, Mail, RotateCw, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Define the admin account interface
interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
  status?: string;
  companyId?: string;
  companyName?: string;
}

// Form schema for adding a new admin
const adminFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.string().min(1, "Please select a role"),
  companyId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

export default function AdminAccounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const { user } = useAuth();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
      companyId: "",
      password: "",
    },
  });

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name');

      if (error) {
        throw error;
      }

      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch admin accounts
  const fetchAdminAccounts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('technicians')
        .select('id, email, role, last_sign_in_at, status, company_id')
        .in('role', ['admin', 'super_admin', 'company']);
      
      if (selectedCompany) {
        query = query.eq('company_id', selectedCompany);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Get company names for admins with company_id
      const companyIds = data
        .filter(admin => admin.company_id)
        .map(admin => admin.company_id);
      
      let companyNames: Record<string, string> = {};
      
      if (companyIds.length > 0) {
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('id, name')
          .in('id', companyIds);
        
        if (!companiesError && companiesData) {
          companyNames = companiesData.reduce((acc, company) => {
            acc[company.id] = company.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Transform data to include name from auth.users if needed
      // For now using email as name placeholder
      let adminAccountsData = data.map(admin => ({
        id: admin.id,
        name: admin.email.split('@')[0] || 'Admin User', // Simple name extraction from email
        email: admin.email,
        role: admin.role,
        lastLogin: admin.last_sign_in_at ? new Date(admin.last_sign_in_at).toLocaleString() : 'Never',
        status: admin.status || 'active',
        companyId: admin.company_id,
        companyName: admin.company_id ? companyNames[admin.company_id] : undefined
      }));

      // Check if our default admin exists, if not add it to the list
      if (!adminAccountsData.some(admin => admin.email === 'digitalprofits247@gmail.com')) {
        adminAccountsData.push({
          id: 'default-admin-id',
          name: 'Primary Admin',
          email: 'digitalprofits247@gmail.com',
          role: 'admin',
          lastLogin: 'Never',
          status: 'active',
          companyId: undefined,
          companyName: undefined
        });
      }

      setAdminAccounts(adminAccountsData);
      
      // Check if our default admin exists in the database, if not create it
      const adminExists = await checkUserExists('digitalprofits247@gmail.com');
      if (!adminExists) {
        await createDefaultAdmin();
      }
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load admin accounts',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('id')
        .eq('email', email)
        .single();
      
      return !error && data;
    } catch (error) {
      return false;
    }
  };

  const createDefaultAdmin = async () => {
    try {
      console.log('Creating default admin user');
      
      // Create user in auth system
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'digitalprofits247@gmail.com',
        password: 'Madeit99$$',
      });

      if (signUpError) {
        console.error('Error during signup:', signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('User creation failed');
      }

      // Add user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: 'Primary Admin',
          role: 'admin'
        }
      });

      if (updateError) {
        console.error('Error updating user metadata:', updateError);
      }

      // Create technician record
      const { error: techError } = await supabase.from('technicians').insert({
        id: signUpData.user.id,
        email: 'digitalprofits247@gmail.com',
        role: 'admin',
        status: 'active'
      });

      if (techError) {
        console.error('Error creating technician record:', techError);
        throw techError;
      }

      // Refresh the admin list
      fetchAdminAccounts();

      toast({
        title: 'Default Admin Created',
        description: 'The default admin account has been set up',
      });
    } catch (error) {
      console.error('Error creating default admin:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create default admin account. Please check console for details.',
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchAdminAccounts();
  }, [selectedCompany]);

  const filteredAccounts = adminAccounts.filter(account => 
    (account.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (account.companyName && account.companyName.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const onSubmit = async (data: AdminFormValues) => {
    try {
      // Check if user already exists
      const userExists = await checkUserExists(data.email);
      if (userExists) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An account with this email already exists',
        });
        return;
      }

      // Create user in auth system
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        console.error('Error during signup:', signUpError);
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('User creation failed');
      }

      // Add user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          role: data.role
        }
      });

      if (updateError) {
        console.error('Error updating user metadata:', updateError);
      }

      // Create technician record
      const { error: techError } = await supabase.from('technicians').insert({
        id: signUpData.user.id,
        email: data.email,
        role: data.role,
        status: 'active',
        company_id: data.companyId || null
      });

      if (techError) {
        console.error('Error creating technician record:', techError);
        throw techError;
      }

      // Get company name if companyId is provided
      let companyName;
      if (data.companyId) {
        const company = companies.find(c => c.id === data.companyId);
        companyName = company?.name;
      }

      // Add to the list of admins
      setAdminAccounts(prev => [
        ...prev,
        {
          id: signUpData.user.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: 'active',
          companyId: data.companyId,
          companyName
        }
      ]);

      toast({
        title: 'Success',
        description: 'Admin account created successfully',
      });

      // Reset form and close dialog
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating admin account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create admin account',
      });
    }
  };

  const handleRevokeAccess = async (accountId: string) => {
    try {
      // Update the technician status to inactive
      const { error } = await supabase
        .from('technicians')
        .update({ status: 'inactive' })
        .eq('id', accountId);

      if (error) throw error;

      // Update local state
      setAdminAccounts(prev => 
        prev.map(account => account.id === accountId 
          ? { ...account, status: 'inactive' } 
          : account
        )
      );

      toast({
        title: 'Success',
        description: 'Admin access revoked successfully',
      });
    } catch (error) {
      console.error('Error revoking admin access:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to revoke admin access',
      });
    }
  };

  const handleReactivateAccess = async (accountId: string) => {
    try {
      // Update the technician status to active
      const { error } = await supabase
        .from('technicians')
        .update({ status: 'active' })
        .eq('id', accountId);

      if (error) throw error;

      // Update local state
      setAdminAccounts(prev => 
        prev.map(account => account.id === accountId 
          ? { ...account, status: 'active' } 
          : account
        )
      );

      toast({
        title: 'Success',
        description: 'Admin access reactivated successfully',
      });
    } catch (error) {
      console.error('Error reactivating admin access:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reactivate admin access',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Accounts</h1>
          <p className="text-muted-foreground">Manage system administrators and their permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search admin accounts..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Companies</SelectItem>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Create a new administrator account with system-wide permissions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                          <Input placeholder="admin@example.com" type="email" {...field} />
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
                        <FormLabel>Admin Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select admin role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="company">Company Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Determines permission level for system administration.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('role') === 'company' && (
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map(company => (
                                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The company this admin will manage.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Must include uppercase, lowercase, number, and special character.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="submit">Create Admin Account</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>Manage all system administrators and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32 mt-2" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No admin accounts match your search" : "No admin accounts found"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                          <p className="text-sm text-muted-foreground">{account.email}</p>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <p className="text-sm text-muted-foreground">Last login: {account.lastLogin}</p>
                        <Badge variant={account.role === "super_admin" ? "destructive" : "default"}>
                          {account.role === "super_admin" ? "Super Admin" : account.role === "company" ? "Company Admin" : "Admin"}
                        </Badge>
                        {account.companyName && (
                          <Badge variant="outline" className="bg-blue-50">
                            <Building2 className="h-3 w-3 mr-1 text-blue-500" />
                            {account.companyName}
                          </Badge>
                        )}
                        <Badge variant={account.status === "active" ? "outline" : "secondary"}>
                          {account.status === "active" ? 
                            <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" /> : 
                            <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
                          }
                          {account.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {account.status === "active" ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRevokeAccess(account.id)}
                        disabled={account.email === "digitalprofits247@gmail.com" || account.email === user?.email}
                        title={account.email === "digitalprofits247@gmail.com" ? "Cannot revoke primary admin" : 
                              account.email === user?.email ? "Cannot revoke your own access" : "Revoke access"}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReactivateAccess(account.id)}
                      >
                        <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
