
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Building2, Users, Wrench, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchActivityLogs, ActivityLog, ActivityTimeframe } from "@/api/activityLogsApi";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<ActivityTimeframe>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch activity logs from database
  useEffect(() => {
    const loadActivityLogs = async () => {
      try {
        setLoading(true);
        const logs = await fetchActivityLogs(selectedTimeframe, selectedType, searchQuery);
        setActivityLogs(logs);
      } catch (error) {
        console.error('Error loading activity logs:', error);
        toast({
          title: 'Error loading activity logs',
          description: 'There was a problem fetching the activity logs.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadActivityLogs();
  }, [selectedTimeframe, selectedType, searchQuery, toast]);
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'user':
      case 'login':
      case 'logout':
      case 'password_reset':
      case 'account_update':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'workflow':
        return <Wrench className="h-4 w-4 text-purple-600" />;
      case 'support':
        return <MessageSquare className="h-4 w-4 text-amber-600" />;
      case 'system':
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'billing':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getSeverityForType = (type: string): 'info' | 'warning' | 'error' => {
    switch (type) {
      case 'system_error':
      case 'error':
        return 'error';
      case 'warning':
      case 'security':
        return 'warning';
      default:
        return 'info';
    }
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
          <Select defaultValue="all" onValueChange={(value) => setSelectedTimeframe(value as ActivityTimeframe)}>
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
          
          <Select defaultValue="all" onValueChange={setSelectedType}>
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent activity across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading activity logs...</p>
                </div>
              ) : activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.map(activity => (
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
                          {activity.user?.name || 'System'} {activity.activity_type === 'system' ? '' : `- ${activity.activity_type}`}
                        </p>
                        <div className="mt-2">
                          <Badge variant="secondary" className={getSeverityClass(getSeverityForType(activity.activity_type))}>
                            {activity.activity_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No activity found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Filter to see only system activity logs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Filter to see only user activity logs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Filter to see only company activity logs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Filter to see only billing activity logs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
