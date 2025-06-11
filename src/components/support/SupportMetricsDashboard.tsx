
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupportMetrics } from '@/hooks/useSupportMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';

interface SupportMetricsDashboardProps {
  companyId: string;
}

export function SupportMetricsDashboard({ companyId }: SupportMetricsDashboardProps) {
  const { summary, trends, isLoading } = useSupportMetrics(companyId);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">Loading metrics...</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: 'Open', value: summary?.ticketsByStatus?.open || 0 },
    { name: 'In Progress', value: summary?.ticketsByStatus?.in_progress || 0 },
    { name: 'Resolved', value: summary?.ticketsByStatus?.resolved || 0 },
    { name: 'Closed', value: summary?.ticketsByStatus?.closed || 0 },
  ];

  const trendData = trends?.map(trend => ({
    date: new Date(trend.date).toLocaleDateString(),
    tickets: trend.tickets_created,
    resolved: trend.tickets_resolved,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary?.avgResponseTime || 0)}m</div>
            <p className="text-xs text-muted-foreground">
              Target: &lt; 60m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary?.resolutionRate || 0)}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(summary?.customerSatisfaction || 0).toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary?.slaCompliance || 0)}%</div>
            <p className="text-xs text-muted-foreground">
              Meeting targets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" stroke="#8884d8" name="Created" />
                <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary?.topAgents?.map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.tickets_resolved} tickets resolved</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{agent.avg_rating?.toFixed(1)}/5</p>
                  <p className="text-xs text-muted-foreground">Avg rating</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground">No agent data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
