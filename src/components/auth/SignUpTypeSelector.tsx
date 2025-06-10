
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';

interface SignUpTypeSelectorProps {
  onSelectType: (type: 'company' | 'individual') => void;
}

export function SignUpTypeSelector({ onSelectType }: SignUpTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Account Type</h2>
        <p className="text-muted-foreground mt-2 text-base">
          Select the option that best describes your business
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Company with Multiple Technicians</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Perfect for businesses with multiple technicians, job scheduling, and team management needs.
            </p>
            <ul className="text-sm space-y-2 mb-6 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Manage multiple technicians
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Team scheduling and dispatch
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Company-wide reporting
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Customer management
              </li>
            </ul>
            <Button 
              onClick={() => onSelectType('company')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Sign Up as Company
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Independent Technician</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Ideal for solo technicians who want to manage their own jobs and customers.
            </p>
            <ul className="text-sm space-y-2 mb-6 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Personal job management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Customer tracking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Simple scheduling
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Individual reporting
              </li>
            </ul>
            <Button 
              onClick={() => onSelectType('individual')} 
              variant="outline"
              className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50"
              size="lg"
            >
              Sign Up as Individual
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
