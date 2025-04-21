
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Clock, Settings, Activity, Users, Shield } from "lucide-react";
import HomeHeader from "@/components/layout/HomeHeader";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Index() {
  useEffect(() => {
    console.log("Index component mounted");
    
    // Debug image paths
    const imagePaths = [
      "/lovable-uploads/1961838b-05c5-44e0-a2c1-92dae3c80e1a.png",
      "/lovable-uploads/0ab0b549-2aff-4f8c-84d7-416bfc37ba6e.png",
      "/lovable-uploads/5e0204c2-ef16-48b1-8781-6e770f07a3ba.png",
      "/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png"
    ];
    
    console.log("Image paths to load:", imagePaths);
    
    // Test if images are accessible
    imagePaths.forEach((path, index) => {
      const img = new Image();
      img.onload = () => console.log(`Image ${index + 1} loaded successfully:`, path);
      img.onerror = () => console.error(`Image ${index + 1} failed to load:`, path);
      img.src = path;
    });
    
    // Force cache refresh for this component
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(meta);
    
    return () => {
      // Clean up added meta tag when component unmounts
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeHeader />

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Appliance Diagnostics on <span className="text-blue-600">Auto Pilot</span>
            </h1>
            <p className="text-lg text-gray-600">
              Streamline your repair operations with our diagnostic workflows. Boost first-time fix rates and keep your technicians at peak efficiency.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  Start Free Trial <span className="ml-1">→</span>
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" className="border-gray-300">
                  See Features
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                <span>30-day trial</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                <span>Easy setup</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
            <div className="rounded-md bg-gray-800 p-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-white text-sm">Appliance Repair</div>
            </div>
            <img 
              src="/lovable-uploads/c71206b9-55ab-4588-bbe9-2dcf1db816be.png" 
              alt="Appliance repair diagnostic" 
              className="w-full h-auto rounded-b-md"
            />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 mb-8">Trusted by leading appliance service companies</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {/* Add error boundary around each image for better debugging */}
            <div className="h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/1961838b-05c5-44e0-a2c1-92dae3c80e1a.png" 
                alt="Service company" 
                className="h-full w-auto object-contain" 
                onLoad={() => console.log("Logo 1 loaded")}
                onError={(e) => {
                  console.error("Logo 1 failed to load", e);
                  e.currentTarget.src = "https://via.placeholder.com/150x50?text=Company+Logo";
                }}
              />
            </div>
            <div className="h-14 flex items-center justify-center">
              <img 
                src="/lovable-uploads/0ab0b549-2aff-4f8c-84d7-416bfc37ba6e.png" 
                alt="Service company" 
                className="h-full w-auto object-contain" 
                onLoad={() => console.log("Logo 2 loaded")}
                onError={(e) => {
                  console.error("Logo 2 failed to load", e);
                  e.currentTarget.src = "https://via.placeholder.com/150x50?text=Company+Logo";
                }}
              />
            </div>
            <div className="h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/5e0204c2-ef16-48b1-8781-6e770f07a3ba.png" 
                alt="Service company" 
                className="h-full w-auto object-contain" 
                onLoad={() => console.log("Logo 3 loaded")}
                onError={(e) => {
                  console.error("Logo 3 failed to load", e);
                  e.currentTarget.src = "https://via.placeholder.com/150x50?text=Company+Logo";
                }}
              />
            </div>
            <div className="h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                alt="Service company" 
                className="h-full w-auto object-contain" 
                onLoad={() => console.log("Logo 4 loaded")}
                onError={(e) => {
                  console.error("Logo 4 failed to load", e);
                  e.currentTarget.src = "https://via.placeholder.com/150x50?text=Company+Logo";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Why Choose Repair Auto Pilot?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform streamlines diagnostic workflows, improves technician productivity, and boosts customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Settings className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Diagnostic Workflows</h3>
              <p className="text-gray-600">
                Create custom diagnostic workflows that guide technicians through troubleshooting step-by-step.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Activity className="text-green-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Increased First-Time Fix Rate</h3>
              <p className="text-gray-600">
                Improve your first-time fix rate by up to 35% with guided diagnostics and parts identification.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-purple-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reduce Diagnostic Time</h3>
              <p className="text-gray-600">
                Cut diagnostic time by up to 50% with our AI-assisted troubleshooting system.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Activity className="text-yellow-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Analytics</h3>
              <p className="text-gray-600">
                Track technician performance, identify training opportunities, and optimize service delivery.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-red-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Level Access</h3>
              <p className="text-gray-600">
                Different roles for technicians, company admins, and system administrators.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-blue-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Data Storage</h3>
              <p className="text-gray-600">
                All your diagnostic data and customer information is securely stored and backed up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-yellow-400 flex mb-3">
                <span>★★★★★</span>
              </div>
              <p className="text-gray-600 italic mb-6">
                "Since implementing Repair Auto Pilot, our first-time fix rate has increased by 32%. Our technicians love the guided workflows."
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-700 font-semibold">P</span>
                </div>
                <div>
                  <p className="font-semibold">Paul</p>
                  <p className="text-sm text-gray-500">Service Manager, Service Wranglers</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-yellow-400 flex mb-3">
                <span>★★★★★</span>
              </div>
              <p className="text-gray-600 italic mb-6">
                "The diagnostic workflows have been a game-changer for our new technicians. Training time reduced by 40% with the step-by-step guides."
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-700 font-semibold">N</span>
                </div>
                <div>
                  <p className="font-semibold">Nick</p>
                  <p className="text-sm text-gray-500">Owner, West Metro Appliance</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-yellow-400 flex mb-3">
                <span>★★★★★</span>
              </div>
              <p className="text-gray-600 italic mb-6">
                "Customer satisfaction is up 28% since we started using Repair Auto Pilot. The professional diagnostic reports really impress our clients."
              </p>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-gray-700 font-semibold">R</span>
                </div>
                <div>
                  <p className="font-semibold">Robert</p>
                  <p className="text-sm text-gray-500">CEO, Einstein Appliance Repair</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Repair Service?</h2>
          <p className="text-lg md:text-xl mb-8">
            Join the hundreds of appliance repair companies already using Repair Auto Pilot to streamline their operations.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
