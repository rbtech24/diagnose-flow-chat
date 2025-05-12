import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Wrench, Clock, AlertTriangle,
  PlusCircle, MessagesSquare,
  Play, Activity, Stethoscope, X, Info
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useEffect, useState } from "react";
import { useSystemMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";
import { useCompanyTechnicians } from "@/hooks/useCompanyTechnicians";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Explicitly define the metrics type to avoid deep instantiation issues
interface TechnicianMetrics {
  responseTime: string;
  teamPerformance: number;
  activeJobs: number;
  completedJobs: number;
  averageServiceTime: number;
  efficiencyScore: number;
}

export default function TechDashboard() {
  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Get workflows for diagnosis
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  
  // Get technicians data and company metrics
  const { 
    technicians, 
    isLoading: techniciansLoading, 
    error: techniciansError,
    deleteTechnician, 
    metrics: rawMetrics
  } = useCompanyTechnicians();
  
  // Get support tickets data
  const { tickets, isLoading: ticketsLoading, error: ticketsError } = useSupportTickets();
  
  // Get system messages for this user
  const userMessages = useSystemMessages().messages.filter(msg => 
    msg.targetUsers.includes("tech")
  );

  // State for the technician to be deleted
  const [techToDelete, setTechToDelete] = useState<string | null>(null);

  // Calculate active technicians
  const activeTechnicians = technicians?.filter(tech => tech.status === "active") || [];

  // Format metrics to match the TechnicianMetrics interface
  const metrics: TechnicianMetrics = {
    responseTime: rawMetrics?.average_response_time || 'N/A',
    teamPerformance: rawMetrics?.performance_score || 0,
    activeJobs: rawMetrics?.active_jobs || 0,
    completedJobs: rawMetrics?.completed_jobs || 0,
    averageServiceTime: typeof rawMetrics?.average_service_time === 'number' 
      ? rawMetrics.average_service_time 
      : 0,
    efficiencyScore: rawMetrics?.efficiency_score || 0
  };

  // Handle technician deletion with confirmation
  const handleDeleteTechnician = async () => {
    if (techToDelete) {
      const success = await deleteTechnician(techToDelete);
      setTechToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
      </div>
      
      {techniciansError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load technicians data. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      )}
      
      {userMessages.map(msg => (
        <SystemMessage 
          key={msg.id} 
          type={msg.type} 
          title={msg.title} 
          message={msg.message} 
        />
      ))}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <Card className="md:col-span-3 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/tech/diagnostics" className="flex items-center text-white">
                  <Play className="mr-2 h-4 w-4" />
                  Start Diagnosis
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Avg Response Time</p>
                  {techniciansLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold">{metrics.responseTime}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Your Performance</p>
                  {techniciansLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {metrics.teamPerformance > 0 ? `${metrics.teamPerformance}%` : 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="bg-purple-200 text-purple-600 p-4 rounded-full mb-2">
                <Stethoscope className="h-6 w-6" />
              </div>
              {workflowsLoading ? (
                <Skeleton className="h-5 w-32 mb-2" />
              ) : workflows && workflows.length > 0 ? (
                <p className="text-sm text-center mb-1">{workflows.length} available procedures</p>
              ) : (
                <p className="text-sm text-center mb-1">No procedures available</p>
              )}
              <Button variant="outline" size="sm" className="mt-2">
                <Link to="/tech/diagnostics" className="text-black">View Diagnostics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-cyan-200 bg-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wrench className="h-4 w-4 text-cyan-600 mr-2" />
              {techniciansLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{metrics.activeJobs}</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600 mr-2" />
              {techniciansLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{metrics.completedJobs}</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-amber-600 mr-2" />
              {techniciansLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <span className="text-2xl font-bold">{metrics.responseTime}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between bg-red-50 border-b border-red-100">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>No current support tickets</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/tech/support" className="text-black">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex items-center justify-center h-24">
              <p className="text-gray-500">No support tickets available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between bg-blue-50 border-b border-blue-100">
            <div>
              <CardTitle>Community Activity</CardTitle>
              <CardDescription>No recent forum discussions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/tech/community" className="text-black">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="flex items-center justify-center h-24">
              <p className="text-gray-500">No community activity available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
