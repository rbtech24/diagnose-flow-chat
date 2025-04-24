
import React from 'react';
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  showSalesContent?: boolean;
}

export function AuthLayout({ children, title, description, showSalesContent = false }: AuthLayoutProps) {
  React.useEffect(() => {
    console.log("AuthLayout mounted", { showSalesContent });
  }, [showSalesContent]);

  return (
    <div className="flex min-h-screen">
      {showSalesContent && (
        <div className="hidden lg:flex lg:w-1/2 bg-blue-50 p-12 flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">
              Start Managing Your Repair Business Today
            </h1>
            <div className="space-y-6 text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p>Smart diagnostic workflows that guide technicians step-by-step</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p>Real-time collaboration between office staff and field technicians</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <p>Detailed reporting and analytics to optimize your operations</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`flex-1 flex items-center justify-center p-6 ${showSalesContent ? 'lg:w-1/2' : ''}`}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img 
                src="/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png" 
                alt="logo" 
                className="h-14 w-auto mx-auto object-contain"
                style={{ maxWidth: 160 }}
              />
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
