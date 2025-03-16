
import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      path
    );
  }, [path]);

  const suggestedRoutes = useMemo(() => {
    // Extract the first part of the path to determine user role context
    const pathParts = path.split('/').filter(Boolean);
    const userRole = pathParts[0]; // 'tech', 'company', or 'admin'
    
    if (!userRole || !['tech', 'company', 'admin'].includes(userRole)) {
      return [{ label: 'Home', path: '/' }];
    }

    // Common pages for all user types
    const commonRoutes = [
      { label: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`, path: `/${userRole}/dashboard` },
      { label: 'Profile', path: `/${userRole}/profile` },
      { label: 'Support', path: `/${userRole}/support` }
    ];

    // Add specific suggestions based on user role and attempted path keywords
    const lowercasePath = path.toLowerCase();
    if (lowercasePath.includes('knowledge') || lowercasePath.includes('resource')) {
      if (userRole === 'tech') {
        return [...commonRoutes, { label: 'Knowledge Base', path: '/tech/knowledge' }];
      }
    }
    
    return commonRoutes;
  }, [path]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {suggestedRoutes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 mb-3">You might be looking for:</h2>
            <div className="space-y-2">
              {suggestedRoutes.map((route, index) => (
                <Link 
                  key={index} 
                  to={route.path}
                  className="block w-full p-2 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Link to="/">
            <Button variant="default" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Home size={16} />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
