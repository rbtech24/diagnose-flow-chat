
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-16 lg:py-24">
          <div className="text-center">
            <img 
              src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
              alt="Repair Auto Pilot" 
              className="h-20 mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Revolutionize Your
              <span className="text-blue-200 block">Repair Business</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of repair professionals using AI-powered diagnostics to increase efficiency, 
              reduce repair times, and boost customer satisfaction.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
