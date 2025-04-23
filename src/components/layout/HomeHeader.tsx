import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cacheBustUrl } from "@/utils/cacheControl";
import { Menu, X } from "lucide-react";

export default function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Debug log for component mounting
  React.useEffect(() => {
    console.log("HomeHeader component mounted");
  }, []);

  // Check if we're within a Router context by attempting to use useNavigate
  // If it fails, we'll use regular <a> tags instead of <Link>
  let isRouterAvailable = true;
  try {
    // This will throw an error if not in a router context
    useNavigate();
  } catch (e) {
    console.log("Router context not available in HomeHeader, falling back to <a> tags");
    isRouterAvailable = false;
  }

  // Create a LinkOrAnchor component that conditionally renders Link or a based on router availability
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <LinkOrAnchor to="/" className="flex items-center" aria-label="Home">
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
        </LinkOrAnchor>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
            Features
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Testimonials
          </a>
          <LinkOrAnchor to="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </LinkOrAnchor>
          <LinkOrAnchor to="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </LinkOrAnchor>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700 rounded-md hover:bg-gray-100"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[76px] left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="flex flex-col px-4 py-4 space-y-4">
              <a 
                href="#features" 
                className="text-gray-700 hover:text-blue-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-blue-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <LinkOrAnchor 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </LinkOrAnchor>
              <LinkOrAnchor 
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                  Get Started
                </Button>
              </LinkOrAnchor>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
