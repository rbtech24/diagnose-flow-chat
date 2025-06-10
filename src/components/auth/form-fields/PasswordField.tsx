
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showStrength?: boolean;
  passwordStrength?: { isValid: boolean; errors: string[] };
  placeholder?: string;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  showStrength = false,
  passwordStrength,
  placeholder = "••••••••••••"
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="password"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
        required
      />
      
      {showStrength && value && passwordStrength && (
        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
      )}
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
