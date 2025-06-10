
import React from 'react';

interface PasswordStrengthIndicatorProps {
  passwordStrength: { isValid: boolean; errors: string[] };
}

export function PasswordStrengthIndicator({ passwordStrength }: PasswordStrengthIndicatorProps) {
  const getPasswordStrengthColor = () => {
    if (passwordStrength.errors.length > 3) return 'bg-red-500';
    if (passwordStrength.errors.length > 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthWidth = () => {
    const strength = Math.max(0, 100 - (passwordStrength.errors.length * 20));
    return `${strength}%`;
  };

  return (
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
  );
}
