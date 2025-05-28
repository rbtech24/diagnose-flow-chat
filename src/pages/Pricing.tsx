
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your team size and needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfect for small teams</CardDescription>
              <div className="text-3xl font-bold">$29<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Up to 5 technicians</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Basic workflows</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Customer management</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Email support</li>
              </ul>
              <Link to="/signup" className="block mt-6">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
            </div>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>For growing businesses</CardDescription>
              <div className="text-3xl font-bold">$79<span className="text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Up to 25 technicians</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Advanced workflows</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Analytics & reporting</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Priority support</li>
              </ul>
              <Link to="/signup" className="block mt-6">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
              <div className="text-3xl font-bold">Custom</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Unlimited technicians</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Custom integrations</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />Dedicated support</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-green-500 mr-2" />SLA guarantee</li>
              </ul>
              <Link to="/contact" className="block mt-6">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
