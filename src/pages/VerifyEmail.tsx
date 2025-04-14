
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
              alt="Repair Autopilot" 
              className="h-16 w-auto" 
            />
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-4">
              <Mail className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold mb-4">
            Check your email
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            We sent a verification link to <span className="font-medium">{email}</span>. 
            Please check your email and click the link to verify your account.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn't receive an email? Check your spam folder or try again in a few minutes.
            </p>
            
            <div className="flex justify-center">
              <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
