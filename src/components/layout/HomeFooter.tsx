
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cacheBustUrl } from "@/utils/cacheControl";

export default function HomeFooter() {
  // Debug log for component mounting
  React.useEffect(() => {
    console.log("HomeFooter component mounted");
  }, []);

  // Check if we're within a Router context by attempting to use useNavigate
  // If it fails, we'll use regular <a> tags instead of <Link>
  let isRouterAvailable = true;
  try {
    // This will throw an error if not in a router context
    useNavigate();
  } catch (e) {
    console.log("Router context not available in HomeFooter, falling back to <a> tags");
    isRouterAvailable = false;
  }

  // Create a LinkOrAnchor component that conditionally renders Link or a based on router availability
  // Updated to accept onClick prop for consistency with HomeHeader
  const LinkOrAnchor = ({ 
    to, 
    className, 
    children,
    onClick
  }: { 
    to: string; 
    className?: string; 
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    return isRouterAvailable ? (
      <Link to={to} className={className} onClick={onClick}>{children}</Link>
    ) : (
      <a href={to} className={className} onClick={onClick}>{children}</a>
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><LinkOrAnchor to="/" className="text-gray-600 hover:text-blue-600 transition">Home</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/features" className="text-gray-600 hover:text-blue-600 transition">Features</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</LinkOrAnchor></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><LinkOrAnchor to="/about" className="text-gray-600 hover:text-blue-600 transition">About</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/careers" className="text-gray-600 hover:text-blue-600 transition">Careers</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</LinkOrAnchor></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><LinkOrAnchor to="/help" className="text-gray-600 hover:text-blue-600 transition">Help Center</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/community" className="text-gray-600 hover:text-blue-600 transition">Community</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/partners" className="text-gray-600 hover:text-blue-600 transition">Partners</LinkOrAnchor></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><LinkOrAnchor to="/privacy" className="text-gray-600 hover:text-blue-600 transition">Privacy Policy</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/terms" className="text-gray-600 hover:text-blue-600 transition">Terms of Service</LinkOrAnchor></li>
              <li><LinkOrAnchor to="/security" className="text-gray-600 hover:text-blue-600 transition">Security</LinkOrAnchor></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Repair Auto Pilot. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition" aria-label="Twitter">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            
            <a href="#" className="text-gray-600 hover:text-blue-600 transition" aria-label="LinkedIn">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
              </svg>
            </a>
            
            <a href="#" className="text-gray-600 hover:text-blue-600 transition" aria-label="Facebook">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
