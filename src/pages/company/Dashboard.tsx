
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Wrench, Clock, AlertTriangle,
  PlusCircle, ArrowUp, MessagesSquare,
  Play, Activity, Stethoscope
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";

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
  const { workflows, isLoading } = useWorkflows();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">ABC Appliance Repair</h1>
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
                  <p className="text-2xl font-bold">1.8 hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Team Performance</p>
                  <p className="text-2xl font-bold">94%</p>
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
              <p className="text-sm text-center mb-1">{isLoading ? "Loading..." : `${workflows.length} available procedures`}</p>
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
              <span className="text-2xl font-bold">12</span>
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
              <span className="text-2xl font-bold">8</span>
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
              <span className="text-2xl font-bold">1.4 hrs</span>
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
              <div className="flex justify-between mb-4 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=1" alt="Technician" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-xs text-gray-500">Active • 3 jobs</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link to="/company/technicians" className="text-black">View</Link>
                </Button>
              </div>
              
              <div className="flex justify-between mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=2" alt="Technician" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Active • 2 jobs</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link to="/company/technicians" className="text-black">View</Link>
                </Button>
              </div>
              
              <div className="flex justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=3" alt="Technician" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-gray-300"></span>
                  </div>
                  <div>
                    <p className="font-medium">Mike Williams</p>
                    <p className="text-xs text-gray-500">Offline • 0 jobs</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link to="/company/technicians" className="text-black">View</Link>
                </Button>
              </div>
              
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
              <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="mt-1 rounded-full bg-blue-100 p-1">
                  <Wrench className="h-3 w-3 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New job created</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="mt-1 rounded-full bg-green-100 p-1">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tech assigned to job #1234</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="mt-1 rounded-full bg-amber-100 p-1">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Job #1230 needs attention</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Link to="/company/activity" className="text-black w-full">View All Activity</Link>
              </Button>
            </div>
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
