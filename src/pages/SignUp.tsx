
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SignUpTypeSelector } from '@/components/auth/SignUpTypeSelector';
import { CompanySignUpForm } from '@/components/auth/CompanySignUpForm';
import { IndividualSignUpForm } from '@/components/auth/IndividualSignUpForm';
import { HeroSection } from '@/components/auth/HeroSection';
import { TestimonialsSection } from '@/components/auth/TestimonialsSection';
import { StatsSection } from '@/components/auth/StatsSection';
import { CTASection } from '@/components/auth/CTASection';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signUpType, setSignUpType] = useState<'company' | 'individual' | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSignUpSuccess = () => {
    navigate('/login');
  };

  const handleBackToSelection = () => {
    setSignUpType(null);
    setShowForm(false);
  };

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleSelectType = (type: 'company' | 'individual') => {
    setSignUpType(type);
  };

  // Show form view
  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              {/* Back button */}
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="mb-6 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to landing
              </Button>

              {/* Header */}
              <div className="text-center mb-8">
                <img 
                  src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                  alt="Repair Auto Pilot" 
                  className="h-16 mx-auto mb-6"
                />
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
                  <SignUpTypeSelector onSelectType={handleSelectType} />
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
          </div>
        </div>
      </div>
    );
  }

  // Show landing page view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
              alt="Repair Auto Pilot" 
              className="h-10"
            />
            <span className="text-xl font-bold text-gray-900">Repair Auto Pilot</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection onGetStarted={handleGetStarted} />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                  alt="Repair Auto Pilot" 
                  className="h-8"
                />
                <span className="text-lg font-bold">Repair Auto Pilot</span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete solution for appliance repair professionals. 
                Streamline operations, increase revenue, and deliver exceptional service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Repair Auto Pilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
