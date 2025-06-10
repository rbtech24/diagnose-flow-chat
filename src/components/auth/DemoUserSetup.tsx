
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { createDemoUsers, getDemoUserCredentials, demoUsers } from '@/utils/createDemoUsers';

export function DemoUserSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleCreateUsers = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      const response = await createDemoUsers();
      setResult(response);
      if (response.success) {
        setShowCredentials(true);
      }
    } catch (error) {
      setResult({ success: false, message: 'An unexpected error occurred' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Demo User Setup
        </CardTitle>
        <CardDescription>
          Create demo accounts for testing the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Demo Accounts to Create:</h4>
          <div className="space-y-1">
            {demoUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between text-sm">
                <span>{user.email}</span>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleCreateUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Users...' : 'Create Demo Users'}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        {showCredentials && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              <Key className="h-4 w-4 mr-2" />
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </Button>
            
            {showCredentials && (
              <div className="p-3 bg-gray-50 rounded-md text-xs font-mono whitespace-pre-line">
                {getDemoUserCredentials()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
