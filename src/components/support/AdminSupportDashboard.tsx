
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { useSupportTeam } from '@/hooks/useSupportTeam';
import { useSLATracking } from '@/hooks/useSLATracking';
import { useSupportMetrics } from '@/hooks/useSupportMetrics';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  UserPlus,
  Settings,
  BarChart3
} from 'lucide-react';
import { SupportTeamManagement } from './SupportTeamManagement';
import { SLAManagement } from './SLAManagement';
import { SupportMetricsDashboard } from './SupportMetricsDashboard';
import { TicketAssignmentPanel } from './TicketAssignmentPanel';

export function AdminSupportDashboard() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const { tickets, isLoading: ticketsLoading } = useSupportTickets(undefined, selectedCompanyId);
  const { teamMembers, assignments } = useSupportTeam(selectedCompanyId);
  const { slaPolices } = useSLATracking(selectedCompanyId);
  const { summary, isLoading: metricsLoading } = useSupportMetrics(selectedCompanyId);

  // Get company ID from current user context
  useEffect(() => {
    // This would typically come from your auth context
    // For now, using the default company ID
    setSelectedCompanyId('11111111-1111-1111-1111-111111111111');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const activeAgents = teamMembers.filter(m => m.is_active).length;
  const avgResponseTime = summary?.avgResponseTime || 0;

  if (ticketsLoading || metricsLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading support dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support Management</h1>
          <p className="text-muted-foreground">Manage tickets, team, and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressTickets} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Support team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgResponseTime)}m</div>
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
            <div className="text-2xl font-bold">{Math.round(summary?.slaCompliance || 0)}%</div>
            <p className="text-xs text-muted-foreground">
              Meeting SLA targets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="sla">SLA Policies</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.slice(0, 10).map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{ticket.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                          {ticket.assignedTo && (
                            <p className="text-xs font-medium">
                              Assigned
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <TicketAssignmentPanel 
                companyId={selectedCompanyId}
                teamMembers={teamMembers}
                assignments={assignments}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <SupportTeamManagement companyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="sla">
          <SLAManagement companyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="metrics">
          <SupportMetricsDashboard companyId={selectedCompanyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
