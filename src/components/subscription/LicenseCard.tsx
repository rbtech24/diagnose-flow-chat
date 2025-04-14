
import { License } from "@/types/subscription";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, UserCheck, Trash2 } from "lucide-react";

// Create an interface that allows the component to accept simplified license data
export interface SimpleLicenseProps {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  activatedOn?: string;
  companyId?: string;
  companyName?: string;
  planId?: string;
  planName?: string;
  startDate?: Date;
  endDate?: Date;
  usageLimits?: {
    diagnosticsPerDay?: number;
    maxTechnicians?: number;
    storageGB?: number;
  };
  // Add other optional License properties
}

interface LicenseCardProps {
  license: License | SimpleLicenseProps;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
}

export function LicenseCard({ 
  license, 
  onActivate, 
  onDeactivate, 
  onDelete 
}: LicenseCardProps) {
  const isActive = typeof license.status === 'string' ? 
    license.status === 'active' : false;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{license.name || 'Unknown User'}</h3>
            <p className="text-sm text-gray-500 mt-1">{license.email}</p>
            {license.role && <p className="text-xs mt-1 text-gray-400">{license.role}</p>}
          </div>
          
          <Badge 
            variant={isActive ? "default" : "outline"} 
            className={isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800"}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        {license.activatedOn && (
          <div className="text-xs text-gray-500 mt-4">
            Activated: {license.activatedOn}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-3 flex justify-end space-x-2">
        {isActive ? (
          <Button variant="outline" size="sm" onClick={onDeactivate}>
            <XCircle className="h-4 w-4 mr-1" />
            Deactivate
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="text-green-600" onClick={onActivate}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Activate
          </Button>
        )}
        
        <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
