
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Tech() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Technician Dashboard</CardTitle>
            <CardDescription>
              View your assignments and manage work orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Welcome to your technician dashboard. Here you can view assigned jobs, 
              update work orders, and access diagnostic tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
