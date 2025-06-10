
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Search, FileText, Wrench, Shield } from 'lucide-react';

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
        <p className="text-xl text-gray-600 leading-relaxed">
          Professional diagnostic workflows and troubleshooting guides to solve appliance problems faster and more accurately.
        </p>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
          30-Day Free Trial • No Credit Card Required
        </Badge>
      </div>

      {/* Key Features */}
      <div className="grid gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Smart Diagnostic Workflows</h3>
                <p className="text-gray-600 mt-1">
                  Step-by-step diagnostic trees that guide you through systematic troubleshooting for any appliance type.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Interactive Repair Guides</h3>
                <p className="text-gray-600 mt-1">
                  Detailed visual guides with photos, videos, and technical specifications for accurate diagnosis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Technical Specifications</h3>
                <p className="text-gray-600 mt-1">
                  Access voltage readings, resistance values, and measurement points for comprehensive diagnostics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Safety Protocols</h3>
                <p className="text-gray-600 mt-1">
                  Built-in safety warnings and proper procedures to ensure technician safety during diagnostics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Why Choose Repair Auto Pilot?</h3>
        <div className="grid gap-3">
          {[
            'Reduce diagnostic time by up to 60%',
            'Improve first-time fix rates',
            'Access comprehensive appliance databases',
            'Follow proven diagnostic methodologies',
            'Mobile-friendly for field diagnostics',
            'Continuously updated diagnostic content'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
