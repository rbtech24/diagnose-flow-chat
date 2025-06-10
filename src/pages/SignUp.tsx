
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
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Sales Content */}
        <div className="hidden lg:block bg-white p-8 overflow-y-auto">
          <SalesContent />
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden mb-4">
                  <img 
                    src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                    alt="Repair Auto Pilot" 
                    className="h-16 mx-auto"
                  />
                </div>
                {!signUpType ? (
                  <div>
                    <h1 className="text-2xl font-bold">Get Started Today</h1>
                    <p className="text-gray-600 mt-2">
                      Join thousands of repair professionals
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold">Create Your Account</h1>
                    <p className="text-gray-600 mt-2">
                      {signUpType === 'company' ? 'Set up your company account' : 'Set up your individual account'}
                    </p>
                  </div>
                )}
              </div>

              {/* Form Content */}
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

              {/* Footer */}
              <div className="mt-8">
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
    </div>
  );
}
