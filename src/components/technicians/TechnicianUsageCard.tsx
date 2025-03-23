
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface TechnicianLimits {
  activeCount: number;
  pendingCount: number;
  maxTechnicians: number;
  totalCount: number;
  isAtLimit: boolean;
}

interface TechnicianUsageCardProps {
  limits: TechnicianLimits;
}

export function TechnicianUsageCard({ limits }: TechnicianUsageCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Technician Usage</h3>
            <p className="text-gray-500">
              {limits.activeCount} active + {limits.pendingCount} pending = {limits.totalCount} total of {limits.maxTechnicians} allowed
            </p>
          </div>
          {limits.isAtLimit && (
            <Alert className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limit reached</AlertTitle>
              <AlertDescription>
                Upgrade your plan to add more technicians
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
