
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AuthCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ children, header, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        {header && <CardHeader>{header}</CardHeader>}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
}
