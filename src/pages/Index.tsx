
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Building, 
  Star, 
  CheckCircle, 
  Zap, 
  BarChart 
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Repair Business with Repair Auto Pilot
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Boost productivity, reduce repair times, and improve customer satisfaction with our all-in-one repair management platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700">40% Increased Technician Efficiency</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700">Comprehensive Diagnostic Workflows</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-gray-700">No Credit Card Required - 30-Day Free Trial</span>
            </div>
          </div>
          
          <div className="mt-10 flex space-x-4">
            <Link to="/signup" className="w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/login" className="w-full">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <img 
            src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png" 
            alt="Repair Auto Pilot Dashboard" 
            className="rounded-xl shadow-2xl"
          />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
            Designed for Repair Professionals
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex justify-center mb-6">
                <Wrench className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Technician Tools</h3>
              <p className="text-gray-600">
                Advanced diagnostic workflows and real-time knowledge base to help technicians solve problems faster.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex justify-center mb-6">
                <Building className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Company Management</h3>
              <p className="text-gray-600">
                Track performance, manage technicians, and gain insights to grow your repair business.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex justify-center mb-6">
                <BarChart className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
              <p className="text-gray-600">
                Comprehensive analytics to measure and improve your team's efficiency and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
          What Our Customers Say
        </h2>
        
        <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-xl">
          <div className="flex justify-center mb-6">
            <Star className="h-8 w-8 text-yellow-500" />
            <Star className="h-8 w-8 text-yellow-500" />
            <Star className="h-8 w-8 text-yellow-500" />
            <Star className="h-8 w-8 text-yellow-500" />
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          
          <blockquote className="text-xl italic text-gray-800 mb-6">
            "Repair Auto Pilot has completely transformed our repair workflow. Our technicians are more efficient, and our customers are happier than ever. The diagnostic tools are game-changing!"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="/lovable-uploads/83ff694d-eb6c-4d23-9e13-2f1b96f3258e.png" 
              alt="Customer" 
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">Robert Johnson</p>
              <p className="text-gray-600">Founder, Elite Appliance Repair</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
