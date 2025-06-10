
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SignUpTypeSelector } from '@/components/auth/SignUpTypeSelector';
import { CompanySignUpForm } from '@/components/auth/CompanySignUpForm';
import { IndividualSignUpForm } from '@/components/auth/IndividualSignUpForm';
import { SalesContent } from '@/components/auth/SalesContent';
import { AuthFooter } from '@/components/auth/AuthFooter';

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signUpType, setSignUpType] = useState<'company' | 'individual' | null>(null);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-screen gap-8 lg:gap-12">
          {/* Left Side - Sales Content */}
          <div className="hidden lg:flex lg:items-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <SalesContent />
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10">
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
                      <h1 className="text-3xl font-bold text-gray-900">Get Started Today</h1>
                      <p className="text-gray-600 text-lg">
                        Join thousands of repair professionals
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
                <SalesContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
