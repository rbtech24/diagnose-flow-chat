import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, CheckCircle, AlertTriangle, Search,
  Timer, Wrench, Percent, PlusCircle, 
  MessageSquare, FileText, Calendar, Settings
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserManagementStore } from "@/store/userManagementStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { supabase } from "@/integrations/supabase/client";

export default function TechnicianDashboard() {
  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Get user data from store
  const { currentUser, fetchUsers } = useUserManagementStore();
  
  // Initialize activity logger
  const { logEvent } = useActivityLogger();
  
  // State for appointments and metrics
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeJobs: 0,
    completedJobs: 0,
    averageResponseTime: "0 hrs",
    firstTimeFixRate: "0%"
  });

  // State for quick links and notifications
  const [quickLinks, setQuickLinks] = useState([
    { title: "Support Tickets", icon: <MessageSquare className="h-4 w-4" />, path: "/tech/support", count: 0 },
    { title: "Feature Requests", icon: <FileText className="h-4 w-4" />, path: "/tech/feature-requests", count: 0 },
    { title: "Community Posts", icon: <MessageSquare className="h-4 w-4" />, path: "/tech/community", count: 0 },
    { title: "Calendar", icon: <Calendar className="h-4 w-4" />, path: "/tech/calendar", count: 0 },
  ]);

  // Form state
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    time: "",
    customer: "",
    address: ""
  });

  // Fetch appointments and metrics data
  useEffect(() => {
    // Fetch users if we don't have a current user
    if (!currentUser) {
      fetchUsers();
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);

      try {
        logEvent('user', 'Dashboard viewed');
        
        // Fetch active repairs (appointments)
        const { data: appointmentsData, error: appointmentsError } = await fetchActiveRepairs(currentUser.id);
        
        if (appointmentsError) {
          console.error('Error loading appointments:', appointmentsError);
          toast.error("Failed to load appointments");
        } else {
          // Transform the data to match our component structure
          const formattedAppointments = appointmentsData?.map(item => ({
            id: item.id,
            time: new Date(item.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrent: item.status === 'in_progress',
            title: item.diagnosis || 'Repair Visit',
            customer: item.customer_id ? (await fetchCustomer(item.customer_id)).data : 'Customer',
            address: item.customer_id ? (await fetchCustomer(item.customer_id)).data?.service_addresses?.[0]?.address || 'No address provided' : 'No address provided'
          })) || [];
          
          setAppointments(formattedAppointments);
        }
        
        // Fetch metrics
        // 1. Active jobs count
        const { count: activeCount, error: activeError } = await supabase
          .from('repairs')
          .select('id', { count: 'exact', head: true })
          .eq('technician_id', currentUser.id)
          .in('status', ['scheduled', 'in_progress']);
          
        // 2. Completed jobs count
        const { count: completedCount, error: completedError } = await supabase
          .from('repairs')
          .select('id', { count: 'exact', head: true })
          .eq('technician_id', currentUser.id)
          .eq('status', 'completed');
        
        // 3. Get technician performance metrics if available
        const { data: perfMetrics, error: perfError } = await supabase
          .from('technician_performance_metrics')
          .select('*')
          .eq('technician_id', currentUser.id)
          .single();
        
        if (activeError || completedError) {
          console.error('Error loading metrics:', activeError || completedError);
        } else {
          // Update metrics state
          setMetrics({
            activeJobs: activeCount || 0,
            completedJobs: completedCount || 0,
            averageResponseTime: perfMetrics?.average_service_time ? 
              `${Math.floor(Number(perfMetrics.average_service_time) / 3600)}hrs` : 
              "N/A",
            firstTimeFixRate: perfMetrics?.efficiency_score ? 
              `${perfMetrics.efficiency_score}%` : 
              "N/A"
          });
        }

        // Fetch quick links counts
        const { count: supportCount } = await supabase
          .from('support_tickets')
          .select('id', { count: 'exact', head: true })
          .eq('technician_id', currentUser.id)
          .eq('status', 'open');

        const { count: featureCount } = await supabase
          .from('feature_requests')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id);

        const { count: communityCount } = await supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', currentUser.id)
          .is('resolved', false);

        // Update quick links
        setQuickLinks(links => links.map(link => {
          if (link.title === "Support Tickets") return {...link, count: supportCount || 0};
          if (link.title === "Feature Requests") return {...link, count: featureCount || 0};
          if (link.title === "Community Posts") return {...link, count: communityCount || 0};
          return link;
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, fetchUsers, logEvent]);

  // Helper function to fetch active repairs
  const fetchActiveRepairs = async (techId: string) => {
    try {
      return await supabase
        .from('repairs')
        .select('id, scheduled_at, status, diagnosis, customer_id')
        .eq('technician_id', techId)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_at', { ascending: true });
    } catch (error) {
      console.error('Error fetching active repairs:', error);
      return { data: null, error };
    }
  };

  // Helper function to fetch customer
  const fetchCustomer = async (customerId: string) => {
    try {
      return await supabase
        .from('customers')
        .select('first_name, last_name, service_addresses')
        .eq('id', customerId)
        .single();
    } catch (error) {
      console.error('Error fetching customer:', error);
      return { data: null, error };
    }
  };

  // Handle adding a new appointment
  const handleAddAppointment = async () => {
    if (!newAppointment.title || !newAppointment.time || !newAppointment.customer) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // First, create or find customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .ilike('last_name', `%${newAppointment.customer.split(' ').pop() || ''}%`)
        .limit(1);
        
      let customerId = customerData?.[0]?.id;
      
      // If customer not found, create one
      if (!customerId) {
        const nameParts = newAppointment.customer.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        const { data: newCustomer, error: newCustomerError } = await supabase
          .from('customers')
          .insert({
            first_name: firstName,
            last_name: lastName,
            company_id: currentUser?.companyId,
            service_addresses: [{ address: newAppointment.address }]
          })
          .select('id')
          .single();
          
        if (newCustomerError) {
          console.error('Error creating customer:', newCustomerError);
          toast.error("Failed to create customer record");
          return;
        }
        
        customerId = newCustomer.id;
      }
      
      // Parse time string to get date and time
      const timeString = newAppointment.time;
      const scheduledDate = new Date();
      const [hours, minutes] = timeString.split(':');
      scheduledDate.setHours(parseInt(hours || '0', 10));
      scheduledDate.setMinutes(parseInt(minutes || '0', 10));
      
      // Create repair/appointment record
      const { data: repair, error: repairError } = await supabase
        .from('repairs')
        .insert({
          technician_id: currentUser?.id,
          customer_id: customerId,
          company_id: currentUser?.companyId,
          scheduled_at: scheduledDate.toISOString(),
          status: 'scheduled',
          diagnosis: newAppointment.title,
          priority: 'medium',
        })
        .select()
        .single();
        
      if (repairError) {
        console.error('Error creating appointment:', repairError);
        toast.error("Failed to create appointment");
        return;
      }
      
      // Add new appointment to state
      const newAppointmentObj = {
        id: repair.id,
        time: new Date(repair.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrent: false,
        title: repair.diagnosis,
        customer: newAppointment.customer,
        address: newAppointment.address || "No address provided"
      };

      setAppointments([...appointments, newAppointmentObj]);
      
      // Clear form
      setNewAppointment({
        title: "",
        time: "",
        customer: "",
        address: ""
      });

      // Log the activity
      logEvent('workflow', 'Appointment added', {
        appointmentTitle: newAppointment.title,
        appointmentTime: newAppointment.time
      });

      toast.success("Appointment added successfully");
    } catch (error) {
      console.error('Error in handleAddAppointment:', error);
      toast.error("Failed to add appointment");
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500">{currentUser?.name || "Technician"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Welcome Back, {currentUser?.name?.split(' ')[0] || "Technician"}</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/tech/diagnostics" className="text-white">
                  Start Diagnosis
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Avg Response Time</p>
                  <p className="text-2xl font-bold">{metrics.averageResponseTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">First-Time Fix Rate</p>
                  <p className="text-2xl font-bold">{metrics.firstTimeFixRate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Links Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:bg-gray-50 transition-colors">
              <Link to={link.path} className="block p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {link.icon}
                    <span className="ml-2 font-medium">{link.title}</span>
                  </div>
                  {link.count > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {link.count}
                    </span>
                  )}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wrench className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{metrics.activeJobs}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{metrics.completedJobs}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{metrics.averageResponseTime}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{metrics.activeJobs}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Appointment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="job-title" className="text-right">Job Title</label>
                    <Input 
                      id="job-title" 
                      placeholder="e.g. Refrigerator Repair" 
                      className="col-span-3"
                      value={newAppointment.title}
                      onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="time" className="text-right">Time</label>
                    <Input 
                      id="time" 
                      placeholder="e.g. 14:30" 
                      className="col-span-3"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="customer" className="text-right">Customer</label>
                    <Input 
                      id="customer" 
                      placeholder="Customer Name" 
                      className="col-span-3"
                      value={newAppointment.customer}
                      onChange={(e) => setNewAppointment({...newAppointment, customer: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="address" className="text-right">Address</label>
                    <Input 
                      id="address" 
                      placeholder="Customer Address" 
                      className="col-span-3"
                      value={newAppointment.address}
                      onChange={(e) => setNewAppointment({...newAppointment, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddAppointment}>Add Appointment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading appointments...</p>
                </div>
              ) : appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className={`p-4 rounded-lg border ${
                      appointment.isCurrent ? "bg-green-50 border-green-200" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Clock className={`h-4 w-4 ${
                            appointment.isCurrent ? "text-green-600" : "text-gray-500"
                          } mr-2`} />
                          <p className={`font-medium ${
                            appointment.isCurrent ? "text-green-800" : ""
                          }`}>
                            {appointment.isCurrent ? "Current - " : ""}{appointment.time}
                          </p>
                        </div>
                        <h3 className="text-lg font-bold mt-1">{appointment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{appointment.customer} • {appointment.address}</p>
                      </div>
                      <Button size="sm" variant={appointment.isCurrent ? "default" : "outline"}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming appointments</p>
                  <Button size="sm" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Resources Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Support Resources</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/tech/support" className="text-blue-600 hover:underline flex items-center">
                    <MessageSquare className="h-3 w-3 mr-2" /> Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/tech/community" className="text-blue-600 hover:underline flex items-center">
                    <MessageSquare className="h-3 w-3 mr-2" /> Community Forums
                  </Link>
                </li>
                <li>
                  <Link to="/help-center" className="text-blue-600 hover:underline flex items-center">
                    <FileText className="h-3 w-3 mr-2" /> Knowledge Base
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Training Materials</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/tech/training" className="text-blue-600 hover:underline flex items-center">
                    <FileText className="h-3 w-3 mr-2" /> Repair Guides
                  </Link>
                </li>
                <li>
                  <Link to="/tech/videos" className="text-blue-600 hover:underline flex items-center">
                    <FileText className="h-3 w-3 mr-2" /> Training Videos
                  </Link>
                </li>
                <li>
                  <Link to="/tech/certifications" className="text-blue-600 hover:underline flex items-center">
                    <FileText className="h-3 w-3 mr-2" /> Certification Programs
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/tech/profile" className="text-blue-600 hover:underline flex items-center">
                    <Settings className="h-3 w-3 mr-2" /> Profile Settings
                  </Link>
                </li>
                <li>
                  <Link to="/tech/notifications" className="text-blue-600 hover:underline flex items-center">
                    <Settings className="h-3 w-3 mr-2" /> Notification Preferences
                  </Link>
                </li>
                <li>
                  <Link to="/tech/support" className="text-blue-600 hover:underline flex items-center">
                    <MessageSquare className="h-3 w-3 mr-2" /> Request Help
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
