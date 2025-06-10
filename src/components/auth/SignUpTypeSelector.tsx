
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';

interface SignUpTypeSelectorProps {
  onSelectType: (type: 'company' | 'individual') => void;
}

export function SignUpTypeSelector({ onSelectType }: SignUpTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Account Type</h2>
        <p className="text-muted-foreground mt-2">
          Select the option that best describes your business
        </p>
      </div>
      
      <div className="grid gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Users className="mx-auto h-12 w-12 text-blue-600" />
            <CardTitle>Company with Multiple Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Perfect for businesses with multiple technicians, job scheduling, and team management needs.
            </p>
            <ul className="text-sm space-y-1 mb-4">
              <li>• Manage multiple technicians</li>
              <li>• Team scheduling and dispatch</li>
              <li>• Company-wide reporting</li>
              <li>• Customer management</li>
            </ul>
            <Button 
              onClick={() => onSelectType('company')} 
              className="w-full"
            >
              Sign Up as Company
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <User className="mx-auto h-12 w-12 text-green-600" />
            <CardTitle>Independent Technician</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ideal for solo technicians who want to manage their own jobs and customers.
            </p>
            <ul className="text-sm space-y-1 mb-4">
              <li>• Personal job management</li>
              <li>• Customer tracking</li>
              <li>• Simple scheduling</li>
              <li>• Individual reporting</li>
            </ul>
            <Button 
              onClick={() => onSelectType('individual')} 
              variant="outline"
              className="w-full"
            >
              Sign Up as Individual
            </Button>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
