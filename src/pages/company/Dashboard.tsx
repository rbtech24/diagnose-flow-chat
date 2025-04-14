import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Wrench, Clock, AlertTriangle,
  PlusCircle, ArrowUp, MessagesSquare,
  Play, Activity, Stethoscope
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function CompanyDashboard() {
  const { role, isLoading: roleLoading } = useUserRole();
  const { user } = useAuth();
  
  // Get workflows for diagnosis
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  
  // Get company metrics
  const { activeJobs, teamMembers, responseTime, avgResponseTime, teamPerformance, isLoading: metricsLoading } = useCompanyMetrics(user?.companyId);
  
  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Check if user is authorized to access this page
  if (!roleLoading && role !== 'company' && role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  const isLoading = metricsLoading || workflowsLoading;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
      </div>
      
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
                  <p className="text-2xl font-bold">{avgResponseTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Team Performance</p>
                  <p className="text-2xl font-bold">{teamPerformance}%</p>
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
              <p className="text-sm text-center mb-1">{workflows.length} available procedures</p>
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
              <span className="text-2xl font-bold">{activeJobs}</span>
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
              <span className="text-2xl font-bold">{teamMembers}</span>
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
              <span className="text-2xl font-bold">{responseTime}</span>
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
              {teamMembers > 0 ? (
                <div className="space-y-4">
                  {/* We'd map over actual technicians here */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">You have {teamMembers} technicians in your team</h3>
                    <p className="text-sm text-gray-500 mt-1">View and manage your team members</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Team Members</h3>
                  <p className="text-gray-500 mb-4">You don't have any team members yet.</p>
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
            <div className="text-center py-8">
              <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
            
            <Button variant="ghost" size="sm" className="w-full mt-4">
              <Link to="/company/activity" className="text-black w-full">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add CRM Integration "Coming Soon" Section */}
      <Card className="mb-8 border-2 border-dashed border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-blue-600" />
            CRM Integration
          </CardTitle>
          <CardDescription>Connect with services like HouseCallPro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="bg-blue-100 text-blue-700 inline-block p-2 rounded-lg text-xs font-semibold mb-3">COMING SOON</div>
            <p className="text-sm text-gray-600 mb-2">Seamlessly integrate with your favorite CRM platforms</p>
            <p className="text-xs text-gray-500">We're working hard to bring this feature to you. Check back soon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
