import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Building2, MapPin, Phone, Users } from "lucide-react";

const companyFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  description: z.string().max(500, {
    message: "Bio must not be more than 500 characters.",
  }).optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [companyData, setCompanyData] = useState({
    name: "Acme Repair Services",
    email: "info@acmerepair.com",
    phone: "555-987-6543",
    title: "Owner",
    role: "Company Administrator",
    companyName: "Acme Repair Services",
    address: "123 Main Street",
    city: "Repairville",
    state: "CA",
    zipCode: "90210",
    website: "https://acmerepair.com",
    description: "We specialize in all types of home and office appliance repairs with over 15 years of experience.",
    techCount: 12,
  });

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: companyData.companyName,
      address: companyData.address,
      city: companyData.city,
      state: companyData.state,
      zipCode: companyData.zipCode,
      phone: companyData.phone,
      website: companyData.website,
      description: companyData.description,
    },
  });

  const handleProfileUpdate = (values: any) => {
    setCompanyData({
      ...companyData,
      ...values
    });
  };

  function handleCompanySubmit(values: CompanyFormValues) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setCompanyData({
        ...companyData,
        ...values
      });
      
      toast({
        title: "Company information updated",
        description: "Your company information has been updated successfully.",
      });
      
      setIsSubmitting(false);
    }, 1000);
  }

  const companyDetailsCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-green-500" />
          Company Information
        </CardTitle>
        <CardDescription>
          Update your company's business information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCompanySubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormDescription>
                      Optional: Your company website.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Briefly describe your company..." 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of your company (max 500 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Saving..." : "Save Company Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const techOverviewCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-500" />
          Technician Overview
        </CardTitle>
        <CardDescription>
          Quick overview of your company's technicians.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <div className="text-4xl font-bold text-green-600">{companyData.techCount}</div>
          <p className="text-muted-foreground">Active Technicians</p>
        </div>
        <div className="text-center">
          <Button variant="outline" className="mt-2" asChild>
            <a href="/company/techs">Manage Technicians</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const contactCard = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-500" />
          Contact Details
        </CardTitle>
        <CardDescription>
          Your company's primary contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-500" />
          <div>
            <p>{companyData.address}</p>
            <p>{companyData.city}, {companyData.state} {companyData.zipCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-green-500" />
          <p>{companyData.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <p>{companyData.email}</p>
        </div>
      </CardContent>
    </Card>
  );

  const tabs = [
    {
      id: "account",
      label: "Account",
      content: <ProfileForm defaultValues={companyData} onSubmit={handleProfileUpdate} title="Account Profile" description="Update your personal account details." />
    },
    {
      id: "company",
      label: "Company Details",
      content: (
        <div className="space-y-6">
          {companyDetailsCard}
        </div>
      )
    },
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techOverviewCard}
          {contactCard}
        </div>
      )
    },
    {
      id: "security",
      label: "Security",
      content: <PasswordForm />
    },
  ];

  return (
    <ProfileLayout
      name={companyData.name}
      email={companyData.email}
      role={companyData.role}
      tabs={tabs}
    />
  );
}
