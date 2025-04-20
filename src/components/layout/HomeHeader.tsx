
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Home, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 sm:p-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
          <Home className="w-7 h-7" />
          Repair Auto Pilot
        </Link>
        <nav className="hidden md:flex gap-6 text-base font-medium">
          <Link to="/" className="hover:text-blue-100 transition">Home</Link>
          <Link to="/about" className="hover:text-blue-100 transition">About</Link>
          <Link to="/features" className="hover:text-blue-100 transition">Features</Link>
          <Link to="/contact" className="hover:text-blue-100 transition">Contact</Link>
        </nav>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-100">
              <LogIn className="w-4 h-4 mr-1" />
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">Free Trial</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
