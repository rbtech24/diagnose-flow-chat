
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { validateInput, emailSchema, nameSchema } from '@/components/security/InputValidator';
import { PasswordSecurity } from '@/utils/rateLimiter';
import { ArrowLeft } from 'lucide-react';

interface IndividualSignUpFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function IndividualSignUpForm({ onSuccess, onBack }: IndividualSignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
        name: formData.name,
        phone: formData.phone,
        role: 'tech'
      });
      
      if (success) {
        toast({
          title: 'Account created successfully',
          description: 'Welcome! Please check your email to verify your account.',
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Individual sign up error:', error);
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Create Individual Account</h2>
          <p className="text-muted-foreground">Set up your personal technician account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
            required
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
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

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700" 
          disabled={isLoading || !passwordStrength.isValid}
        >
          {isLoading ? 'Creating account...' : 'Create Individual Account'}
        </Button>
      </form>
    </div>
  );
}
