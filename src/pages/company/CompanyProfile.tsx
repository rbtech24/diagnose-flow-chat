
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagementStore } from "@/store/userManagementStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CompanyProfile() {
  const { user } = useAuth();
  const { fetchCompanyById, updateUser } = useUserManagementStore();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contact_name: ''
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
            contact_name: companyData.contact_name || '',
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    // Here we would update the company profile
    // This is a placeholder for actual implementation
    setEditing(false);
    toast.success("Profile updated successfully");
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
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Current Plan</span>
              <span>{company.subscription_tier ? company.subscription_tier.charAt(0).toUpperCase() + company.subscription_tier.slice(1) : 'Basic'}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Status</span>
              <div className="flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                  company.trial_status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="capitalize">{company.trial_status || 'Active'}</span>
              </div>
            </div>
            
            {company.trial_period && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Trial Period</span>
                <span>{company.trial_period} days</span>
              </div>
            )}
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Member Since</span>
              <span>{new Date(company.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="pt-2">
              <Button>Manage Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
