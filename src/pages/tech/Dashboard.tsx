
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, CheckCircle, AlertTriangle, Search,
  Timer, Wrench, Percent, MessagesSquare, 
  ArrowUp, PlusCircle, Database, Tag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserMessages, useSystemMessages } from "@/context/SystemMessageContext";
import { SystemMessage } from "@/components/system/SystemMessage";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  time: string;
  isCurrent: boolean;
  title: string;
  customer: string;
  address: string;
  modelName: string;
  modelNumber: string;
  symptom: string;
}

interface DashboardMetrics {
  activeJobs: number;
  completedJobs: number;
  responseTime: string;
  openIssues: number;
  avgResponseTime: string;
  firstTimeFixRate: number;
}

export default function TechnicianDashboard() {
  // Get system messages for the tech user
  const userMessages = useUserMessages("tech");
  const { removeMessage } = useSystemMessages();
  const { role, isLoading: roleLoading } = useUserRole();
  
  // State for data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    time: "",
    customer: "",
    address: "",
    modelName: "",
    modelNumber: "",
    symptom: ""
  });

  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real application, we would fetch from the database
        // Example:
        // const { data: appointmentsData, error: appointmentsError } = await supabase
        //   .from('appointments')
        //   .select('*')
        //   .eq('technician_id', currentUserId)
        //   .order('time', { ascending: true });
        
        // if (appointmentsError) throw appointmentsError;
        // setAppointments(appointmentsData);
        
        // For now, just set empty arrays and mock metrics
        setAppointments([]);
        setMetrics({
          activeJobs: 0,
          completedJobs: 0,
          responseTime: "0 hrs",
          openIssues: 0,
          avgResponseTime: "0 hrs",
          firstTimeFixRate: 0
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Check if user is authorized to access this page
  if (!roleLoading && role !== 'tech' && role !== 'admin' && role !== 'company_admin') {
    return <Navigate to="/login" />;
  }

  // Handle adding a new appointment
  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.time || !newAppointment.customer) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appointment = {
      id: Date.now().toString(),
      time: newAppointment.time,
      isCurrent: false,
      title: newAppointment.title,
      customer: newAppointment.customer,
      address: newAppointment.address || "No address provided",
      modelName: newAppointment.modelName || "Not specified",
      modelNumber: newAppointment.modelNumber || "Not specified",
      symptom: newAppointment.symptom || "Not specified"
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      title: "",
      time: "",
      customer: "",
      address: "",
      modelName: "",
      modelNumber: "",
      symptom: ""
    });

    toast.success("Appointment added successfully");
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500">Welcome • {formattedDate}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/diagnostics">Start Diagnosis</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Avg Response Time</p>
                  <p className="text-2xl font-bold">{metrics?.avgResponseTime || "0 hrs"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">First-Time Fix Rate</p>
                  <p className="text-2xl font-bold">{metrics?.firstTimeFixRate || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Wrench className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{metrics?.activeJobs || 0}</span>
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
              <span className="text-2xl font-bold">{metrics?.completedJobs || 0}</span>
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
              <span className="text-2xl font-bold">{metrics?.responseTime || "0 hrs"}</span>
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
              <span className="text-2xl font-bold">{metrics?.openIssues || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add CRM Integration "Coming Soon" Section */}
      <Card className="mb-8 border-2 border-dashed border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            CRM Integration
          </CardTitle>
          <CardDescription>Connect with services like HouseCallPro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="bg-blue-100 text-blue-700 inline-block p-2 rounded-lg text-xs font-semibold mb-3">COMING SOON</div>
            <p className="text-sm text-gray-600 mb-2">Seamlessly integrate with your favorite CRM platforms</p>
            <p className="text-xs text-gray-500">We're working hard to bring this feature to you. Check back soon!</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Display system messages from context instead of hardcoding */}
      <div className="mb-8">
        {userMessages.map(msg => (
          <SystemMessage
            key={msg.id}
            id={msg.id}
            type={msg.type}
            title={msg.title}
            message={msg.message}
            dismissible={msg.dismissible}
            onDismiss={() => removeMessage(msg.id)}
          />
        ))}
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
              <DialogContent className="max-w-md">
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
                      placeholder="e.g. 2:30 PM" 
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
                  
                  {/* New Model and Symptom fields */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="model-name" className="text-right">Model Name</label>
                    <Input 
                      id="model-name" 
                      placeholder="e.g. WhirlFrost XL" 
                      className="col-span-3"
                      value={newAppointment.modelName}
                      onChange={(e) => setNewAppointment({...newAppointment, modelName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="model-number" className="text-right">Model Number</label>
                    <Input 
                      id="model-number" 
                      placeholder="e.g. WF-2023-XL" 
                      className="col-span-3"
                      value={newAppointment.modelNumber}
                      onChange={(e) => setNewAppointment({...newAppointment, modelNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="symptom" className="text-right">Symptom</label>
                    <Input 
                      id="symptom" 
                      placeholder="e.g. Not cooling properly" 
                      className="col-span-3"
                      value={newAppointment.symptom}
                      onChange={(e) => setNewAppointment({...newAppointment, symptom: e.target.value})}
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
              {appointments.length > 0 ? (
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
                        
                        {/* Display model and symptom details */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            <Tag className="h-3 w-3 mr-1" />
                            {appointment.modelName}
                          </span>
                          <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                            <Tag className="h-3 w-3 mr-1" />
                            {appointment.modelNumber}
                          </span>
                          <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {appointment.symptom}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant={appointment.isCurrent ? "default" : "outline"}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any upcoming appointments.</p>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Appointment
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
