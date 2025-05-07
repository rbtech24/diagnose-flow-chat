
import React, { useEffect, useState } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import { checkMaintenanceMode } from "@/integrations/supabase/client";

export function ServiceStatusBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  
  useEffect(() => {
    // Check if we're in maintenance mode based on stored errors
    const maintenanceMode = checkMaintenanceMode();
    setIsMaintenanceMode(maintenanceMode);
    setIsVisible(maintenanceMode);
    
    // Re-check every 30 seconds
    const interval = setInterval(() => {
      const maintenanceMode = checkMaintenanceMode();
      setIsMaintenanceMode(maintenanceMode);
      setIsVisible(maintenanceMode);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <p className="text-sm font-medium">
          Our authentication system is currently experiencing issues. 
          Some features may be unavailable at this time.
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)} 
        className="text-white hover:text-gray-200"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}
