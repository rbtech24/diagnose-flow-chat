
import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;
  const { userRole, isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      path
    );
  }, [path]);

  const suggestedRoutes = useMemo(() => {
    // Extract the first part of the path to determine user role context
    const pathParts = path.split('/').filter(Boolean);
    const pageRole = pathParts[0]; // 'tech', 'company', or 'admin'
    
    // If user is authenticated, use their role for suggestions
    const roleToUse = isAuthenticated && userRole ? userRole : pageRole;
    
    if (!roleToUse || !['tech', 'company', 'admin'].includes(roleToUse)) {
      return [{ label: 'Home', path: '/' }];
    }

    // Common pages for all user types
    const commonRoutes = [
      { label: `${roleToUse.charAt(0).toUpperCase() + roleToUse.slice(1)} Dashboard`, path: `/${roleToUse}` },
      { label: 'Profile', path: `/${roleToUse}/profile` },
      { label: 'Support', path: `/${roleToUse}/support` }
    ];

    // Add specific suggestions based on user role and attempted path keywords
    const lowercasePath = path.toLowerCase();
    if (lowercasePath.includes('knowledge') || lowercasePath.includes('resource')) {
      if (roleToUse === 'tech') {
        return [...commonRoutes, { label: 'Knowledge Base', path: '/tech/knowledge' }];
      }
    }
    
    if (lowercasePath.includes('feature')) {
      return [...commonRoutes, { label: 'Feature Requests', path: `/${roleToUse}/feature-requests` }];
    }
    
    return commonRoutes;
  }, [path, userRole, isAuthenticated]);

  // Determine the home path based on user role
  const getHomePath = () => {
    if (isAuthenticated) {
      if (userRole === 'admin') return '/admin';
      if (userRole === 'company') return '/company';
      if (userRole === 'tech') return '/tech';
    }
    return '/';
  };

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
          <Link to={getHomePath()}>
            <Button variant="default" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Home size={16} />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
