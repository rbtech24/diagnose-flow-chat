
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check, Building, Wrench, ArrowRight, ArrowLeft } from 'lucide-react';
import { showToast } from '@/utils/toast-helpers';

const FormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits."
  }).optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  confirmPassword: z.string(),
  role: z.enum(['company', 'tech'])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function SignUp() {
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentRole, setCurrentRole] = useState<'company' | 'tech'>('tech');

  // Initialize role from URL parameters on component mount
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['company', 'tech'].includes(roleParam)) {
      setCurrentRole(roleParam as 'company' | 'tech');
    } else if (!roleParam) {
      // If no role in URL, set default and update URL
      updateRoleInURL('tech');
    }
    
    console.log("SignUp page initialized:", {
      pathname: location.pathname,
      queryParams: Object.fromEntries(searchParams.entries()),
      selectedRole: currentRole
    });
  }, []);

  // Update form when role changes
  useEffect(() => {
    form.setValue('role', currentRole);
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Submitting form with data:", { ...data, password: "********" });
      await register(data.email, data.password, {
        role: data.role,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber
      });
      
      navigate('/verify-email', { 
        state: { email: data.email }
      });
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Left side - Promotional content - always visible regardless of screen size */}
      <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col">
        <Link to="/" className="inline-flex items-center text-blue-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
            alt="Repair Autopilot" 
            className="h-12 w-auto" 
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
            Start with a 14-day free trial
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
      
      {/* Right side - Form */}
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Simplified mobile form (ONLY shows on small screens) */}
      <div className="lg:hidden fixed inset-0 bg-white p-6 overflow-y-auto">
        <div className="max-w-md mx-auto pt-8">
          <Link to="/" className="inline-flex items-center text-blue-600 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>

          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
              alt="Repair Autopilot" 
              className="h-10 w-auto" 
            />
          </div>

          <h1 className="text-2xl font-bold mb-1 text-center">Create Your Account</h1>
          <p className="text-gray-600 text-center mb-6">Choose your account type below</p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
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
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
