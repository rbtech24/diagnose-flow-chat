
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Administrative functions and system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Welcome to the admin dashboard. This is where you can manage users, 
              system settings, and monitor platform activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
