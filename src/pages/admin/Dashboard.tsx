
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, BarChart, ShieldCheck, 
  Wrench, Clock, Activity, LifeBuoy,
  MessageSquare, Play
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { workflows, isLoading: isWorkflowsLoading } = useWorkflows();
  const { toast } = useToast();
  
  // Define state for dashboard metrics
  const [companiesCount, setCompaniesCount] = useState<number>(0);
  const [techniciansCount, setTechniciansCount] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [systemHealth, setSystemHealth] = useState<number>(98.7); // Default value
  const [systemUptime, setSystemUptime] = useState<number>(99.8); // Default value
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentCompanies, setRecentCompanies] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        // Fetch companies count
        const { count: companiesCount, error: companiesError } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });

        if (companiesError) throw companiesError;
        setCompaniesCount(companiesCount || 0);

        // Fetch recent companies
        const { data: recentCompaniesData, error: recentCompaniesError } = await supabase
          .from('companies')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentCompaniesError) throw recentCompaniesError;
        setRecentCompanies(recentCompaniesData || []);

        // Fetch technicians count (users with role 'tech')
        const { count: techniciansCount, error: techniciansError } = await supabase
          .from('technicians')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'tech');

        if (techniciansError) throw techniciansError;
        setTechniciansCount(techniciansCount || 0);

        // Fetch recent system activity (simplified example)
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity_logs')
          .select('id, activity_type, description, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (activityError) throw activityError;
        setRecentActivity(activityData || []);

        // Fetch revenue data (example using payment_transactions table)
        const { data: revenueData, error: revenueError } = await supabase
          .from('payment_transactions')
          .select('amount');

        if (revenueError) throw revenueError;
        // Calculate total revenue - ensure proper type conversion
        const totalRevenue = revenueData?.reduce((sum, transaction) => 
          sum + (parseFloat(String(transaction.amount)) || 0), 0) || 0;
        setRevenue(totalRevenue);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading dashboard data",
          description: "Could not fetch the latest metrics",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [toast]);

  // Format activity data for display
  const formatActivityEntry = (activity: any) => {
    if (!activity) return null;
    
    let title = "System activity";
    let timeAgo = "recently";
    
    // Format based on activity type
    if (activity.activity_type === 'user_created') {
      title = "New company registered";
    } else if (activity.activity_type === 'tech_added') {
      title = "New technicians added";
    } else if (activity.activity_type === 'workflow_published') {
      title = "New workflow published";
    }
    
    // Calculate time ago
    if (activity.created_at) {
      const activityDate = new Date(activity.created_at);
      const now = new Date();
      const diffMs = now.getTime() - activityDate.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      
      if (diffMins < 60) {
        timeAgo = `${diffMins} minutes ago`;
      } else {
        timeAgo = `${diffHours} hours ago`;
      }
    }
    
    return { title, timeAgo };
  };
  
  const formatCompanyEntry = (company: any) => {
    if (!company) return { name: "Unknown Company", status: "Unknown", techCount: 0 };
    
    return {
      name: company.name || "Unnamed Company",
      status: "Active",
      techCount: 0 // We'll update this when we have the relationship data
    };
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
                  <p className="text-2xl font-bold">{isLoading ? "-" : companiesCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold">{systemHealth}%</p>
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
              <p className="text-sm text-center mb-1">
                {isWorkflowsLoading 
                  ? "Loading..." 
                  : workflows.length > 0 
                    ? `${workflows.length} active workflows` 
                    : "No workflows"}
              </p>
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
              <span className="text-2xl font-bold">{isLoading ? "-" : companiesCount}</span>
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
              <span className="text-2xl font-bold">{isLoading ? "-" : techniciansCount}</span>
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
              <span className="text-2xl font-bold">${isLoading ? "-" : revenue.toFixed(2)}</span>
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
              <span className="text-2xl font-bold">{systemUptime}%</span>
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
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentCompanies.length > 0 ? (
                <div className="space-y-4">
                  {recentCompanies.map(company => {
                    const formattedCompany = formatCompanyEntry(company);
                    return (
                      <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{formattedCompany.name}</h4>
                            <p className="text-sm text-gray-500">
                              <span className="inline-block px-2 py-0.5 mr-2 text-xs rounded-full bg-green-100 text-green-800">
                                {formattedCompany.status}
                              </span>
                              Technicians: {formattedCompany.techCount}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Link to={`/admin/companies/${company.id}`}>View</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  <div className="text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No company data available</p>
                  </div>
                </div>
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
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(activity => {
                  const formattedActivity = formatActivityEntry(activity);
                  if (!formattedActivity) return null;
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-2">
                      <div className="bg-blue-100 p-1.5 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{formattedActivity.title}</p>
                        <p className="text-xs text-gray-500">{formattedActivity.timeAgo}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No recent activity</p>
                </div>
              </div>
            )}
            
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
