
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Mail, Phone, MapPin, CalendarClock, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyProfile() {
  const { user } = useAuth();
  const { fetchCompanyById, updateCompany } = useUserManagementStore();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    contact_name: '',
    description: '',
  });

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user?.companyId) return;
      
      setLoading(true);
      try {
        const companyData = await fetchCompanyById(user.companyId);
        if (companyData) {
          setCompany(companyData);
          setFormData({
            name: companyData.name || '',
            email: companyData.email || '',
            phone: companyData.phone || '',
            address: companyData.address || '',
            city: companyData.city || '',
            state: companyData.state || '',
            zip_code: companyData.zip_code || '',
            country: companyData.country || '',
            contact_name: companyData.contact_name || '',
            description: companyData.description || '',
          });
        }
      } catch (error) {
        console.error("Error loading company data:", error);
        toast.error("Failed to load company information");
      } finally {
        setLoading(false);
      }
    };
    
    loadCompanyData();
  }, [user, fetchCompanyById]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    if (!company?.id) return;
    
    setIsSaving(true);
    try {
      // Here we call the API to update the company profile
      const success = await updateCompany(company.id, formData);
      
      if (success) {
        toast.success("Company profile updated successfully");
        setEditing(false);
        
        // Update local company data
        setCompany({
          ...company,
          ...formData
        });
      } else {
        toast.error("Failed to update company profile");
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("An error occurred while updating company profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">Company Profile</h1>
        <p className="text-red-500 mb-4">Unable to load company information</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">View and update your company information</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditing(false);
                // Reset form data to company data
                if (company) {
                  setFormData({
                    name: company.name || '',
                    email: company.email || '',
                    phone: company.phone || '',
                    address: company.address || '',
                    city: company.city || '',
                    state: company.state || '',
                    zip_code: company.zip_code || '',
                    country: company.country || '',
                    contact_name: company.contact_name || '',
                    description: company.description || '',
                  });
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Your company's basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Primary Contact Name</Label>
                      <Input
                        id="contact_name"
                        name="contact_name"
                        value={formData.contact_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">ZIP Code</Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{company.name}</p>
                    </div>
                  </div>
                  
                  {company.contact_name && (
                    <div className="flex items-center">
                      <div className="h-5 w-5 mr-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Primary Contact</p>
                        <p className="font-medium">{company.contact_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.description && (
                    <div className="flex">
                      <div className="h-5 w-5 mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium">{company.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{company.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{company.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{company.address}</p>
                        {(company.city || company.state) && (
                          <p>{[company.city, company.state, company.zip_code].filter(Boolean).join(', ')}</p>
                        )}
                        {company.country && <p>{company.country}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
              <CardDescription>Details about your current plan and subscription status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="font-medium">{company.subscription_tier ? company.subscription_tier.charAt(0).toUpperCase() + company.subscription_tier.slice(1) : 'Basic'}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => toast.success("This feature is coming soon!")}>Upgrade</Button>
                </div>
                
                <div className="flex justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-5 w-5 mr-4 flex items-center justify-center">
                      <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        company.trial_status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{company.trial_status || 'Active'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between border-b pb-4">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 text-gray-400 mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{new Date(company.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {company.trial_period && (
                  <div className="flex justify-between border-b pb-4">
                    <div className="flex items-center">
                      <CalendarClock className="h-5 w-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500">Trial Period</p>
                        <p className="font-medium">{company.trial_period} days</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button variant="default" onClick={() => toast.success("This feature is coming soon!")}>Manage Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <CardTitle>Technicians</CardTitle>
              <CardDescription>Manage technicians in your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total technicians: {company.technicianCount || 0}</p>
                </div>
                <Button onClick={() => toast.success("Go to Technicians page to manage your team")}>
                  Manage Technicians
                </Button>
              </div>
              
              {/* Placeholder for technicians list, will be implemented in future */}
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">Go to the Technicians section to view and manage your team members</p>
                <Button variant="link" onClick={() => window.location.href = "/company/technicians"}>
                  View Technicians
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
