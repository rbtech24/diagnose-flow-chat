
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function HomeHeader() {
  const { isAuthenticated, userRole } = useAuth();

  // Determine where to direct the user based on their role
  const getDashboardUrl = () => {
    if (!isAuthenticated) return '/login';
    switch(userRole) {
      case 'admin': return '/admin';
      case 'company': return '/company';
      case 'tech': return '/tech';
      default: return '/login';
    }
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png" 
                alt="Repair Auto Pilot Logo" 
                className="h-9 w-auto"
              />
            </Link>
            <nav className="hidden ml-8 md:flex space-x-6">
              <Link to="/features" className="text-gray-600 hover:text-blue-600 font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link to="/help" className="text-gray-600 hover:text-blue-600 font-medium">
                Help
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <Link to={getDashboardUrl()}>
                <Button>Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
