import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil, Users, Building, Calendar, Package, Shield, History } from 'lucide-react';

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "No company ID provided",
            type: "error"
          });
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCompany({
          id,
          name: 'Acme Repairs Inc.',
          email: 'contact@acmerepairs.com',
          phone: '555-123-4567',
          address: '123 Service Ave, Repair City, RC 98765',
          logoUrl: 'https://i.pravatar.cc/150?u=acme',
          industry: 'Appliance Repair',
          subscriptionPlan: 'Business Plus',
          subscriptionStatus: 'active',
          subscriptionRenewal: '2023-12-15',
          techs: 12,
          activeTechs: 8,
          repairs: 576,
          customers: 342,
          createdAt: '2020-03-15',
          lastActive: '2023-06-02'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load company data",
          type: "error"
        });
      }
    };

    fetchCompanyData();
  }, [id, toast]);

  if (loading) {
    return <div className="animate-pulse p-6">Loading company details...</div>;
  }

  if (!company) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Company not found</h1>
        <p className="mb-4">The requested company could not be found or you don't have permission to view it.</p>
        <Button asChild><Link to="/admin/companies">Back to Companies</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">ID: {company.id}</p>
        </div>
        <Button size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Company
        </Button>
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
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p>{company.industry}</p>
                  </div>
                </div>
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
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 mr-3">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{company.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p>{new Date(company.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-4">
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
                        company.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
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
                      Unlimited Technicians
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Custom Workflows
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced Analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      API Access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-medium mb-2">Technicians</h3>
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
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${(company.activeTechs / company.techs) * 100}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-medium mb-2">Total Repairs</h3>
              <div className="flex items-center">
                <Pencil className="h-12 w-12 text-green-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">{company.repairs}</p>
                  <p className="text-sm text-gray-500">Completed Repairs</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  <span>12% increase from last month</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-medium mb-2">Customers Served</h3>
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
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription">
          <div className="p-6 bg-gray-50 rounded-md">
            <p className="text-center text-gray-500">Subscription details will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="technicians">
          <div className="p-6 bg-gray-50 rounded-md">
            <p className="text-center text-gray-500">Technician management will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="workflows">
          <div className="p-6 bg-gray-50 rounded-md">
            <p className="text-center text-gray-500">Workflow management will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="p-6 bg-gray-50 rounded-md">
            <p className="text-center text-gray-500">Activity logs will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="p-6 bg-gray-50 rounded-md">
            <p className="text-center text-gray-500">Company settings will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
