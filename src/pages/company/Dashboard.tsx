
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BarChart, LineChart } from "@/components/ui/chart";
import { 
  Calendar,
  Clock,
  Contact,
  FileText,
  HardDrive,
  Wrench,
  ClipboardList,
  UserCog,
  CheckCircle,
  XCircle,
  CircleDashed,
  ArrowUpRight,
  Package,
  Settings,
  Bell,
  Users,
  BarChart3,
  CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ActivityItem, FormattedActivity } from "@/types/activity";

interface DashboardMetrics {
  activeRepairs: number;
  completedRepairs: number;
  pendingRepairs: number;
  activeTechnicians: number;
  upcomingAppointments: number;
  overdueInvoices: number;
  monthlyRevenue: number;
  customerCount: number;
  inventoryAlerts: number;
  isLoading: boolean;
}

interface TechnicianInfo {
  id: string;
  name: string;
  email: string;
  status: string;
  avatarUrl?: string;
  jobsCompleted?: number;
  rating?: number;
}

// Create a class to handle the data fetching
const initialMetrics: DashboardMetrics = {
  activeRepairs: 0,
  completedRepairs: 0,
  pendingRepairs: 0,
  activeTechnicians: 0,
  upcomingAppointments: 0,
  overdueInvoices: 0,
  monthlyRevenue: 0,
  customerCount: 0,
  inventoryAlerts: 0,
  isLoading: true
};

export default function CompanyDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [recentActivity, setRecentActivity] = useState<FormattedActivity[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the currently authenticated user's company_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        const { data: userData } = await supabase
          .from('technicians')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        if (!userData?.company_id) throw new Error("Company ID not found");
        const companyId = userData.company_id;
        
        // Fetch repair metrics
        const [activeRepairs, completedRepairs, pendingRepairs] = await Promise.all([
          supabase
            .from('repairs')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .eq('status', 'in_progress'),
            
          supabase
            .from('repairs')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .eq('status', 'completed'),
            
          supabase
            .from('repairs')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .eq('status', 'pending')
        ]);
        
        // Fetch technician count
        const { count: techCount, error: techError } = await supabase
          .from('technicians')
          .select('id', { count: 'exact', head: true })
          .eq('company_id', companyId)
          .eq('status', 'active');
          
        if (techError) throw techError;
        
        // Fetch recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (activityError) throw activityError;
        
        // Fetch technicians
        const { data: techniciansData, error: techniciansError } = await supabase
          .from('technicians')
          .select(`
            id,
            email,
            status,
            profiles (name, avatar_url)
          `)
          .eq('company_id', companyId)
          .eq('role', 'tech')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (techniciansError) throw techniciansError;
        
        // Format the activity data
        const formattedActivity = activityData ? activityData.map((item: ActivityItem) => {
          // Safely extract metadata
          let metadataObj: Record<string, any> = {};
          
          if (typeof item.metadata === 'string') {
            try {
              metadataObj = JSON.parse(item.metadata);
            } catch {
              metadataObj = {};
            }
          } else if (item.metadata && typeof item.metadata === 'object') {
            metadataObj = item.metadata as Record<string, any>;
          }
          
          return {
            id: item.id,
            title: item.description || `${item.activity_type} activity`,
            timestamp: new Date(item.created_at).toLocaleString(),
            activity_type: item.activity_type,
            metadata: metadataObj
          };
        }) : [];

        // Format technicians data
        const formattedTechnicians = techniciansData ? techniciansData.map((tech) => ({
          id: tech.id,
          name: tech.profiles?.name || 'Unknown',
          email: tech.email,
          status: tech.status,
          avatarUrl: tech.profiles?.avatar_url
        })) : [];
        
        // Update metrics
        setMetrics({
          activeRepairs: activeRepairs.count || 0,
          completedRepairs: completedRepairs.count || 0,
          pendingRepairs: pendingRepairs.count || 0,
          activeTechnicians: techCount || 0,
          upcomingAppointments: 0, // Will need to implement appointments table
          overdueInvoices: 0, // Will need to implement invoices table
          monthlyRevenue: 0, // Will need to implement revenue tracking
          customerCount: 0, // Will need to implement customers table
          inventoryAlerts: 0, // Will need to implement inventory alerts
          isLoading: false
        });
        
        setRecentActivity(formattedActivity);
        setTechnicians(formattedTechnicians);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        toast.error("Error loading dashboard", {
          description: "Could not fetch dashboard data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Revenue data for chart
  const revenueData = [
    { name: 'Jan', value: 2500 },
    { name: 'Feb', value: 3200 },
    { name: 'Mar', value: 2800 },
    { name: 'Apr', value: 5600 },
    { name: 'May', value: 4200 },
    { name: 'Jun', value: 6100 },
  ];

  // Repairs by status data for chart
  const repairData = [
    { name: 'Completed', value: metrics.completedRepairs },
    { name: 'In Progress', value: metrics.activeRepairs },
    { name: 'Pending', value: metrics.pendingRepairs },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your company's performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-center">
                <Wrench className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{metrics.activeRepairs}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{metrics.completedRepairs}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-center">
                <UserCog className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-2xl font-bold">{metrics.activeTechnicians}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-2xl font-bold">{metrics.upcomingAppointments}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <LineChart
                data={revenueData}
                categories={['value']}
                index="name"
                colors={['#3b82f6']}
                valueFormatter={(value: number) => `$${value}`}
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Repairs by Status</CardTitle>
            <CardDescription>Current distribution of repair statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <BarChart
                data={repairData}
                categories={['value']}
                index="name"
                colors={['#10b981']}
                valueFormatter={(value: number) => `${value}`}
                className="h-[300px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity and Technicians */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your company</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between p-3 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        {activity.activity_type === "repair" && <Wrench className="h-4 w-4 text-blue-600" />}
                        {activity.activity_type === "account" && <UserCog className="h-4 w-4 text-blue-600" />}
                        {activity.activity_type === "system" && <Settings className="h-4 w-4 text-blue-600" />}
                        {!["repair", "account", "system"].includes(activity.activity_type) && 
                          <FileText className="h-4 w-4 text-blue-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activity found</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Technicians</CardTitle>
            <CardDescription>Your team members</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : technicians.length > 0 ? (
              <div className="space-y-4">
                {technicians.map((tech) => (
                  <div key={tech.id} className="flex justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {tech.avatarUrl ? (
                        <img 
                          src={tech.avatarUrl} 
                          alt={tech.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {tech.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-gray-500">{tech.email}</p>
                      </div>
                    </div>
                    <Badge variant={tech.status === 'active' ? 'success' : 'secondary'}>
                      {tech.status}
                    </Badge>
                  </div>
                ))}

                <div className="pt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/company/technicians">View All Technicians</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No technicians found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
