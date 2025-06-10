
import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  const benefits = [
    "Setup in under 5 minutes",
    "No credit card required",
    "14-day free trial",
    "Cancel anytime"
  ];

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Join thousands of repair professionals who've already made the switch
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Start Your Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-sm text-gray-500">
          No setup fees • No long-term contracts • Cancel anytime
        </p>
      </div>
    </div>
  );
}
