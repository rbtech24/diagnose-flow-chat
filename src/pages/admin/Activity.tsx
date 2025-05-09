
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users, Wrench, FileText, MessageSquare, AlertTriangle, Clock } from "lucide-react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { ActivityTimeframe } from "@/api/activityLogsApi";
import { toast } from "sonner";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<ActivityTimeframe>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    logs: activityLogs, 
    isLoading: loading, 
    error, 
    loadLogs 
  } = useActivityLogs();
  
  // Filter logs based on the selected tab
  const filteredLogs = activityLogs.filter(log => {
    if (activeTab === 'all') return true;
    if (activeTab === 'system') return log.activity_type.includes('system');
    if (activeTab === 'users') return log.activity_type.includes('user');
    if (activeTab === 'companies') return log.activity_type.includes('company');
    if (activeTab === 'billing') return log.activity_type.includes('billing');
    return true;
  });

  // Fetch activity logs from database
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        await loadLogs(selectedTimeframe, selectedType, searchQuery);
      } catch (error) {
        toast.error('Failed to load activity logs');
      }
    };
    
    fetchLogs();
  }, [selectedTimeframe, selectedType, searchQuery, loadLogs]);
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'company':
      case 'company_created':
      case 'company_updated':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'user':
      case 'login':
      case 'logout':
      case 'user_created':
      case 'user_updated':
      case 'password_reset':
      case 'account_update':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'workflow':
      case 'workflow_created':
      case 'workflow_updated':
        return <Wrench className="h-4 w-4 text-purple-600" />;
      case 'support':
      case 'support_ticket':
        return <MessageSquare className="h-4 w-4 text-amber-600" />;
      case 'system':
      case 'error':
      case 'system_error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'billing':
      case 'payment':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case 'session':
      case 'activity':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getSeverityForType = (type: string): 'info' | 'warning' | 'error' => {
    if (type.includes('error')) return 'error';
    if (type.includes('warning') || type.includes('security')) return 'warning';
    return 'info';
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'info': 
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'warning': 
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'error': 
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">System Activity</h1>
          <p className="text-muted-foreground">View and manage system-wide activity logs</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-9" 
            placeholder="Search activity..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as ActivityTimeframe)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                {activeTab === 'all' ? 'Recent activity across the platform' : 
                 `Recent ${activeTab} activity`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading activity logs...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <p>Error loading activity logs. Please try again.</p>
                  </div>
                </div>
              ) : filteredLogs.length > 0 ? (
                <div className="space-y-4">
                  {filteredLogs.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`mt-1 rounded-full p-2 ${
                        getSeverityForType(activity.activity_type) === 'error' 
                          ? 'bg-red-100' 
                          : getSeverityForType(activity.activity_type) === 'warning' 
                            ? 'bg-amber-100' 
                            : 'bg-blue-100'
                      }`}>
                        {getIconForType(activity.activity_type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="font-medium">{activity.description}</h4>
                          <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.user?.name || activity.user?.email || 'System'} 
                          {activity.activity_type === 'system' ? '' : ` - ${activity.activity_type}`}
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className={getSeverityClass(getSeverityForType(activity.activity_type))}>
                            {activity.activity_type}
                          </Badge>
                          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <Badge variant="outline" className="ml-2 bg-gray-50">
                              Details
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No activity found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
