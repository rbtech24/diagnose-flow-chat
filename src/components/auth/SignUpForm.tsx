
import React, { useState } from 'react';
import { SignUpTypeSelector } from './SignUpTypeSelector';
import { CompanySignUpForm } from './CompanySignUpForm';
import { IndividualSignUpForm } from './IndividualSignUpForm';

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [signUpType, setSignUpType] = useState<'company' | 'individual' | null>(null);

  const handleBack = () => {
    setSignUpType(null);
  };

  if (signUpType === 'company') {
    return <CompanySignUpForm onSuccess={onSuccess} onBack={handleBack} />;
  }

  if (signUpType === 'individual') {
    return <IndividualSignUpForm onSuccess={onSuccess} onBack={handleBack} />;
  }

  return <SignUpTypeSelector onSelectType={setSignUpType} />;
}
