
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pencil, Users, Building, Calendar, Package, Shield, 
  History, Trash2, AlertTriangle, UserPlus, ClipboardList 
} from 'lucide-react';
import { useUserManagementStore } from '@/store/userManagementStore';
import { Badge } from '@/components/ui/badge';
import { DeleteCompanyDialog } from '@/components/companies/DeleteCompanyDialog';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const { fetchCompanyById } = useUserManagementStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "No company ID provided",
            variant: "destructive"
          });
          return;
        }

        const companyData = await fetchCompanyById(id);
        
        if (companyData) {
          setCompany({
            ...companyData,
            id,
            subscriptionPlan: companyData.subscription_tier || 'Basic',
            subscriptionStatus: 'active',
            subscriptionRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            techs: companyData.technicianCount || 0,
            activeTechs: companyData.technicianCount || 0,
            repairs: 0,
            customers: 0,
            createdAt: companyData.created_at || new Date().toISOString(),
            lastActive: new Date().toISOString(),
            industry: 'Service',
            logoUrl: 'https://i.pravatar.cc/150?u=' + id
          });
        } else {
          toast({
            title: "Error",
            description: "Company not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        toast({
          title: "Error",
          description: "Failed to load company data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id, toast, fetchCompanyById]);

  const handleEditCompany = () => {
    // Navigate to edit company page - to be implemented
    toast({
      title: "Edit Company",
      description: "Edit functionality to be implemented",
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trial':
        return 'secondary';
      case 'expired':
        return 'destructive';
      case 'inactive':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-40 bg-gray-200 rounded mt-2"></div>
            </div>
            <div className="h-9 w-28 bg-gray-200 rounded"></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Company not found</h1>
        <p className="mb-4">The requested company could not be found or you don't have permission to view it.</p>
        <Button asChild><Link to="/admin/companies">Back to Companies</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
            <Badge variant={getBadgeVariant(company.subscriptionStatus)}>{company.subscriptionStatus}</Badge>
          </div>
          <p className="text-muted-foreground">ID: {company.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button size="sm" onClick={handleEditCompany}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Company
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p>{company.industry}</p>
                  </div>
                </div>
                {company.email && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 mr-3">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{company.email}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 mr-3">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{company.phone}</p>
                    </div>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 mr-3">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{company.address}</p>
                      {(company.city || company.state) && (
                        <p>{[company.city, company.state, company.zip_code].filter(Boolean).join(', ')}</p>
                      )}
                      {company.country && <p>{company.country}</p>}
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p>{new Date(company.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-medium">{company.subscriptionPlan}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center">
                      <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        company.subscriptionStatus === 'active' ? 'bg-green-500' : 
                        company.subscriptionStatus === 'trial' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></span>
                      <p className="capitalize">{company.subscriptionStatus}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Next Renewal</p>
                    <p>{new Date(company.subscriptionRenewal).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Subscription Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {company.subscriptionPlan === 'enterprise' ? "Unlimited Technicians" : 
                       company.subscriptionPlan === 'professional' ? "Up to 20 Technicians" : 
                       "Up to 5 Technicians"}
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {company.subscriptionPlan === 'basic' ? "Basic Workflows" : "Custom Workflows"}
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {company.subscriptionPlan === 'enterprise' ? "Advanced Analytics" : 
                       company.subscriptionPlan === 'professional' ? "Standard Analytics" : 
                       "Basic Analytics"}
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {company.subscriptionPlan !== 'basic' ? "API Access" : "Limited API Access"}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-blue-500 mr-4" />
                  <div>
                    <p className="text-3xl font-bold">{company.techs}</p>
                    <p className="text-sm text-gray-500">Total Technicians</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Technicians</span>
                    <span className="font-medium">{company.activeTechs}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{
                      width: company.techs > 0 ? `${(company.activeTechs / company.techs) * 100}%` : '0%'
                    }}></div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/companies/${id}/technicians`)}>
                      <Users className="h-4 w-4 mr-1" /> Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Repairs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ClipboardList className="h-12 w-12 text-green-500 mr-4" />
                  <div>
                    <p className="text-3xl font-bold">{company.repairs}</p>
                    <p className="text-sm text-gray-500">Completed Repairs</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <p>No repair history available</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/companies/${id}/repairs`)}>
                      <History className="h-4 w-4 mr-1" /> View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customers Served</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-purple-500 mr-4" />
                  <div>
                    <p className="text-3xl font-bold">{company.customers}</p>
                    <p className="text-sm text-gray-500">Total Customers</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <History className="h-4 w-4 mr-1" />
                    <span>Last active: {new Date(company.lastActive).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/companies/${id}/customers`)}>
                      <Users className="h-4 w-4 mr-1" /> View Customers
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4">Current Plan: {company.subscriptionPlan}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Status</span>
                      <Badge variant={getBadgeVariant(company.subscriptionStatus)}>{company.subscriptionStatus}</Badge>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Next billing date</span>
                      <span>{new Date(company.subscriptionRenewal).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Price</span>
                      <span>$XX.XX / month</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Payment method</span>
                      <span>Not available</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button>Change Plan</Button>
                    <Button variant="outline">Billing History</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Technicians</span>
                        <span>{company.techs} / {
                          company.subscriptionPlan === 'enterprise' ? 'Unlimited' : 
                          company.subscriptionPlan === 'professional' ? '20' : '5'
                        }</span>
                      </div>
                      {company.subscriptionPlan !== 'enterprise' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-500 h-2 rounded-full" style={{
                            width: company.subscriptionPlan === 'professional' ? 
                              `${(company.techs / 20) * 100}%` : 
                              `${(company.techs / 5) * 100}%`
                          }}></div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span>XX GB / {
                          company.subscriptionPlan === 'enterprise' ? '100 GB' : 
                          company.subscriptionPlan === 'professional' ? '20 GB' : '5 GB'
                        }</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '10%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>API Calls</span>
                        <span>XXX / {
                          company.subscriptionPlan === 'enterprise' ? 'Unlimited' : 
                          company.subscriptionPlan === 'professional' ? '10,000' : '1,000'
                        }</span>
                      </div>
                      {company.subscriptionPlan !== 'enterprise' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '5%'}}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Technicians</CardTitle>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Technician
              </Button>
            </CardHeader>
            <CardContent>
              {company.techs > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                      <div>
                        <h3 className="font-medium">Sample Technician</h3>
                        <p className="text-sm text-muted-foreground">sample@example.com</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-center text-muted-foreground py-4">
                    This is sample data. Real technician management will be implemented.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No Technicians</h3>
                  <p className="text-muted-foreground">This company doesn't have any technicians yet.</p>
                  <Button className="mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Technician
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflows" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Workflow management will be implemented soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Activity logs will be implemented soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <div className="border border-red-200 rounded p-4 bg-red-50">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium text-red-900">Delete Company</h4>
                        <p className="text-sm text-red-700 mb-3">
                          This will permanently delete the company and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                          Delete Company
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteCompanyDialog 
        companyId={id || ''}
        companyName={company.name}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        redirectPath="/admin/companies"
      />
    </div>
  );
}
