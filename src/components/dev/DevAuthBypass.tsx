
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function DevAuthBypass() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>
          This component has been disabled. Please use the proper login flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Demo user bypass has been removed. Please use the login page with proper Supabase authentication.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
