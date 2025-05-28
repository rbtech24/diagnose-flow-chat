
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { License } from "@/types/subscription-consolidated";
import { Building2, Calendar, Users, Clock } from "lucide-react";

interface LicenseCardProps {
  license: License;
  onDeactivate: () => void;
}

export function LicenseCard({ license, onDeactivate }: LicenseCardProps) {
  const formatDate = (date?: Date) => {
    return date ? date.toLocaleDateString() : 'N/A';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-50 p-6 md:w-64 flex items-center">
            <Building2 className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h3 className="font-semibold text-lg">{license.company_name || 'Unknown Company'}</h3>
              <div className="flex items-center mt-1">
                <Users className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">{license.activeTechnicians} active technicians</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{license.plan_name} Plan</span>
                  <Badge className={
                    license.status === 'active' ? 'bg-green-100 text-green-800' :
                    license.status === 'trial' ? 'bg-blue-100 text-blue-800' : 
                    license.status === 'expired' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 inline" />
                    <span>Start date: {formatDate(license.startDate)}</span>
                  </div>
                  
                  {license.status === 'trial' && license.trialEndsAt && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 inline" />
                      <span>Trial ends: {formatDate(license.trialEndsAt)}</span>
                    </div>
                  )}
                  
                  {license.endDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 inline" />
                      <span>End date: {formatDate(license.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {license.status !== 'canceled' && (
                  <Button variant="destructive" size="sm" onClick={onDeactivate}>
                    Deactivate License
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
