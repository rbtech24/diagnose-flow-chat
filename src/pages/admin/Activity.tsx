
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Building2, Users, Wrench, FileText, MessageSquare, AlertTriangle } from "lucide-react";

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  
  // Mock activity data - in a real app, this would come from an API
  const activityData = [
    {
      id: 1,
      type: 'company',
      icon: <Building2 className="h-4 w-4 text-blue-600" />,
      title: 'New Company Registered',
      description: 'ABC Appliance Repair registered a new account',
      timestamp: '2025-05-08T09:30:00Z',
      severity: 'info'
    },
    {
      id: 2,
      type: 'user',
      icon: <Users className="h-4 w-4 text-green-600" />,
      title: 'New User Added',
      description: 'John Smith joined as a technician',
      timestamp: '2025-05-08T10:15:00Z',
      severity: 'info'
    },
    {
      id: 3,
      type: 'workflow',
      icon: <Wrench className="h-4 w-4 text-purple-600" />,
      title: 'New Workflow Created',
      description: 'Refrigerator diagnosis workflow was created',
      timestamp: '2025-05-07T14:22:00Z',
      severity: 'info'
    },
    {
      id: 4,
      type: 'support',
      icon: <MessageSquare className="h-4 w-4 text-amber-600" />,
      title: 'New Support Ticket',
      description: 'Support ticket #1234 opened by Sarah Johnson',
      timestamp: '2025-05-07T11:05:00Z',
      severity: 'warning'
    },
    {
      id: 5,
      type: 'system',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      title: 'System Alert',
      description: 'Database backup failed - manual intervention required',
      timestamp: '2025-05-06T23:14:00Z',
      severity: 'error'
    },
    {
      id: 6,
      type: 'billing',
      icon: <FileText className="h-4 w-4 text-indigo-600" />,
      title: 'Payment Processed',
      description: 'Monthly subscription payment from XYZ Repair',
      timestamp: '2025-05-06T08:45:00Z',
      severity: 'info'
    }
  ];

  // Filter activity based on search query
  const filteredActivity = activityData.filter(activity => {
    return activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           activity.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
          <Select defaultValue="all" onValueChange={setSelectedTimeframe}>
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
              {filteredActivity.length > 0 ? (
                <div className="space-y-4">
                  {filteredActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`mt-1 rounded-full p-2 ${activity.severity === 'error' ? 'bg-red-100' : activity.severity === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="mt-2">
                          <Badge variant="secondary" className={getSeverityClass(activity.severity)}>
                            {activity.type}
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
                System activity filtering coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                User activity filtering coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="companies">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Company activity filtering coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500 py-8">
                Billing activity filtering coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
