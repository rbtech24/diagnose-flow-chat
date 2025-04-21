
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, Building, Wrench, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { showToast } from '@/utils/toast-helpers';

// Enhanced form schema with stronger validation
const FormSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name should only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .refine(email => email.indexOf('@') > 0, "Please enter a valid email address"),
  
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[0-9\s()-]+$/, "Please enter a valid phone number")
    .optional(),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  
  confirmPassword: z.string(),
  
  role: z.enum(['company', 'tech'])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Error messages mapped to user-friendly descriptions
const errorMessageMap: Record<string, string> = {
  "Email already in use": "This email is already registered. Please use a different email or try logging in.",
  "Invalid email": "The email address format is incorrect. Please check and try again.",
  "weak-password": "The password you provided is too weak. Please make it stronger.",
  "Password too short": "Your password needs to be at least 8 characters long.",
  "Missing email": "Please provide an email address to continue.",
  "Missing password": "Please provide a password to continue.",
  "network-request-failed": "Network connection issue. Please check your internet connection and try again.",
  "too-many-requests": "Too many attempts. Please try again later.",
  "internal-error": "Something went wrong on our end. Please try again later.",
};

export default function SignUp() {
  const { register, signUp } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentRole, setCurrentRole] = useState<'company' | 'tech'>('tech');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['company', 'tech'].includes(roleParam)) {
      setCurrentRole(roleParam as 'company' | 'tech');
    } else if (!roleParam) {
      updateRoleInURL('tech');
    }
    
    console.log("SignUp page initialized:", {
      pathname: location.pathname,
      queryParams: Object.fromEntries(searchParams.entries()),
      selectedRole: currentRole
    });
  }, []);

  useEffect(() => {
    if (form) {
      form.setValue('role', currentRole);
    }
  }, [currentRole]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: currentRole
    }
  });

  const updateRoleInURL = (newRole: 'company' | 'tech') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('role', newRole);
    setSearchParams(newParams, { replace: true });
  };

  const updateRole = (newRole: 'company' | 'tech') => {
    setCurrentRole(newRole);
    updateRoleInURL(newRole);
    console.log(`Role updated to: ${newRole}`);
  };

  const getErrorMessage = (errorMsg: string): string => {
    // Check if we have a custom message for this error
    for (const [key, value] of Object.entries(errorMessageMap)) {
      if (errorMsg.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    // Return the original message if no match found
    return errorMsg;
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Submitting form with data:", { ...data, password: "********" });
      
      // Improved error handling during signup
      const result = await signUp(data.email, data.password, data.role, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber
      });
      
      // If using the mock implementation that doesn't throw errors
      if (result && !result.error) {
        showToast.success('Account created successfully! Please verify your email.');
        navigate('/verify-email', { 
          state: { email: data.email }
        });
      } else if (result && result.error) {
        // Handle specific error from the mock or real implementation
        throw new Error(result.error.message || "An error occurred during sign up");
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      const friendlyErrorMessage = getErrorMessage(err.message || 'An error occurred during sign up.');
      setError(friendlyErrorMessage);
      showToast.error(friendlyErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col">
        <Link to="/" className="inline-flex items-center text-blue-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png"
            alt="Repair Auto Pilot Logo" 
            className="h-16 w-auto object-contain"
            style={{ maxWidth: 250 }}
          />
        </div>
        
        <div className="mt-8 mb-10">
          <h2 className="text-xl font-medium mb-4">Get immediate access to powerful diagnostic workflows for appliance repair professionals.</h2>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <span className="flex h-6 w-6 rounded-full bg-blue-100 text-blue-600 items-center justify-center mr-2">
              <Check className="h-4 w-4" />
            </span>
            Start with a 30-day free trial
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Full access to all features</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>No credit card required</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span>Choose a subscription plan later</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Individual Technician</h3>
              <p className="text-gray-600">Access to diagnostic workflows, repair guides, and tracking tools.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Affordable Plan</h3>
              <p className="text-gray-600">Low monthly fee with access to all features.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-white p-8 md:p-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Join Repair Auto Pilot</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-1">Create Your Account</h2>
            <p className="text-gray-600">Choose your account type below</p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => updateRole('tech')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                    currentRole === 'tech' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="h-5 w-5" />
                  <span>Technician</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateRole('company')}
                  className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                    currentRole === 'company' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span>Company</span>
                </button>
              </div>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="name@example.com" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        onFocus={() => setShowPasswordRequirements(true)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showPasswordRequirements && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium flex items-center mb-2">
                    <Info className="h-4 w-4 mr-1 text-blue-600" />
                    Password Requirements
                  </h4>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one uppercase letter (A-Z)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one lowercase letter (a-z)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one number (0-9)</span>
                    </li>
                  </ul>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating account...' : 
                  `Create ${currentRole === 'tech' ? 'Technician' : 'Company'} Account`
                }
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </form>
          </Form>
        </div>
      </div>

      <div className="lg:hidden fixed inset-0 bg-white p-6 overflow-y-auto">
        <div className="max-w-md mx-auto pt-8">
          <Link to="/" className="inline-flex items-center text-blue-600 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>

          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png"
              alt="Repair Auto Pilot Logo"
              className="h-16 w-auto object-contain"
              style={{ maxWidth: 200 }}
            />
          </div>

          <h1 className="text-2xl font-bold mb-1 text-center">Create Your Account</h1>
          <p className="text-gray-600 text-center mb-6">Choose your account type below</p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  type="button"
                  onClick={() => updateRole('tech')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm ${
                    currentRole === 'tech' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="h-4 w-4" />
                  <span>Technician</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => updateRole('company')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm ${
                    currentRole === 'company' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Company</span>
                </button>
              </div>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="name@example.com" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        onFocus={() => setShowPasswordRequirements(true)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showPasswordRequirements && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium flex items-center mb-2">
                    <Info className="h-4 w-4 mr-1 text-blue-600" />
                    Password Requirements
                  </h4>
                  <ul className="text-xs space-y-1 text-gray-600">
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one uppercase letter (A-Z)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one lowercase letter (a-z)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 mr-1" />
                      <span>At least one number (0-9)</span>
                    </li>
                  </ul>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-blue-50 rounded-lg p-4 my-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Check className="h-4 w-4 text-blue-600 mr-1" />
                  Start with a 14-day free trial
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-3 w-3 text-blue-600 mt-1 mr-1" />
                    <span>Full access to all features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-3 w-3 text-blue-600 mt-1 mr-1" />
                    <span>No credit card required</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating account...' : 
                  `Create ${currentRole === 'tech' ? 'Technician' : 'Company'} Account`
                }
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
