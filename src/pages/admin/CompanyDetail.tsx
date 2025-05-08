import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagementStore } from "@/store/userManagementStore";
import { DeleteCompanyDialog } from "@/components/company/DeleteCompanyDialog";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin,
  CalendarClock,
  Users,
  CreditCard,
  Settings
} from "lucide-react";
import { TechnicianManagement } from "@/components/technicians/TechnicianManagement";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { fetchCompanyById } = useUserManagementStore();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Get subscription plans
  const { plans } = useSubscriptionStore();

  useEffect(() => {
    const loadCompanyData = async () => {
      if (id) {
        setLoading(true);
        try {
          const companyData = await fetchCompanyById(id);
          if (companyData) {
            setCompany(companyData);
          } else {
            navigate("/admin/companies", { replace: true });
          }
        } catch (error) {
          console.error("Error loading company:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCompanyData();
  }, [id, fetchCompanyById, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex animate-pulse flex-col gap-5">
          <div className="h-8 w-1/3 rounded-md bg-muted"></div>
          <div className="h-[300px] rounded-md bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Company not found</h1>
          <p className="mt-2 text-muted-foreground">
            The company you are looking for does not exist or you do not have permission to view it.
          </p>
          <Button onClick={() => navigate("/admin/companies")} className="mt-4">
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  const getTrialStatus = () => {
    if (!company.trial_status || company.trial_status === "inactive") {
      return { label: "No Trial", variant: "outline" as const };
    }
    
    if (company.trial_status === "active") {
      const trialEndDate = company.trial_end_date ? new Date(company.trial_end_date) : null;
      const now = new Date();
      
      if (trialEndDate && trialEndDate > now) {
        const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { 
          label: `Trial (${daysLeft} days left)`, 
          variant: "default" as const 
        };
      }
      
      return { label: "Trial Active", variant: "default" as const };
    }
    
    if (company.trial_status === "expired") {
      return { label: "Trial Expired", variant: "destructive" as const };
    }
    
    return { label: company.trial_status, variant: "outline" as const };
  };

  const trialStatus = getTrialStatus();

  const getPlanDetails = () => {
    const planId = company.plan_id;
    if (!planId) return { 
      name: company.subscription_tier || "Basic",
      dailyDiagnostics: 10,
      storageLimit: "5GB"
    };
    
    const plan = plans.find(p => p.id === planId);
    return plan || { 
      name: company.subscription_tier || "Basic",
      dailyDiagnostics: 10,
      storageLimit: "5GB"
    };
  };

  const plan = getPlanDetails();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/companies")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/admin/companies/${id}/edit`)}
          >
            Edit Company
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Company
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-start space-y-4">
                <div className="rounded-md bg-primary/10 p-2">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">{company.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={company.status === "active" ? "default" : "secondary"}>
                      {company.status || "Active"}
                    </Badge>
                    <Badge variant={trialStatus.variant}>{trialStatus.label}</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3 w-full">
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{company.email || "No email provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{company.phone || "No phone provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{company.address || "No address provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarClock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {company.created_at ? new Date(company.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Subscription Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Plan</span>
                <Badge variant="outline" className="capitalize">
                  {plan.name}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Trial Status</span>
                <Badge variant={trialStatus.variant}>{trialStatus.label}</Badge>
              </div>
              
              {company.trial_end_date && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trial Ends</span>
                  <span>{new Date(company.trial_end_date).toLocaleDateString()}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("subscription")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="technicians">
                <Users className="mr-2 h-4 w-4" />
                Technicians
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Company Name</p>
                        <p>{company.name}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Contact Name</p>
                        <p>{company.contact_name || "Not specified"}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Email</p>
                        <p>{company.email || "Not specified"}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p>{company.phone || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Address</h3>
                      <address className="not-italic">
                        {company.address ? (
                          <>
                            <p>{company.address}</p>
                            <p>
                              {company.city && `${company.city}, `}
                              {company.state && `${company.state} `}
                              {company.zip_code}
                            </p>
                            <p>{company.country}</p>
                          </>
                        ) : (
                          <p className="text-muted-foreground">No address provided</p>
                        )}
                      </address>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <p>{company.description || "No description provided"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="technicians">
                {id && <TechnicianManagement companyId={id} />}
              </TabsContent>
              
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium capitalize">{plan.name} Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              Current subscription tier
                            </p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {company.status || "Active"}
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Plan Details</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-muted-foreground w-1/3">Technicians:</span>
                            <span>{company.technicianCount || "0"} / {company.maxTechnicians || "5"}</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-muted-foreground w-1/3">Diagnostics:</span>
                            <span>{plan.dailyDiagnostics || "10"} per day</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-muted-foreground w-1/3">Storage:</span>
                            <span>{plan.storageLimit || "5GB"}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div className="pt-2 space-y-4">
                        <h3 className="font-medium">Change Subscription</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {plans.map((plan) => (
                            <div 
                              key={plan.id} 
                              className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
                                company.subscription_tier === plan.name.toLowerCase() ? "border-primary bg-primary/5" : ""
                              }`}
                            >
                              <h4 className="font-medium">{plan.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ${plan.price_monthly}/mo
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <Button className="w-full">
                          Update Subscription
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">Danger Zone</h3>
                      <div className="border border-destructive/50 rounded-lg p-4">
                        <div className="flex flex-col space-y-3">
                          <div>
                            <h4 className="font-medium text-destructive">Delete Company</h4>
                            <p className="text-sm text-muted-foreground">
                              This action cannot be undone. This will permanently delete the company
                              and all associated data.
                            </p>
                          </div>
                          <Button 
                            variant="destructive" 
                            onClick={() => setIsDeleteDialogOpen(true)}
                          >
                            Delete Company
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      {id && company && (
        <DeleteCompanyDialog
          companyId={id}
          companyName={company.name}
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}
