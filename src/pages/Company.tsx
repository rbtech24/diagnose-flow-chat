
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Company() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Company Dashboard</CardTitle>
            <CardDescription>
              Manage your company, technicians, and work orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Welcome to your company dashboard. Here you can manage technicians, 
              view work orders, and track business performance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
