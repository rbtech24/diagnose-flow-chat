
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomeHeader() {
  return (
    <header className="w-full bg-white py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/2afa0162-e41f-4454-a6c6-1ffa81bb72f5.png"
            alt="Repair Auto Pilot" 
            className="h-12 object-contain"
            style={{ maxWidth: 200 }}
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-gray-700 hover:text-blue-600 transition">
            Features
          </Link>
          <Link to="/testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Testimonials
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
          <Link to="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
