
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Building2 } from 'lucide-react';

export function DevAuthBypass() {
  const navigate = useNavigate();

  const handleRoleNavigation = (role: string) => {
    // In development, we just navigate to the role-specific dashboard
    // In a real app, this would set up proper authentication
    navigate(`/${role}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <Shield className="h-8 w-8 mx-auto mb-2 text-orange-600" />
        <CardTitle className="text-orange-600">Development Mode</CardTitle>
        <CardDescription>
          Quick access to different user dashboards for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => handleRoleNavigation('admin')}
          className="w-full justify-start"
          variant="outline"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Dashboard
        </Button>
        
        <Button
          onClick={() => handleRoleNavigation('company')}
          className="w-full justify-start"
          variant="outline"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Company Dashboard
        </Button>
        
        <Button
          onClick={() => handleRoleNavigation('tech')}
          className="w-full justify-start"
          variant="outline"
        >
          <User className="h-4 w-4 mr-2" />
          Technician Dashboard
        </Button>

        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-orange-700">
            ⚠️ This bypass is for development only and should be removed in production
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
