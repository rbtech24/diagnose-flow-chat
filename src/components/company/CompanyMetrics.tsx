
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { Users, ChartLine } from "lucide-react";

export function CompanyMetrics() {
  const { activeJobs, teamMembers, responseTime, avgResponseTime, teamPerformance, isLoading } = useCompanyMetrics();

  if (isLoading) {
    return <div className="animate-pulse">Loading metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeJobs}</div>
          <p className="text-xs text-muted-foreground">
            Current ongoing repairs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamMembers}</div>
          <p className="text-xs text-muted-foreground">
            Active technicians
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseTime}</div>
          <p className="text-xs text-muted-foreground">
            Average: {avgResponseTime}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamPerformance}%</div>
          <p className="text-xs text-muted-foreground">
            Overall efficiency score
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
