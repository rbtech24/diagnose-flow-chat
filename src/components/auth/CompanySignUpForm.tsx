
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SignUpForm } from './SignUpForm';
import { FormField } from './form-fields/FormField';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface CompanySignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function CompanySignUpForm({ onSuccess, onBack }: CompanySignUpFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [isCompanyNameValid, setIsCompanyNameValid] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    setIsCompanyNameValid(value.trim().length >= 2);
  };

  const handleSignUpSuccess = async () => {
    if (!isCompanyNameValid) {
      toast({
        title: 'Company name required',
        description: 'Please enter a valid company name',
        variant: 'destructive',
      });
      return;
    }

    // For now, just proceed to success
    // In a real implementation, you would create the company record
    onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to account type
      </Button>

      {/* Company Name Field */}
      <FormField
        id="companyName"
        label="Company Name"
        value={companyName}
        onChange={handleCompanyNameChange}
        placeholder="Your Company Name"
        required
      />

      {/* Sign Up Form */}
      <SignUpForm onSuccess={handleSignUpSuccess} />
    </div>
  );
}
