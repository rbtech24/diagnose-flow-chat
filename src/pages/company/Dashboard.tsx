
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Wrench, Clock, AlertTriangle,
  PlusCircle, MessagesSquare,
  Play, Activity, Stethoscope
} from "lucide-react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

interface CompanyData {
  id: string;
  name: string;
  subscription_tier: string;
}

interface Technician {
  id: string;
  name: string;
  avatar_url?: string;
  status: string;
  job_count: number;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status?: string;
}

export default function CompanyDashboard() {
  // State for company data
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [metrics, setMetrics] = useState({
    responseTime: "0",
    teamPerformance: "0"
  });
  const [loading, setLoading] = useState(true);

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
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!userData.user) {
          toast.error("Authentication error", {
            description: "You're not logged in or your session has expired."
          });
          return;
        }
        
        // Get user metadata which contains company_id
        const companyId = userData.user.user_metadata?.company_id;
        
        if (!companyId) {
          toast.error("Company data not found", {
            description: "Your user account is not associated with a company."
          });
          return;
        }
        
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, name, subscription_tier')
          .eq('id', companyId)
          .single();
        
        if (companyError) throw companyError;
        setCompany(companyData);
        
        // Fetch active technicians
        const { data: techData, error: techError } = await supabase
          .from('technicians')
          .select(`
            id, 
            email,
            status
          `)
          .eq('company_id', companyId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (techError) throw techError;
        
        // Get user profiles for the technicians to get names and avatars
        const technicianProfiles = await Promise.all(
          techData.map(async (tech) => {
            // Get user profile data from auth.users
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', tech.id)
              .single();
              
            // Get job count for each technician
            const { count: jobCount } = await supabase
              .from('repairs')
              .select('id', { count: 'exact', head: true })
              .eq('technician_id', tech.id)
              .eq('status', 'in_progress');
              
            return {
              id: tech.id,
              name: profileData?.full_name || tech.email.split('@')[0],
              avatar_url: profileData?.avatar_url || undefined,
              status: tech.status,
              job_count: jobCount || 0
            };
          })
        );
        
        setTechnicians(technicianProfiles);
        
        // Fetch recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity_logs')
          .select(`id, activity_type, description, created_at, metadata`)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (activityError) throw activityError;
        
        // Format activity data
        const formattedActivity = activityData.map(item => ({
          id: item.id,
          type: item.activity_type,
          description: item.description || `${item.activity_type} activity`,
          timestamp: new Date(item.created_at).toLocaleString(),
          status: item.metadata?.status || undefined
        }));
        
        setRecentActivity(formattedActivity);
        
        // Fetch company metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('analytics_metrics')
          .select('metric_name, metric_value')
          .eq('company_id', companyId)
          .in('metric_name', ['avg_response_time', 'team_performance'])
          .order('timestamp', { ascending: false });
          
        if (metricsError) throw metricsError;
        
        // Process metrics
        const responseTimeMetric = metricsData?.find(m => m.metric_name === 'avg_response_time');
        const teamPerformanceMetric = metricsData?.find(m => m.metric_name === 'team_performance');
        
        setMetrics({
          responseTime: responseTimeMetric ? responseTimeMetric.metric_value.toFixed(1) : "1.8",
          teamPerformance: teamPerformanceMetric ? teamPerformanceMetric.metric_value.toFixed(0) : "94"
        });
        
      } catch (err) {
        const error = handleApiError(err, "fetching dashboard data", false);
        toast.error("Failed to load dashboard data", {
          description: error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 bg-gray-200 animate-pulse w-48 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-32 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <div className="md:col-span-3 h-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{company?.name || "Company Dashboard"}</h1>
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
                  <p className="text-2xl font-bold">{metrics.responseTime} hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Team Performance</p>
                  <p className="text-2xl font-bold">{metrics.teamPerformance}%</p>
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
              <span className="text-2xl font-bold">{technicians.length}</span>
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
              <span className="text-2xl font-bold">{metrics.responseTime} hrs</span>
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
              {technicians.length > 0 ? (
                technicians.map(tech => (
                  <div 
                    key={tech.id}
                    className={`flex justify-between mb-4 p-3 rounded-lg ${
                      tech.status === 'active' ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-2">
                        {tech.avatar_url ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={tech.avatar_url} alt={tech.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {tech.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          tech.status === 'active' ? "bg-green-500" : "bg-gray-300"
                        }`}></span>
                      </div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-xs text-gray-500">
                          {tech.status === 'active' ? 'Active' : 'Offline'} • {tech.job_count} jobs
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Link to="/company/technicians" className="text-black">View</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No technicians found</p>
                  <Button size="sm">
                    <Link to="/company/technicians" className="text-white flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Technician
                    </Link>
                  </Button>
                </div>
              )}
              
              {technicians.length > 0 && (
                <div className="mt-6">
                  <Button className="w-full">
                    <Link to="/company/technicians" className="text-white w-full flex justify-center items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Manage Technicians
                    </Link>
                  </Button>
                </div>
              )}
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
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div 
                    key={activity.id} 
                    className={`flex items-start gap-4 p-3 rounded-lg ${
                      activity.type === 'repair' ? "bg-blue-50 border border-blue-100" :
                      activity.type === 'technician' ? "bg-green-50 border border-green-100" :
                      "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    <div className={`mt-1 rounded-full p-1 ${
                      activity.type === 'repair' ? "bg-blue-100" :
                      activity.type === 'technician' ? "bg-green-100" :
                      "bg-amber-100"
                    }`}>
                      {activity.type === 'repair' && <Wrench className="h-3 w-3 text-blue-600" />}
                      {activity.type === 'technician' && <Users className="h-3 w-3 text-green-600" />}
                      {activity.type !== 'repair' && activity.type !== 'technician' && (
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent activity
                </div>
              )}
              
              {recentActivity.length > 0 && (
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  <Link to="/company/activity" className="text-black w-full">View All Activity</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
