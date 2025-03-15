
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, BarChart, ShieldCheck, Timer, 
  AlertTriangle, Database, LineChart, ArrowUp, ArrowDown,
  Search, Lightbulb, MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System Administration</h1>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">42</span>
              </div>
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> 
                8% this month
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-2xl font-bold">186</span>
              </div>
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> 
                12% this month
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">$58.2k</span>
              </div>
              <span className="text-xs text-red-600 flex items-center">
                <ArrowDown className="h-3 w-3 mr-1" /> 
                3% this month
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-2xl font-bold">98.7%</span>
              </div>
              <span className="text-xs text-green-600 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" /> 
                1.2% this month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time system metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/system-health">View Details</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">API Response Time</p>
                    <span className="text-sm font-medium">150ms</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-2/3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Error Rate</p>
                    <span className="text-sm font-medium">0.01%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[5%] rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Database Load</p>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[45%] rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Cache Hit Rate</p>
                    <span className="text-sm font-medium">98.5%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[98%] rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>System Usage</CardTitle>
              <CardDescription>Current platform metrics</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/system-usage">View Details</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">245</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">1,892</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">1.8s</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold">68%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Recent Support Tickets</CardTitle>
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Feature Requests</CardTitle>
              <CardDescription>Most requested features from users</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/feature-requests">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Offline Mode Support</p>
                  <p className="text-sm text-muted-foreground">82 votes</p>
                </div>
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <div className="flex justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Report Customization</p>
                  <p className="text-sm text-muted-foreground">57 votes</p>
                </div>
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">API Webhook Integration</p>
                  <p className="text-sm text-muted-foreground">41 votes</p>
                </div>
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
