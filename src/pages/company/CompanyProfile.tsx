
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompanyProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Mock company profile state
  const [profile, setProfile] = useState({
    name: "Acme Repair Services",
    email: "contact@acmerepair.com",
    phone: "555-123-4567",
    address: {
      street: "123 Repair Lane",
      city: "Fixitville",
      state: "CA",
      zip: "90210",
      country: "United States"
    },
    description: "Leading provider of appliance repair services with over 20 years of experience.",
    industry: "Appliance Repair",
    website: "https://acmerepair.com",
    taxId: "12-3456789",
    foundedYear: 2000,
    employeeCount: "10-49"
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Profile updated",
        description: "Your company profile has been updated successfully.",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Company Profile</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={profile.industry}
                    onValueChange={(value) => handleInputChange('industry', value)}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appliance Repair">Appliance Repair</SelectItem>
                      <SelectItem value="HVAC">HVAC</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="General Contracting">General Contracting</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea 
                  id="description"
                  value={profile.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    type="url"
                    value={profile.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Year Founded</Label>
                  <Input 
                    id="foundedYear"
                    type="number"
                    value={profile.foundedYear.toString()}
                    onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input 
                    id="taxId"
                    value={profile.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Select 
                    value={profile.employeeCount}
                    onValueChange={(value) => handleInputChange('employeeCount', value)}
                  >
                    <SelectTrigger id="employeeCount">
                      <SelectValue placeholder="Select employee count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-9">1-9</SelectItem>
                      <SelectItem value="10-49">10-49</SelectItem>
                      <SelectItem value="50-99">50-99</SelectItem>
                      <SelectItem value="100-499">100-499</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street"
                  value={profile.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={profile.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input 
                    id="state"
                    value={profile.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input 
                    id="zip"
                    value={profile.address.zip}
                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    value={profile.address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
