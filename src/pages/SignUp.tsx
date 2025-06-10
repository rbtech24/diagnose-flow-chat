import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, CheckCircle, Zap, Users, TrendingUp, Shield, Star, Award, Clock } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [accountType, setAccountType] = useState<'company' | 'individual' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (accountType === 'company' && !formData.companyName.trim()) newErrors.companyName = 'Company name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await signUp(formData.email, formData.password, {
        name: formData.name,
        ...(accountType === 'company' && { companyName: formData.companyName })
      });
      
      if (success) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
        navigate('/login');
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-screen gap-8 lg:gap-12">
          {/* Left Side - Enhanced Sales Content */}
          <div className="hidden lg:flex lg:items-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Transform Your Business Today
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Join thousands of professionals streamlining their repair operations with powerful management tools
                  </p>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center space-x-6 mb-8">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-700 font-medium">4.9/5</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">Industry Leader</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Streamlined Workflows</h3>
                      <p className="text-gray-600">Organize and track repairs more efficiently</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Team Collaboration</h3>
                      <p className="text-gray-600">Seamless workflow management for your entire team</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Business Growth</h3>
                      <p className="text-gray-600">Scale your operations with data-driven insights</p>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced CTA */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-xl p-8 text-white text-center shadow-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-300" />
                    <span className="font-bold text-lg">Trusted by 10,000+ professionals</span>
                  </div>
                  <p className="text-blue-100 text-lg mb-4">30-day free trial • No credit card required</p>
                  <div className="flex items-center justify-center text-blue-200">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Setup takes less than 5 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md mx-auto">
              {/* Header without logo */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Create Your Account
                </h1>
                <p className="text-gray-600 text-lg mt-2">
                  Start your transformation journey today
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-6">
                  <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Choose your account type to begin
                  </CardDescription>
                  
                  {/* Account Type Selector */}
                  {!accountType && (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm font-medium text-gray-700">Choose your account type:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setAccountType('company')}
                          className="h-auto p-4 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="text-center">
                            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <div className="font-semibold">Company</div>
                            <div className="text-xs text-gray-500">Team management</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setAccountType('individual')}
                          className="h-auto p-4 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="text-center">
                            <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <div className="font-semibold">Individual</div>
                            <div className="text-xs text-gray-500">Personal use</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardHeader>

                {accountType && (
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {accountType === 'company' ? 'Company Account' : 'Individual Account'}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAccountType(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Change
                      </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? "border-red-500" : ""}
                          required
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                      </div>

                      {accountType === 'company' && (
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            type="text"
                            placeholder="Your Company Name"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className={errors.companyName ? "border-red-500" : ""}
                            required
                          />
                          {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? "border-red-500" : ""}
                          required
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={errors.password ? "border-red-500" : ""}
                          required
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                          required
                        />
                        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                      </div>

                      <Alert className="border-blue-200 bg-blue-50">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          30-day free trial • No credit card required • Cancel anytime
                        </AlertDescription>
                      </Alert>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Start Your Free Trial"}
                        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                    </form>
                  </CardContent>
                )}

                <CardFooter className="pt-6">
                  <div className="text-center text-sm text-gray-500 w-full">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign in here
                    </Link>
                  </div>
                </CardFooter>
              </Card>

              {/* Mobile Benefits Content */}
              <div className="lg:hidden mt-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Join the Revolution</h3>
                  <p className="text-sm text-gray-600">Transform your repair business with modern tools</p>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Streamlined workflows</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Team collaboration tools</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Business growth insights</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-300" />
                    <span className="font-semibold text-sm">Trusted by 10,000+ pros</span>
                  </div>
                  <p className="text-blue-100 text-xs">Start your free trial today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
