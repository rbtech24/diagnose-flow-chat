
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, User } from 'lucide-react';

interface SignUpTypeSelectorProps {
  onSelectType: (type: 'company' | 'individual') => void;
}

export function SignUpTypeSelector({ onSelectType }: SignUpTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Account Type</h2>
        <p className="text-muted-foreground mt-2">
          Select the option that best describes your business
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-4">
            <Building2 className="h-12 w-12 mx-auto mb-3 text-blue-600" />
            <CardTitle>Company with Technicians</CardTitle>
            <CardDescription>
              Manage multiple technicians, schedules, and customer relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Manage multiple technicians</li>
              <li>• Team scheduling and dispatch</li>
              <li>• Company-wide reporting</li>
              <li>• Customer management system</li>
              <li>• Inventory and parts tracking</li>
            </ul>
            <Button 
              onClick={() => onSelectType('company')} 
              className="w-full"
              size="lg"
            >
              Start Company Account
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-4">
            <User className="h-12 w-12 mx-auto mb-3 text-green-600" />
            <CardTitle>Independent Technician</CardTitle>
            <CardDescription>
              Perfect for solo technicians and small independent businesses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Personal job management</li>
              <li>• Customer tracking</li>
              <li>• Simple scheduling</li>
              <li>• Basic reporting</li>
              <li>• Mobile-friendly tools</li>
            </ul>
            <Button 
              onClick={() => onSelectType('individual')} 
              className="w-full"
              variant="outline"
              size="lg"
            >
              Start Individual Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
