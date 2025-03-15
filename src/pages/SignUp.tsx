import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Building2, Wrench, Users, UserPlus } from "lucide-react";

const techAccountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const companyAccountSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  numTechs: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid number of technicians"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match", 
  path: ["confirmPassword"]
});

type TechFormValues = z.infer<typeof techAccountSchema>;
type CompanyFormValues = z.infer<typeof companyAccountSchema>;

export default function SignUp() {
  const [accountType, setAccountType] = useState<"tech" | "company">("tech");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const techForm = useForm<TechFormValues>({
    resolver: zodResolver(techAccountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });
  
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyAccountSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      password: "",
      confirmPassword: "",
      numTechs: "1",
    }
  });
  
  const onTechSubmit = (data: TechFormValues) => {
    console.log("Tech signup data:", data);
    toast({
      title: "Account created",
      description: "Your technician account has been created successfully.",
      variant: "default",
    });
    navigate("/login");
  };
  
  const onCompanySubmit = (data: CompanyFormValues) => {
    console.log("Company signup data:", data);
    toast({
      title: "Account created",
      description: "Your company account has been created successfully.",
      variant: "default",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
              alt="Repair Auto Pilot" 
              className="h-24"
            />
          </div>
          
          <p className="text-xl mb-8 text-gray-700">
            {accountType === "tech" 
              ? "Get immediate access to powerful diagnostic workflows for appliance repair professionals." 
              : "Empower your repair company with a centralized system for all your technicians."}
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="rounded-full bg-blue-100 p-2">
                  {accountType === "tech" ? (
                    <Wrench className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Users className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">
                  {accountType === "tech" ? "Individual Technician" : "Company Management"}
                </h3>
                <p className="text-gray-600">
                  {accountType === "tech" 
                    ? "Access to diagnostic workflows, repair guides, and tracking tools." 
                    : "Oversee multiple technicians, assign workflows, and monitor performance."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="rounded-full bg-blue-100 p-2">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">
                  {accountType === "tech" ? "Affordable Plan" : "Custom Solutions"}
                </h3>
                <p className="text-gray-600">
                  {accountType === "tech" 
                    ? "Low monthly fee with access to all features." 
                    : "Scale your account based on the size of your technician team."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Join Repair Auto Pilot</h1>
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Choose your account type below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="tech" 
                value={accountType} 
                onValueChange={(value) => setAccountType(value as "tech" | "company")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="tech" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Technician
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="tech">
                  <Form {...techForm}>
                    <form onSubmit={techForm.handleSubmit(onTechSubmit)} className="space-y-4">
                      <FormField
                        control={techForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={techForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={techForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={techForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create Technician Account
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="company">
                  <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                      <FormField
                        control={companyForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Repair" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="numTechs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Technicians</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormDescription>
                              How many technician accounts do you need?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create Company Account
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col text-sm text-gray-500">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
