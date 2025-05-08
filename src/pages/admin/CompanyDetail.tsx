
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, CreditCard, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarUpload } from "@/components/shared/AvatarUpload";

// Define interface for activity data to fix the type error
interface UserActivityData {
  id: string;
  activity_type: string;
  created_at: string;
  description: string;
  metadata: Record<string, any>; // Using Record<string, any> instead of complex nested types
  ip_address: string;
  user_agent: string;
  user_id: string;
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companies, users, fetchCompanyById, fetchUsers, deleteCompany, updateCompany } = useUserManagementStore();
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        await fetchUsers();
        const company = await fetchCompanyById(id);
        if (company) {
          setCompanyData(company);
          
          // Filter users that belong to this company
          const relatedUsers = users.filter(user => user.companyId === id);
          setCompanyUsers(relatedUsers);
        } else {
          toast({
            title: "Company not found",
            description: "The requested company could not be found.",
            variant: "destructive",
          });
          navigate("/admin/companies");
        }
      } catch (error) {
        console.error("Error loading company data:", error);
        toast({
          title: "Error",
          description: "Failed to load company data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, fetchCompanyById, fetchUsers, users, navigate, toast]);

  const handleDeleteCompany = async () => {
    if (!id) return;
    
    try {
      const success = await deleteCompany(id);
      if (success) {
        toast({
          title: "Company deleted",
          description: "The company has been successfully deleted.",
        });
        navigate("/admin/companies");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete company.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCompany = () => {
    navigate(`/admin/companies/${id}/edit`);
  };
  
  const handleAvatarChange = async (avatarUrl: string) => {
    if (!id) return;
    
    try {
      const updatedCompany = await updateCompany(id, {
        logoUrl: avatarUrl
      });
      
      if (updatedCompany) {
        setCompanyData(updatedCompany);
      }
    } catch (error) {
      console.error('Error updating company logo:', error);
      throw error;
    }
  };

  // Sample activity data - This should be replaced with actual API call
  const recentActivity: UserActivityData[] = [
    {
      id: "activity-1",
      activity_type: "user_added",
      created_at: new Date().toISOString(),
      description: "Technician Added",
      metadata: { name: "John Doe" }, // Simplified metadata structure
      ip_address: "192.168.1.1",
      user_agent: "Mozilla/5.0",
      user_id: "user-1"
    },
    {
      id: "activity-2",
      activity_type: "subscription_renewed",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      description: "Subscription Renewed",
      metadata: { plan: "Professional" }, // Simplified metadata structure
      ip_address: "192.168.1.1",
      user_agent: "Mozilla/5.0",
      user_id: "user-1"
    },
    {
      id: "activity-3",
      activity_type: "profile_updated",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Profile Updated",
      metadata: { fields: ["name", "email"] }, // Simplified metadata structure
      ip_address: "192.168.1.1",
      user_agent: "Mozilla/5.0",
      user_id: "user-1"
    }
  ];
  
  // Format activity for display
  const formatActivity = (activity: UserActivityData) => {
    return {
      title: activity.description,
      time: activity.created_at
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/companies")} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
          <p className="text-muted-foreground mb-4">The company you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/admin/companies")}>
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return '';
    }
  };

  const mainAdmin = companyUsers.find(user => user.role === 'company' && user.isMainAdmin);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/companies")} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Company Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {companyData.name}
              <Badge className={`ml-2 ${getStatusBadgeStyle(companyData.status)}`}>
                {companyData.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <AvatarUpload
                currentAvatarUrl={companyData.logoUrl}
                name={companyData.name}
                onAvatarChange={handleAvatarChange}
                size="lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Contact</span>
                <span className="font-medium">{companyData.contactName}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{companyData.email}</span>
              </div>
              {companyData.phone && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="font-medium">{companyData.phone}</span>
                </div>
              )}
              {companyData.city && companyData.state && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="font-medium">{companyData.city}, {companyData.state}</span>
                </div>
              )}
            </div>

            {companyData.address && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Address</span>
                </div>
                <p className="text-sm">
                  {companyData.address}
                  {companyData.city && companyData.state && (
                    <>, {companyData.city}, {companyData.state} {companyData.zipCode}</>
                  )}
                  {companyData.country && <>, {companyData.country}</>}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={handleEditCompany}>
                Edit Company
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Delete Company</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete the company and all associated users. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCompany}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Technicians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{companyData.technicianCount}</div>
            <p className="text-sm text-muted-foreground">
              {companyUsers.filter(u => u.role === 'tech').length} active technicians
            </p>
            <Link to={`/admin/companies/${id}/technicians`}>
              <Button className="w-full mt-4" variant="outline">
                View Technicians
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold mb-2">{companyData.planName || "No"} Plan</div>
            {companyData.status === 'trial' && companyData.trialEndsAt && (
              <div className="flex items-center gap-2 text-sm text-amber-600 mb-1">
                <Calendar className="h-4 w-4" />
                Trial ends on {format(new Date(companyData.trialEndsAt), "MMM d, yyyy")}
              </div>
            )}
            {companyData.status === 'active' && companyData.subscriptionEndsAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Renews on {format(new Date(companyData.subscriptionEndsAt), "MMM d, yyyy")}
              </div>
            )}
            <Link to={`/admin/companies/${id}/subscription`}>
              <Button className="w-full mt-4" variant="outline">
                Manage Subscription
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Admins</CardTitle>
          </CardHeader>
          <CardContent>
            {companyUsers.filter(u => u.role === 'company').length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No company admins found
              </div>
            ) : (
              <div className="space-y-4">
                {companyUsers
                  .filter(u => u.role === 'company')
                  .map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10">
                            {admin.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{admin.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                            {admin.isMainAdmin && (
                              <Badge variant="secondary" className="text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/users/${admin.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => {
                const { title, time } = formatActivity(activity);
                return (
                  <div key={activity.id} className="p-3 border rounded-md">
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(time).toLocaleDateString('en-US', {
                        month: 'short', 
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technicians ({companyUsers.filter(u => u.role === 'tech').length})</CardTitle>
        </CardHeader>
        <CardContent>
          {companyUsers.filter(u => u.role === 'tech').length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No technicians found for this company
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyUsers
                .filter(u => u.role === 'tech')
                .map(tech => (
                  <div key={tech.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {tech.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">{tech.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/users/${tech.id}`}>
                          View Profile
                        </Link>
                      </Button>
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
