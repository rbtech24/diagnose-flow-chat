
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { AlertTriangle, Check, Building, Wrench, ArrowRight, Star } from 'lucide-react';

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'company'
    }
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Pass the role to the register function
      await register(data.email, data.password, {
        role: data.role,
        // You can add more user metadata here
      });
      
      // Navigate to the verification page
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
    <div className="flex min-h-screen">
      {/* Sales content side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 flex-col justify-between">
        <div>
          <img 
            src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
            alt="Repair Autopilot" 
            className="h-12 w-auto mb-12" 
          />
          
          <h1 className="text-3xl font-bold mb-4">Transform Your Repair Business Today</h1>
          <p className="text-lg mb-8 text-blue-100">Join hundreds of successful repair companies already using Repair Auto Pilot to streamline operations and boost productivity.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">40% Increased Productivity</h3>
                <p className="text-blue-100">Our diagnostic workflows reduce repair time and increase technician efficiency.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">82% First-Time Fix Rate</h3>
                <p className="text-blue-100">Technicians arrive prepared with the right knowledge to solve problems on the first visit.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold">No Credit Card Required</h3>
                <p className="text-blue-100">Start your 30-day free trial today and experience the difference.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-blue-500 pt-6">
          <div className="flex items-center">
            <img src="/lovable-uploads/83ff694d-eb6c-4d23-9e13-2f1b96f3258e.png" alt="Customer" className="h-12 w-12 rounded-full object-cover" />
            <div className="ml-4">
              <p className="font-medium">"Repair Auto Pilot has revolutionized our business. Our technicians complete jobs faster and our customers are happier than ever."</p>
              <p className="text-blue-200 mt-1">— Robert Johnson, Elite Appliance Repair</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Signup form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
            <p className="text-gray-600 mt-2">Sign up for your 30-day free trial</p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-gray-700">I am a:</p>
                <div className="flex gap-4">
                  <div 
                    className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${form.watch('role') === 'company' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => form.setValue('role', 'company')}
                  >
                    <div className="flex justify-center mb-2">
                      <Building className={`h-6 w-6 ${form.watch('role') === 'company' ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-center font-medium">Company</div>
                  </div>
                  
                  <div 
                    className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${form.watch('role') === 'tech' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => form.setValue('role', 'tech')}
                  >
                    <div className="flex justify-center mb-2">
                      <Wrench className={`h-6 w-6 ${form.watch('role') === 'tech' ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="text-center font-medium">Technician</div>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="name@company.com" 
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50"
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
                        placeholder="Create a secure password" 
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50"
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
                        placeholder="Confirm your password" 
                        {...field}
                        disabled={isLoading}
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="font-medium text-gray-800">Your 30-day free trial includes:</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Full access to all features
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Unlimited repair workflows
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Priority customer support
                  </li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Creating Your Account...' : (
                  <span className="flex items-center justify-center">
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
