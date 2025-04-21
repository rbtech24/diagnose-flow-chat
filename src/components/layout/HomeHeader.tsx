
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cacheBustUrl } from "@/utils/cacheControl";

export default function HomeHeader() {
  // Debug log for component mounting
  useEffect(() => {
    console.log("HomeHeader component mounted");
  }, []);

  return (
    <header className="w-full bg-white py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center" aria-label="Home">
          <img 
            src={cacheBustUrl("/lovable-uploads/28cef98f-7973-4892-9eb5-f0e02978d22e.png")}
            alt="Repair Auto Pilot logo" 
            className="h-16 w-auto object-contain"
            style={{ maxWidth: 200 }}
            onLoad={() => console.log("Header logo loaded")}
            onError={(e) => {
              console.error("Header logo failed to load");
              e.currentTarget.src = "https://via.placeholder.com/200x60?text=Repair+Auto+Pilot";
            }}
          />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
            Features
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Testimonials
          </a>
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
