
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartPie, 
  Calendar, 
  Clock, 
  ArrowUp, 
  Wrench, 
  CheckCircle, 
  LifeBuoy,
  MessageSquare,
  FileText,
  Settings,
  BarChart3
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [ticketCounts, setTicketCounts] = useState({
    total: 0,
    open: 0,
    resolved: 0
  });
  const [repairCounts, setRepairCounts] = useState({
    total: 0,
    inProgress: 0,
    completed: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTechnicians, setActiveTechnicians] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingUser(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('No user logged in');
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        
        // For now using mock data, later will be replaced with actual API calls
        
        // Mock ticket counts
        setTicketCounts({
          total: 24,
          open: 8,
          resolved: 16
        });
        
        // Mock repair counts
        setRepairCounts({
          total: 45,
          inProgress: 12,
          completed: 33
        });
        
        // Mock active technicians
        setActiveTechnicians(5);
        
        // Mock recent activity
        const mockActivity = [
          {
            id: '1',
            type: 'ticket',
            title: 'Support ticket created',
            description: 'New support ticket #1234: "Facing issue with system startup"',
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            user: {
              name: "John Doe",
              avatar_url: "https://i.pravatar.cc/150?u=john"
            }
          },
          {
            id: '2',
            type: 'repair',
            title: 'Repair completed',
            description: 'Repair #4567 for GE Washer Model XYZ has been completed',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: {
              name: "Jane Smith",
              avatar_url: "https://i.pravatar.cc/150?u=jane"
            }
          },
          {
            id: '3',
            type: 'system',
            title: 'New technician added',
            description: 'New technician "Mike Johnson" has been added to your team',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 24 * 60) {
      return `${Math.round(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{userProfile && `, ${userProfile.name || 'User'}`}. Here's an overview of your company's activity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Support Tickets</span>
              <LifeBuoy className="h-5 w-5 text-blue-500" />
            </CardTitle>
            <CardDescription>Current support requests</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{ticketCounts.total}</div>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500">{ticketCounts.resolved} resolved</span> • <span className="text-amber-500">{ticketCounts.open} open</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/company/support')}>
              View Tickets
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Repair Jobs</span>
              <Wrench className="h-5 w-5 text-blue-500" />
            </CardTitle>
            <CardDescription>Current repair tickets</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{repairCounts.total}</div>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-500">{repairCounts.completed} completed</span> • <span className="text-amber-500">{repairCounts.inProgress} in progress</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/company/diagnostics')}>
              View Repair Jobs
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Active Technicians</span>
              <Users className="h-5 w-5 text-blue-500" />
            </CardTitle>
            <CardDescription>Currently active team members</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <div className="text-3xl font-bold">{activeTechnicians}</div>
            <div className="text-sm text-muted-foreground">Active in the last 24 hours</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/company/technicians')}>
              Manage Technicians
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                <TabsTrigger value="repairs">Repairs</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="mt-1 rounded-full p-2 bg-blue-100">
                      {activity.type === 'ticket' && <LifeBuoy size={18} className="text-blue-600" />}
                      {activity.type === 'repair' && <Wrench size={18} className="text-blue-600" />}
                      {activity.type === 'system' && <Settings size={18} className="text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.user && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            By: {activity.user.name || "Unknown user"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="tickets">
                {/* Content for tickets tab */}
                {recentActivity
                  .filter(activity => activity.type === 'ticket')
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg mb-4">
                      <div className="mt-1 rounded-full p-2 bg-blue-100">
                        <LifeBuoy size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="repairs">
                {/* Content for repairs tab */}
                {recentActivity
                  .filter(activity => activity.type === 'repair')
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg mb-4">
                      <div className="mt-1 rounded-full p-2 bg-blue-100">
                        <Wrench size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="system">
                {/* Content for system tab */}
                {recentActivity
                  .filter(activity => activity.type === 'system')
                  .map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg mb-4">
                      <div className="mt-1 rounded-full p-2 bg-blue-100">
                        <Settings size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Common tasks and resources</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/company/support')}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support Tickets
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/company/technicians')}>
              <Users className="mr-2 h-4 w-4" />
              Manage Technicians
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/company/feature-requests')}>
              <FileText className="mr-2 h-4 w-4" />
              Feature Requests
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/company/community')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Community
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate('/company/subscription')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Users({ className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
