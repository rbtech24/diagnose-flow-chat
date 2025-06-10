
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SignUpTypeSelector } from '@/components/auth/SignUpTypeSelector';
import { CompanySignUpForm } from '@/components/auth/CompanySignUpForm';
import { IndividualSignUpForm } from '@/components/auth/IndividualSignUpForm';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { HeroSection } from '@/components/auth/HeroSection';
import { StatsSection } from '@/components/auth/StatsSection';
import { TestimonialsSection } from '@/components/auth/TestimonialsSection';
import { CTASection } from '@/components/auth/CTASection';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [signUpType, setSignUpType] = useState<'company' | 'individual' | null>(null);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    setShowSignupForm(true);
  };

  const handleSignUpSuccess = () => {
    navigate('/login');
  };

  const handleBackToSelection = () => {
    setSignUpType(null);
  };

  const handleBackToLanding = () => {
    setShowSignupForm(false);
    setSignUpType(null);
  };

  if (!showSignupForm) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSection onGetStarted={handleGetStarted} />
        <StatsSection />
        <TestimonialsSection />
        <CTASection onGetStarted={handleGetStarted} />
        
        {/* Footer */}
        <div className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <AuthFooter 
              linkText="Already have an account?"
              linkHref="/login"
              actionText="Sign in here"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-screen gap-8 lg:gap-12">
          {/* Left Side - Quick Sales Points */}
          <div className="hidden lg:flex lg:items-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <div className="space-y-8">
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                    alt="Repair Auto Pilot" 
                    className="h-16 mx-auto mb-6"
                  />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Why Choose Repair Auto Pilot?
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Diagnostics</h3>
                      <p className="text-gray-600">Get instant, accurate diagnoses with our advanced AI technology.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Increase Efficiency</h3>
                      <p className="text-gray-600">Complete 40% more jobs with streamlined workflows.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Happy Customers</h3>
                      <p className="text-gray-600">Boost satisfaction with faster, more reliable repairs.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <p className="text-blue-800 font-semibold mb-2">🎉 Special Launch Offer</p>
                  <p className="text-blue-700">30-day free trial • No credit card required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10">
                {/* Back Button */}
                <Button 
                  variant="ghost" 
                  onClick={signUpType ? handleBackToSelection : handleBackToLanding}
                  className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900 mb-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {signUpType ? 'Back to account type' : 'Back to overview'}
                </Button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="lg:hidden mb-6">
                    <img 
                      src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                      alt="Repair Auto Pilot" 
                      className="h-16 mx-auto"
                    />
                  </div>
                  {!signUpType ? (
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
                      <p className="text-gray-600 text-lg">
                        Select the option that fits your business
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
                      <p className="text-gray-600 text-lg">
                        {signUpType === 'company' ? 'Set up your company account' : 'Set up your individual account'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {!signUpType && (
                    <SignUpTypeSelector onSelectType={setSignUpType} />
                  )}

                  {signUpType === 'company' && (
                    <CompanySignUpForm 
                      onSuccess={handleSignUpSuccess}
                      onBack={handleBackToSelection}
                    />
                  )}

                  {signUpType === 'individual' && (
                    <IndividualSignUpForm 
                      onSuccess={handleSignUpSuccess}
                      onBack={handleBackToSelection}
                    />
                  )}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <AuthFooter 
                    linkText="Already have an account?"
                    linkHref="/login"
                    actionText="Sign in here"
                  />
                </div>
              </div>

              {/* Mobile Sales Content */}
              <div className="lg:hidden mt-8 bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Why Choose Us?</h3>
                  <p className="text-sm text-gray-600">Join 10,000+ repair professionals</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    AI-powered diagnostics
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    40% faster repairs
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                    Higher customer satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
