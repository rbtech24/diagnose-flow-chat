
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupportMetrics } from '@/hooks/useSupportMetrics';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface SupportMetricsDashboardProps {
  companyId: string;
}

export function SupportMetricsDashboard({ companyId }: SupportMetricsDashboardProps) {
  const [dateRange, setDateRange] = useState('30');
  const { summary, metrics, isLoading } = useSupportMetrics(
    companyId,
    dateRange ? {
      start: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    } : undefined
  );

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Metrics</h2>
          <p className="text-muted-foreground">Track support team performance and customer satisfaction</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTickets || 0}</div>
            <p className="text-xs text-muted-foreground">
              Handled in selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(summary?.avgResponseTime || 0, { good: 60, warning: 240 })}`}>
              {formatTime(summary?.avgResponseTime || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              First response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(summary?.slaCompliance || 0, { good: 90, warning: 80 })}`}>
              {Math.round(summary?.slaCompliance || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Meeting SLA targets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(summary?.customerSatisfaction || 0, { good: 4, warning: 3 })}`}>
              {(summary?.customerSatisfaction || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0 rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.ticketsByStatus && Object.entries(summary.ticketsByStatus).map(([status, count]) => {
                const percentage = ((count / summary.totalTickets) * 100).toFixed(1);
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{status.replace('_', ' ')}</Badge>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.ticketsByPriority && Object.entries(summary.ticketsByPriority).map(([priority, count]) => {
                const percentage = ((count / summary.totalTickets) * 100).toFixed(1);
                const priorityColor = {
                  low: 'bg-gray-100 text-gray-800',
                  medium: 'bg-blue-100 text-blue-800',
                  high: 'bg-orange-100 text-orange-800',
                  urgent: 'bg-red-100 text-red-800',
                }[priority] || 'bg-gray-100 text-gray-800';
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColor}>{priority}</Badge>
                      <span className="text-sm text-muted-foreground">{percentage}%</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary?.agentPerformance && summary.agentPerformance.length > 0 ? (
              summary.agentPerformance.map((agent) => (
                <div key={agent.agent_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{agent.agent_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {agent.tickets_handled} tickets handled
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{formatTime(agent.avg_response_time)}</p>
                        <p className="text-xs text-muted-foreground">Avg Response</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {agent.satisfaction_rating.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No agent performance data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
