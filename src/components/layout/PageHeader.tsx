
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, HelpCircle, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
  showNavigation?: boolean;
}

export function PageHeader({ 
  showBackButton = false, 
  backUrl = '/', 
  title = "Repair Auto Pilot",
  showNavigation = true 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png" 
                alt="Repair Auto Pilot" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {title}
              </span>
            </Link>
          </div>

          {/* Right side - Navigation */}
          {showNavigation && (
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Home</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/help-center">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Help</span>
                </Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
