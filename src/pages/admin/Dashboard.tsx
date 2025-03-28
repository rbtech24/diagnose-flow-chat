
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, BarChart, ShieldCheck, 
  Wrench, Clock, Activity, LifeBuoy,
  MessageSquare, Play
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";

export default function AdminDashboard() {
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
  const { workflows, isLoading } = useWorkflows();
  
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
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">-</p>
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
              <p className="text-sm text-center mb-1">{isLoading ? "Loading..." : workflows.length > 0 ? `${workflows.length} active workflows` : "No workflows"}</p>
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
              <span className="text-2xl font-bold">-</span>
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
              <span className="text-2xl font-bold">-</span>
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
              <span className="text-2xl font-bold">-</span>
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
              <span className="text-2xl font-bold">-</span>
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
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No company data available</p>
                </div>
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
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activity</p>
              </div>
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
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <LifeBuoy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No support tickets available</p>
              </div>
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
            <div className="flex items-center justify-center h-48 text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No community activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
