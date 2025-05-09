import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { useUserManagementStore } from "@/store/userManagementStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Building2, 
  CreditCard, 
  Activity, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { useActivityLogger } from "@/hooks/useActivityLogger";

export default function AdminDashboard() {
  // Access loading states safely with defaults
  const {
    users,
    companies,
    fetchUsers,
    fetchCompanies,
    isLoadingUsers = false,
    isLoadingCompanies = false
  } = useUserManagementStore();
  
  const { licenses } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState("overview");
  const { logEvent } = useActivityLogger();

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchUsers(), fetchCompanies()]);
      logEvent('system', 'Dashboard viewed', { timestamp: new Date().toISOString() });
    };
    
    loadData();
  }, [fetchUsers, fetchCompanies, logEvent]);

  // Calculate statistics
  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  
  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const trialLicenses = licenses.filter(l => l.status === 'trial').length;
  const expiredLicenses = licenses.filter(l => l.status === 'expired').length;

  // Calculate revenue (simplified mock)
  const totalRevenue = licenses
    .filter(l => l.status === 'active')
    .reduce((sum, license) => {
      // Find the corresponding plan
      const plan = { monthlyPrice: 49.99 }; // Mock plan price
      return sum + plan.monthlyPrice;
    }, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{totalUsers}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  Across all companies
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Companies
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoadingCompanies ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{totalCompanies}</div>
                )}
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center mr-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    {activeCompanies} active
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-blue-500 mr-1" />
                    {trialCompanies} in trial
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Licenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLicenses}</div>
                <div className="flex flex-wrap text-xs text-muted-foreground">
                  <div className="flex items-center mr-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
                    {activeLicenses} active
                  </div>
                  <div className="flex items-center mr-2">
                    <Clock className="h-3 w-3 text-blue-500 mr-1" />
                    {trialLicenses} trial
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                    {expiredLicenses} expired
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From active subscriptions
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <p>Reports content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <p>Notifications content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
