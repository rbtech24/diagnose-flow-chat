
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagementStore } from '@/store/userManagementStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CompanyNew() {
  const navigate = useNavigate();
  const { addCompany, error: storeError, clearError } = useUserManagementStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    subscription_tier: 'basic',
    contact_name: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear form error if the user is changing input
    if (formError) setFormError(null);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Company name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    clearError();
    setIsSubmitting(true);
    
    try {
      console.log("Submitting company data:", formData);
      const result = await addCompany(formData);
      
      if (result && result.id) {
        toast.success(`Company ${formData.name} created successfully`);
        console.log("Company created, navigating to:", `/admin/companies/${result.id}`);
        navigate(`/admin/companies/${result.id}`);
      } else {
        console.error("Company creation failed: No result returned");
        toast.error("Failed to create company");
        setFormError("Company creation failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(error.message || "An error occurred while creating the company");
      setFormError(error.message || "Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Company</h1>
          <p className="text-muted-foreground">Add a new company to the platform</p>
        </div>
      </div>

      {(formError || storeError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{formError || storeError}</AlertTitle>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_name">Primary Contact Name</Label>
                <Input 
                  id="contact_name" 
                  name="contact_name" 
                  value={formData.contact_name} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP / Postal Code</Label>
                  <Input 
                    id="zip_code" 
                    name="zip_code" 
                    value={formData.zip_code} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subscription_tier">Subscription Plan</Label>
                <Select
                  value={formData.subscription_tier}
                  onValueChange={(value) => handleSelectChange('subscription_tier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/companies')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
