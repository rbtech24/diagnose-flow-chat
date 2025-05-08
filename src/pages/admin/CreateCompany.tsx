
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function CreateCompany() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "Service Wranglers LLC",
    email: "rod@servicewranglers.com",
    contactName: "Rod",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert the company into the database
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          { 
            name: formData.name,
            subscription_tier: 'basic',
            trial_status: 'active',
            trial_period: 30
          }
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // Create a company admin user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: "tempPassword123", // This would be changed by the user on first login
        email_confirm: true,
        user_metadata: { 
          role: 'company_admin',
          name: formData.contactName,
          company_id: companyData.id
        }
      });

      if (userError) throw userError;

      // Create technician record for user
      const { error: techError } = await supabase
        .from('technicians')
        .insert([{
          id: userData.user.id,
          email: formData.email,
          company_id: companyData.id,
          role: 'company_admin',
          status: 'active'
        }]);

      if (techError) throw techError;

      // Log user activity
      await supabase
        .from('user_activity_logs')
        .insert([{
          user_id: userData.user.id,
          activity_type: 'account',
          description: 'Company account created',
          metadata: { company_id: companyData.id }
        }]);

      toast.success("Company created successfully", {
        description: `${formData.name} has been added to the system.`
      });

      navigate(`/admin/companies/${companyData.id}`);
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Failed to create company", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Create New Company</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Create a new company account in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
