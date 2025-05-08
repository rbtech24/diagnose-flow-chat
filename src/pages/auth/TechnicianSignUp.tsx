
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/utils/supabaseClient";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  })
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function TechnicianSignUp() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      agreeToTerms: false
    }
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            role: 'tech',
            is_independent: true
          }
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // 2. Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: 'tech',
          status: 'pending',
        }]);

      if (userError) throw userError;
      
      // 3. Create technician record
      const { error: techError } = await supabase
        .from('technicians')
        .insert([{
          id: authData.user.id,
          email: data.email,
          role: 'tech',
          phone: data.phone,
          is_independent: true,
          status: 'pending',
          available_for_hire: false
        }]);

      if (techError) throw techError;
      
      // Success
      setSuccess(true);
      toast.success("Registration successful! Please check your email to verify your account.");
      
      // Redirect after a delay
      setTimeout(() => {
        navigate("/auth/onboarding");
      }, 3000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific cases
      if (error.message?.includes("already registered")) {
        setErrorMessage("This email is already registered. Please log in instead.");
      } else {
        setErrorMessage(error.message || "Failed to register. Please try again.");
      }
      
      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-center">Registration Successful!</CardTitle>
            <CardDescription className="text-center">
              Please check your email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              We've sent a verification email to <strong>{form.getValues("email")}</strong>.
              Click the link in the email to complete your registration.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to the onboarding page shortly...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/auth/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create Technician Account</CardTitle>
          <CardDescription>
            Sign up as an independent technician to access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                {...form.register("name")} 
                placeholder="John Doe"
                autoComplete="name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                {...form.register("email")} 
                placeholder="john@example.com"
                autoComplete="email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...form.register("password")} 
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input 
                id="phone" 
                type="tel" 
                {...form.register("phone")} 
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                {...form.register("agreeToTerms")}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {form.formState.errors.agreeToTerms && (
              <p className="text-sm text-red-500">{form.formState.errors.agreeToTerms.message}</p>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            Are you part of a company?{" "}
            <Link to="/auth/company-signup" className="text-primary hover:underline">
              Sign up as a company
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
