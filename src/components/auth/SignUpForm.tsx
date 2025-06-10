
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from './form-fields/FormField';
import { PasswordField } from './form-fields/PasswordField';
import { useSignUpForm } from './hooks/useSignUpForm';

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const {
    formData,
    errors,
    isLoading,
    passwordStrength,
    handleInputChange,
    handleSubmit
  } = useSignUpForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label="Full Name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        error={errors.name}
        placeholder="John Doe"
        required
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        error={errors.email}
        placeholder="your@email.com"
        required
      />

      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        showStrength={true}
        passwordStrength={passwordStrength}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange('confirmPassword', value)}
        error={errors.confirmPassword}
      />

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isLoading || !passwordStrength.isValid}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
