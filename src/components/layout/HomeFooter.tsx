
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Facebook } from "lucide-react";

export default function HomeFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <Link to="/" className="flex flex-col items-start">
              <img 
                src="/lovable-uploads/629af177-1002-4110-97f9-4c8747ad00f6.png"
                alt="Repair Auto Pilot" 
                className="h-14 mb-3 object-contain"
                style={{ maxWidth: 220 }}
              />
              <p className="text-gray-600 text-sm">
                The ultimate appliance repair diagnostic solution for modern service businesses.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-gray-600">
                  <Twitter size={20} />
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-600">
                  <Linkedin size={20} />
                </a>
                <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-gray-600">
                  <Facebook size={20} />
                </a>
              </div>
            </Link>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 hover:text-blue-600 text-sm">Features</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-blue-600 text-sm">Case Studies</Link></li>
              <li><Link to="/reviews" className="text-gray-600 hover:text-blue-600 text-sm">Reviews</Link></li>
              <li><Link to="/updates" className="text-gray-600 hover:text-blue-600 text-sm">Updates</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">About</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 text-sm">Careers</Link></li>
              <li><Link to="/partners" className="text-gray-600 hover:text-blue-600 text-sm">Partners</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-gray-600 hover:text-blue-600 text-sm">Help Center</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-blue-600 text-sm">Community</Link></li>
              <li><Link to="/status" className="text-gray-600 hover:text-blue-600 text-sm">Status</Link></li>
              <li><Link to="/get-started" className="text-gray-600 hover:text-blue-600 text-sm">Get Started</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Repair Auto Pilot. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms-of-use" className="hover:text-blue-600">Terms of Use</Link>
            <Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
