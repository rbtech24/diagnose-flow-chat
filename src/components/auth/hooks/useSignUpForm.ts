
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { validateInput, emailSchema, nameSchema } from '@/components/security/InputValidator';
import { PasswordSecurity } from '@/utils/rateLimiter';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useSignUpForm(onSuccess: () => void) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({ 
    isValid: false, 
    errors: [] 
  });
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const nameResult = validateInput(nameSchema, formData.name);
    if (!nameResult.isValid) {
      newErrors.name = nameResult.error || 'Invalid name';
    }

    const emailResult = validateInput(emailSchema, formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error || 'Invalid email';
    }

    const passwordValidation = PasswordSecurity.validateStrength(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0] || 'Invalid password';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      const strength = PasswordSecurity.validateStrength(value);
      setPasswordStrength(strength);
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await signUp(formData.email, formData.password, {
        name: formData.name
      });
      
      if (success) {
        toast({
          title: 'Account created successfully',
          description: 'Welcome! Please check your email to verify your account.',
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    passwordStrength,
    handleInputChange,
    handleSubmit
  };
}
