
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function DemoUserSetup() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Demo Setup Disabled</CardTitle>
        <CardDescription>
          Demo user creation has been disabled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This component has been disabled. Please use the existing authentication system with real user accounts.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
