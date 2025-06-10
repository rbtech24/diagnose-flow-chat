
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Shield, Search, FileText, Wrench } from 'lucide-react';

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
          Advanced Appliance Diagnostics
        </h1>
        <p className="text-xl text-gray-600">
          Professional diagnostic workflows and troubleshooting guides to solve appliance problems faster and more accurately.
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
              <Search className="h-8 w-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Smart Diagnostic Workflows</h3>
                <p className="text-gray-600">
                  Step-by-step diagnostic trees that guide you through systematic troubleshooting for any appliance type.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-8 w-8 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Interactive Repair Guides</h3>
                <p className="text-gray-600">
                  Detailed visual guides with photos, videos, and technical specifications for accurate diagnosis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Wrench className="h-8 w-8 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Technical Specifications</h3>
                <p className="text-gray-600">
                  Access voltage readings, resistance values, and measurement points for comprehensive diagnostics.
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
                <h3 className="font-semibold text-lg">Safety Protocols</h3>
                <p className="text-gray-600">
                  Built-in safety warnings and proper procedures to ensure technician safety during diagnostics.
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
            'Reduce diagnostic time by up to 60%',
            'Improve first-time fix rates',
            'Access comprehensive appliance databases',
            'Follow proven diagnostic methodologies',
            'Mobile-friendly for field diagnostics',
            'Continuously updated diagnostic content'
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
            "This diagnostic tool has revolutionized how we troubleshoot appliances. The step-by-step workflows helped us identify issues we would have missed."
          </p>
          <p className="text-sm text-gray-500 mt-2">
            - Mike Rodriguez, Senior Appliance Technician
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
