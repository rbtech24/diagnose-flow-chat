
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

export default function CompanyDashboard() {
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
    metrics 
  } = useCompanyTechnicians();
  
  // Get support tickets data
  const { tickets, isLoading: ticketsLoading, error: ticketsError } = useSupportTickets();
  
  // Get system messages for this user
  const userMessages = useSystemMessages().messages.filter(msg => 
    msg.targetUsers.includes("company")
  );

  // State for the technician to be deleted
  const [techToDelete, setTechToDelete] = useState<string | null>(null);

  // Calculate active technicians
  const activeTechnicians = technicians?.filter(tech => tech.status === "active") || [];

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
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
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
                <Link to="/company/diagnostics" className="flex items-center text-white">
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
                  <p className="text-sm font-medium">Team Performance</p>
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
                <Link to="/company/diagnostics" className="text-black">View Diagnostics</Link>
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
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600 mr-2" />
              {techniciansLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{activeTechnicians.length}</span>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your technicians</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
              {techniciansLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : technicians.length > 0 ? (
                <>
                  {technicians.slice(0, 3).map((tech, index) => (
                    <div key={tech.id || index} className={`flex justify-between mb-4 p-3 rounded-lg ${
                      tech.status === "active" 
                        ? "bg-green-50 border border-green-100" 
                        : "bg-gray-50 border border-gray-100"
                    }`}>
                      <div className="flex items-center">
                        <div className="relative mr-2">
                          <img 
                            className="h-10 w-10 rounded-full object-cover bg-gray-200"
                            src={tech.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name || 'User')}&background=random`} 
                            alt={tech.name || "Technician"}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name || 'User')}&background=random`;
                            }}
                          />
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            tech.status === "active" ? "bg-green-500" : "bg-gray-300"
                          }`}></span>
                        </div>
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-gray-500">
                            {tech.status === "active" ? "Active" : "Offline"} • {tech.activeJobs || 0} jobs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Link to="/company/technicians" className="text-black">View</Link>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setTechToDelete(tech.id)}>
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Technician</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this technician? This action is permanent and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setTechToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteTechnician} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <Users className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-center mb-2">No technicians available</p>
                  <p className="text-center text-sm text-gray-400 mb-4">Add technicians to your team to get started</p>
                </div>
              )}
              
              <div className="mt-6">
                <Button className="w-full">
                  <Link to="/company/technicians" className="text-white w-full flex justify-center items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Manage Technicians
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="space-y-4">
              {ticketsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : ticketsError ? (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-red-50 border border-red-100">
                  <div className="mt-1 rounded-full bg-red-100 p-1">
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Error loading activity</p>
                    <p className="text-xs text-gray-500">Please refresh to try again</p>
                  </div>
                </div>
              ) : tickets && tickets.length > 0 ? (
                tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="mt-1 rounded-full bg-blue-100 p-1">
                      <MessagesSquare className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{ticket.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <Info className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-center mb-2">No recent activity</p>
                  <p className="text-center text-sm text-gray-400">Create tickets to see activity here</p>
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Link to="/company/activity" className="text-black w-full">View All Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
