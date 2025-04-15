
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Wrench, Building, LayoutDashboard } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const [searchParams] = useSearchParams();

  // If user is already authenticated, redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'company') navigate('/company');
      else if (userRole === 'tech') navigate('/tech');
    }
  }, [isAuthenticated, userRole, navigate]);

  // Helper function to navigate with role parameter
  const navigateWithRole = (path: string, role: string) => {
    console.log(`Navigating to ${path} with role ${role}`);
    navigate(path, { state: { role }, replace: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <img
          src="/lovable-uploads/626e46ce-b31c-4656-8873-f950a140763f.png"
          alt="Repair Autopilot"
          className="h-20 mx-auto mb-8"
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Revolutionize Your Repair Business
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Streamline diagnostic workflows, increase first-time fix rates, and boost technician productivity with our AI-powered platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={() => navigate('/signup')}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start 30-Day Free Trial
          </Button>
          
          <Button 
            onClick={() => navigate('/login')}
            variant="outline" 
            size="lg"
          >
            Sign In
          </Button>
        </div>
        
        {/* Role selection */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">I am a...</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigateWithRole('/signup?role=company', 'company')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Service Business Owner</h3>
              <p className="text-gray-600">Manage your technicians, track performance, and increase customer satisfaction.</p>
            </div>
            
            <div 
              onClick={() => navigateWithRole('/signup?role=tech', 'tech')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Service Technician</h3>
              <p className="text-gray-600">Access guided repair workflows, improve your efficiency, and reduce callbacks.</p>
            </div>
            
            <div 
              onClick={() => navigateWithRole('/login?role=admin', 'admin')}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <LayoutDashboard className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Administrator</h3>
              <p className="text-gray-600">Manage the entire platform, users, workflows, and system settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Repair Auto Pilot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <h3 className="text-xl font-medium mb-2">Increased Productivity</h3>
              <p className="text-gray-600">Our diagnostic workflows reduce repair time and increase technician efficiency.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">82%</div>
              <h3 className="text-xl font-medium mb-2">First-Time Fix Rate</h3>
              <p className="text-gray-600">Technicians arrive prepared with the right knowledge to solve problems on the first visit.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <h3 className="text-xl font-medium mb-2">Knowledge Access</h3>
              <p className="text-gray-600">Access to repair workflows anytime, anywhere, even offline.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
