
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, BarChart, ShieldCheck, 
  Wrench, FileText, MessageSquare,
  Clock, ArrowUp, ArrowDown, Play,
  Activity, LifeBuoy, Lightbulb
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Simulate data loading to remove immediate appearance of zeros
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading || workflowsLoading) {
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
          <h1 className="text-3xl font-bold">System Administration</h1>
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
                <Link to="/admin/workflows" className="flex items-center text-white">
                  <Play className="mr-2 h-4 w-4" />
                  Manage Workflows
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Companies</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="bg-blue-200 text-blue-600 p-4 rounded-full mb-2">
                <Wrench className="h-6 w-6" />
              </div>
              <p className="text-sm text-center mb-1">{workflows.length} active workflows</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Link to="/admin/workflows" className="text-black">Manage Workflows</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-2xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-2xl font-bold">$0</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-cyan-200 bg-cyan-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-cyan-600 mr-2" />
              <span className="text-2xl font-bold">100%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Recently active companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border rounded-lg">
                <Building2 className="h-10 w-10 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Companies</h3>
                <p className="text-gray-500 mb-4">There are no companies in the system yet.</p>
              </div>
              
              <div className="mt-6">
                <Button className="w-full">
                  <Link to="/admin/companies" className="text-white w-full">
                    View All Companies
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
            
            <Button variant="ghost" size="sm" className="w-full mt-4">
              <Link to="/admin/activity" className="text-black w-full">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between bg-red-50 border-b border-red-100">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Recent issues reported by users</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/admin/support" className="text-black">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-center py-8">
              <LifeBuoy className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No support tickets</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between bg-blue-50 border-b border-blue-100">
            <div>
              <CardTitle>Community Activity</CardTitle>
              <CardDescription>Recent forum discussions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Link to="/admin/community" className="text-black">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No community discussions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
