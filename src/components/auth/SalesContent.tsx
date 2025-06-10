
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Shield, Users, BarChart3, Clock } from 'lucide-react';

export function SalesContent() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <img 
          src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
          alt="Repair Auto Pilot" 
          className="h-24 mx-auto"
        />
        <h1 className="text-4xl font-bold text-gray-900">
          Streamline Your Repair Business
        </h1>
        <p className="text-xl text-gray-600">
          The complete solution for managing technicians, jobs, and customers in one powerful platform.
        </p>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          30-Day Free Trial • No Credit Card Required
        </Badge>
      </div>

      {/* Key Features */}
      <div className="grid gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Users className="h-8 w-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Team Management</h3>
                <p className="text-gray-600">
                  Manage multiple technicians, assign jobs, and track performance across your entire team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Smart Scheduling</h3>
                <p className="text-gray-600">
                  AI-powered scheduling that optimizes routes and maximizes efficiency for your technicians.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <BarChart3 className="h-8 w-8 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Track performance, revenue, and customer satisfaction with comprehensive reporting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Enterprise Security</h3>
                <p className="text-gray-600">
                  Bank-level security with encrypted data, secure authentication, and compliance standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Why Choose Repair Auto Pilot?</h3>
        <div className="space-y-3">
          {[
            'Increase efficiency by up to 40%',
            'Reduce paperwork and manual processes',
            'Improve customer satisfaction scores',
            'Scale your business with confidence',
            'Mobile-first design for field technicians',
            '24/7 customer support and training'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Join 10,000+ Repair Professionals</h3>
          <p className="text-gray-600">
            "Repair Auto Pilot transformed our business. We've increased our job completion rate by 35% and our customers love the professional experience."
          </p>
          <p className="text-sm text-gray-500 mt-2">
            - Sarah Johnson, Manager at Quick Fix Solutions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
