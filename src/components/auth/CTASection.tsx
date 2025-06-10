
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  const features = [
    "AI-powered diagnostic assistance",
    "Real-time job management",
    "Customer communication tools",
    "Inventory tracking",
    "Performance analytics",
    "24/7 support"
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of repair professionals already using our platform
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-blue-100">
              <CheckCircle className="h-5 w-5 mr-3 text-green-300" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm">
            30-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
