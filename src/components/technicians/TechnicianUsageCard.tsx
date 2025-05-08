
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface TechnicianLimits {
  activeCount: number;
  pendingCount: number;
  maxTechnicians: number;
  totalCount: number;
  isAtLimit: boolean;
}

interface TechnicianUsageCardProps {
  limits: TechnicianLimits;
  isOnTrial?: boolean;
  diagnosticsUsed?: number;
  diagnosticsLimit?: number;
}

export function TechnicianUsageCard({ 
  limits, 
  isOnTrial = false, 
  diagnosticsUsed = 0, 
  diagnosticsLimit = 0 
}: TechnicianUsageCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
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
          
          {diagnosticsLimit > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Diagnostics Usage</span>
                <span className="text-gray-500">{diagnosticsUsed} / {diagnosticsLimit}</span>
              </div>
              <Progress value={(diagnosticsUsed / diagnosticsLimit) * 100} />
              {isOnTrial && (
                <p className="text-xs text-amber-600">
                  Trial accounts have limited diagnostic runs. Upgrade to increase your daily limit.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
