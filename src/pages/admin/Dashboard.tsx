
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
import { useUserManagementStore } from "@/store/userManagementStore";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { workflows, isLoading: workflowsLoading } = useWorkflows();
  
  // Get companies and users data
  const { 
    companies, 
    users, 
    fetchCompanies, 
    fetchUsers, 
    isLoadingCompanies, 
    isLoadingUsers 
  } = useUserManagementStore();

  // Get recent activity data
  const { 
    logs: activityLogs, 
    isLoading: isLoadingActivity, 
    loadLogs
  } = useActivityLogs();

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    loadLogs('today'); // Load today's activity
  }, [fetchCompanies, fetchUsers, loadLogs]);

  // Calculate active companies
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  
  // Calculate active technicians
  const activeTechnicians = users.filter(user => user.role === 'tech').length;
  
  // Get recent activity from logs
  const recentActivity = activityLogs.slice(0, 3);
  
  // Get recently active companies
  const recentlyActiveCompanies = [...companies]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Format activity timestamp
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    if (type.includes('company')) return <Building2 className="h-3 w-3 text-blue-600" />;
    if (type.includes('user')) return <Users className="h-3 w-3 text-green-600" />;
    if (type.includes('workflow')) return <Wrench className="h-3 w-3 text-amber-600" />;
    return <Activity className="h-3 w-3 text-purple-600" />;
  };

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
                  {isLoadingCompanies ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{companies.length}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">Online</p>
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
              {workflowsLoading ? (
                <Skeleton className="h-4 w-32 mb-2" />
              ) : (
                <p className="text-sm text-center mb-1">{workflows.length} active workflows</p>
              )}
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
              {isLoadingCompanies ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{activeCompanies}</span>
              )}
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
              {isLoadingUsers ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{activeTechnicians}</span>
              )}
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
              <span className="text-2xl font-bold">Online</span>
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
              {isLoadingCompanies ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : recentlyActiveCompanies.length > 0 ? (
                <>
                  {recentlyActiveCompanies.map((company) => {
                    // Calculate technician count for each company directly from users array
                    const techCount = users.filter(user => 
                      user.companyId === company.id && user.role === 'tech'
                    ).length;
                    
                    return (
                      <div key={company.id} className="flex justify-between mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <div className="flex items-center">
                          <div className="relative mr-2">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {company.name.charAt(0)}
                            </div>
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${company.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-xs text-gray-500">
                              {company.status === 'active' ? 'Active' : company.status} • {techCount} technicians
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Link to={`/admin/companies/${company.id}`} className="text-black">View</Link>
                        </Button>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">No companies available</p>
              )}
              
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
            <div className="space-y-4">
              {isLoadingActivity ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="mt-1 rounded-full bg-blue-100 p-1">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatActivityTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : companies.length > 0 ? (
                <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="mt-1 rounded-full bg-blue-100 p-1">
                    <Building2 className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Company data loaded</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="w-full mt-4">
                <Link to="/admin/activity" className="text-black w-full">View All Activity</Link>
              </Button>
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
              <Link to="/admin/support" className="text-black">View All</Link>
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
              <Link to="/admin/community" className="text-black">View All</Link>
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
