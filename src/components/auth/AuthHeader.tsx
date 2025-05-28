
import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

export function AuthHeader({ title, subtitle, showLogo = true }: AuthHeaderProps) {
  return (
    <div className="space-y-1 text-center">
      {showLogo && (
        <div className="flex justify-center mb-3">
          <img 
            src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
            alt="Repair Auto Pilot" 
            className="h-32"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
