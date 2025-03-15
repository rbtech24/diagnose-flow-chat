
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, BarChart, ShieldCheck, 
  Search, Wrench, FileText, MessageSquare,
  Clock, ArrowUp, ArrowDown, Play,
  Activity, LifeBuoy, Lightbulb
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
          <Button size="icon" variant="ghost" className="rounded-full">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img className="aspect-square h-full w-full" src="https://i.pravatar.cc/300" alt="Profile" />
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                Manage Workflows
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Companies</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">98.7%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-2">
                <Wrench className="h-6 w-6" />
              </div>
              <p className="text-sm text-center mb-1">{isLoading ? "Loading..." : `${workflows.length} active workflows`}</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link to="/admin/workflows">Manage Workflows</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">42</span>
              <span className="ml-2 text-xs text-emerald-500">+8%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">186</span>
              <span className="ml-2 text-xs text-emerald-500">+12%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">$58.2k</span>
              <span className="ml-2 text-xs text-red-500">-3%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">99.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Recently active companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=1" alt="Company" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <p className="font-medium">Acme Appliance Co.</p>
                    <p className="text-xs text-gray-500">Active • 12 technicians</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=2" alt="Company" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <p className="font-medium">TechFix Solutions</p>
                    <p className="text-xs text-gray-500">Active • 8 technicians</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="relative mr-2">
                    <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/300?img=3" alt="Company" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-gray-300"></span>
                  </div>
                  <div>
                    <p className="font-medium">Premier Repair Inc.</p>
                    <p className="text-xs text-gray-500">Inactive • 0 technicians</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link to="/admin/companies">
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
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-blue-100 p-1">
                  <Building2 className="h-3 w-3 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New company registered</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-green-100 p-1">
                  <Users className="h-3 w-3 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">5 new technicians added</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-amber-100 p-1">
                  <Wrench className="h-3 w-3 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New workflow published</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full mt-4">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Recent issues reported by users</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/support">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Login Issues on Mobile</p>
                  <p className="text-sm text-muted-foreground">Reported by 3 users</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">High</span>
                </div>
              </div>
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Workflow Export Failure</p>
                  <p className="text-sm text-muted-foreground">Reported by 1 user</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Critical</span>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Slow Dashboard Loading</p>
                  <p className="text-sm text-muted-foreground">Reported by 8 users</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Medium</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Community Activity</CardTitle>
              <CardDescription>Recent forum discussions</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/community">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Best practices for refrigerator diagnostics</p>
                  <p className="text-sm text-muted-foreground">24 replies • Active</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Troubleshooting HVAC systems efficiently</p>
                  <p className="text-sm text-muted-foreground">18 replies • Active</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Common washing machine error codes</p>
                  <p className="text-sm text-muted-foreground">32 replies • Active</p>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-8 right-8">
        <Button size="lg" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
