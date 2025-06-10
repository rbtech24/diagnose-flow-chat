
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-red-500' : ''}
        required={required}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
