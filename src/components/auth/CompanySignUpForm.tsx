import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { validateInput, emailSchema, nameSchema } from '@/components/security/InputValidator';
import { PasswordSecurity } from '@/utils/rateLimiter';

interface CompanySignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function CompanySignUpForm({ onSuccess, onBack }: CompanySignUpFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] });
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName || formData.companyName.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    const nameResult = validateInput(nameSchema, formData.adminName);
    if (!nameResult.isValid) {
      newErrors.adminName = nameResult.error || 'Invalid name';
    }

    const emailResult = validateInput(emailSchema, formData.adminEmail);
    if (!emailResult.isValid) {
      newErrors.adminEmail = emailResult.error || 'Invalid email';
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
      const success = await signUp(formData.adminEmail, formData.password, {
        name: formData.adminName,
        role: 'company',
        company: { name: formData.companyName }
      });
      
      if (success) {
        toast({
          title: 'Company account created successfully',
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

  const getPasswordStrengthColor = () => {
    if (!formData.password) return 'bg-gray-200';
    if (passwordStrength.errors.length > 3) return 'bg-red-500';
    if (passwordStrength.errors.length > 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthWidth = () => {
    if (!formData.password) return '0%';
    const strength = Math.max(0, 100 - (passwordStrength.errors.length * 20));
    return `${strength}%`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Acme Repair Services"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          className={errors.companyName ? 'border-red-500' : ''}
          required
        />
        {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminName">Admin Full Name</Label>
        <Input
          id="adminName"
          type="text"
          placeholder="John Doe"
          value={formData.adminName}
          onChange={(e) => handleInputChange('adminName', e.target.value)}
          className={errors.adminName ? 'border-red-500' : ''}
          required
        />
        {errors.adminName && <p className="text-sm text-red-500">{errors.adminName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminEmail">Admin Email</Label>
        <Input
          id="adminEmail"
          type="email"
          placeholder="admin@company.com"
          value={formData.adminEmail}
          onChange={(e) => handleInputChange('adminEmail', e.target.value)}
          className={errors.adminEmail ? 'border-red-500' : ''}
          required
        />
        {errors.adminEmail && <p className="text-sm text-red-500">{errors.adminEmail}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className={errors.password ? 'border-red-500' : ''}
          required
        />
        
        {formData.password && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                style={{ width: getPasswordStrengthWidth() }}
              />
            </div>
            {passwordStrength.errors.length > 0 && (
              <div className="text-xs text-gray-600">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside ml-2">
                  {passwordStrength.errors.map((error, index) => (
                    <li key={index} className="text-red-500">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          required
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="w-full"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading || !passwordStrength.isValid}
        >
          {isLoading ? 'Creating account...' : 'Create Company Account'}
        </Button>
      </div>
    </form>
  );
}
