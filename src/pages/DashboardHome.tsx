import React from 'react';
import { Building2, Users, DollarSign, TrendingUp, Activity, Database, Bell, 
  HelpCircle, Lightbulb, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { supabase } from '@/integrations/supabase/client';
import { FormError } from '@/components/FormError';
import { useTickets } from '@/hooks/useTickets';
import { useFeatureRequests } from '@/hooks/useFeatureRequests';

function DashboardHomeContent({ stats, tickets, featureRequests }: any) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">System Overview</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the entire platform</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Companies</p>
              <p className="text-2xl font-bold text-[#0A2342]">{stats.totalCompanies}</p>
              <p className={`text-sm mt-1 ${stats.companyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.companyGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.companyGrowth).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="bg-[#0066CC]/10 p-3 rounded-lg">
              <Building2 className="w-6 h-6 text-[#0066CC]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Technicians</p>
              <p className="text-2xl font-bold text-[#0A2342]">{stats.activeTechnicians}</p>
              <p className={`text-sm mt-1 ${stats.technicianGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.technicianGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.technicianGrowth).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="bg-[#0066CC]/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-[#0066CC]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Platform Revenue</p>
              <p className="text-2xl font-bold text-[#0A2342]">
                ${stats.platformRevenue.toLocaleString()}
              </p>
              <p className={`text-sm mt-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="bg-[#0066CC]/10 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#0066CC]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Health</p>
              <p className="text-2xl font-bold text-[#0A2342]">{stats.systemHealth}%</p>
            </div>
            <div className="bg-[#0066CC]/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#0066CC]" />
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-[#0066CC]" />
              <h2 className="text-xl font-bold text-[#0A2342]">System Health</h2>
            </div>
            <button className="text-[#0066CC] hover:text-[#0052a3] text-sm">View Details</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">API Response Time</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">150ms</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Error Rate</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">0.01%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Database Load</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">45%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Cache Hit Rate</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">98.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-[#0066CC]" />
              <h2 className="text-xl font-bold text-[#0A2342]">System Usage</h2>
            </div>
            <button className="text-[#0066CC] hover:text-[#0052a3] text-sm">View Details</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">{stats.activeUsers}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Total Jobs</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">{stats.totalJobs}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">{stats.avgResponseTime}s</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Storage Used</h3>
              <p className="text-2xl font-bold text-[#0A2342] mt-1">45%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Support Tickets */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#0066CC]" />
              <h2 className="text-xl font-bold text-[#0A2342]">Recent Support Tickets</h2>
            </div>
            <a 
              href="/admin/support"
              className="text-[#0066CC] hover:text-[#0052a3] flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {tickets.slice(0, 3).map((ticket: any) => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-[#0A2342]">{ticket.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-center text-gray-500 py-4">No recent support tickets</p>
            )}
          </div>
        </div>

        {/* Feature Requests */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-[#0066CC]" />
              <h2 className="text-xl font-bold text-[#0A2342]">Feature Requests</h2>
            </div>
            <a 
              href="/admin/features"
              className="text-[#0066CC] hover:text-[#0052a3] flex items-center"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {featureRequests.slice(0, 3).map((request: any) => (
              <div key={request.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-[#0A2342]">{request.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{request.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            {featureRequests.length === 0 && (
              <p className="text-center text-gray-500 py-4">No feature requests</p>
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#0066CC]" />
              <h2 className="text-xl font-bold text-[#0A2342]">System Alerts</h2>
            </div>
            <button className="text-[#0066CC] hover:text-[#0052a3] text-sm">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">High API Usage</h3>
                <p className="text-sm text-yellow-600 mt-1">
                  API usage is approaching the limit for Company XYZ
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Backup Completed</h3>
                <p className="text-sm text-green-600 mt-1">
                  Daily system backup completed successfully
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = React.useState({
    totalCompanies: 0,
    activeTechnicians: 0,
    platformRevenue: 0,
    systemHealth: 100,
    companyGrowth: 0,
    technicianGrowth: 0,
    revenueGrowth: 0,
    activeUsers: 0,
    totalJobs: 0,
    avgResponseTime: 0
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { tickets = [] } = useTickets();
  const { requests: featureRequests = [] } = useFeatureRequests();

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: companies } = await supabase
        .from('companies')
        .select('id, created_at');
      
      const { data: technicians } = await supabase
        .from('technicians')
        .select('id, created_at')
        .eq('status', 'active');

      const { data: repairs } = await supabase
        .from('repairs')
        .select('actual_cost, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate growth rates
      const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const prevMonth = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      const currentCompanies = companies?.filter(c => new Date(c.created_at) >= lastMonth).length || 0;
      const prevCompanies = companies?.filter(c => 
        new Date(c.created_at) >= prevMonth && new Date(c.created_at) < lastMonth
      ).length || 0;

      const currentTechs = technicians?.filter(t => new Date(t.created_at) >= lastMonth).length || 0;
      const prevTechs = technicians?.filter(t => 
        new Date(t.created_at) >= prevMonth && new Date(t.created_at) < lastMonth
      ).length || 0;

      const currentRevenue = repairs?.reduce((sum, repair) => sum + (repair.actual_cost || 0), 0) || 0;
      const prevRevenue = repairs?.filter(r => 
        new Date(r.created_at) >= prevMonth && new Date(r.created_at) < lastMonth
      ).reduce((sum, repair) => sum + (repair.actual_cost || 0), 0) || 0;

      setStats({
        totalCompanies: companies?.length || 0,
        activeTechnicians: technicians?.length || 0,
        platformRevenue: currentRevenue,
        systemHealth: 99.9,
        companyGrowth: prevCompanies ? ((currentCompanies - prevCompanies) / prevCompanies) * 100 : 0,
        technicianGrowth: prevTechs ? ((currentTechs - prevTechs) / prevTechs) * 100 : 0,
        revenueGrowth: prevRevenue ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0,
        activeUsers: technicians?.length || 0,
        totalJobs: repairs?.length || 0,
        avgResponseTime: 1.8
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingScreen size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <FormError message={error} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <DashboardHomeContent stats={stats} tickets={tickets} featureRequests={featureRequests} />
    </div>
  );
}
