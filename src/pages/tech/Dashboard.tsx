
import { useState } from "react";
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

export default function TechnicianDashboard() {
  // Get system messages for the tech user
  const userMessages = useUserMessages("tech");
  const { removeMessage } = useSystemMessages();
  
  // Get current date
  const today = new Date();
  const dateOptions = { 
    weekday: 'long' as const, 
    year: 'numeric' as const, 
    month: 'long' as const, 
    day: 'numeric' as const 
  };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
  // State for upcoming appointments
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      time: "10:00 AM",
      isCurrent: true,
      title: "Refrigerator Not Cooling",
      customer: "Sarah Johnson",
      address: "123 Main St",
      modelName: "WhirlFrost XL",
      modelNumber: "WF-2023-XL",
      symptom: "Not cooling properly"
    },
    {
      id: "2",
      time: "1:30 PM",
      isCurrent: false,
      title: "Dryer Not Heating",
      customer: "Mike Williams",
      address: "456 Oak Dr",
      modelName: "DryMaster Pro",
      modelNumber: "DMP-500",
      symptom: "No heat"
    }
  ]);

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
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500">John Doe • ABC Appliance Repair</p>
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
                <CardTitle>Welcome Back, John</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Diagnosis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Avg Response Time</p>
                  <p className="text-2xl font-bold">1.8 hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">First-Time Fix Rate</p>
                  <p className="text-2xl font-bold">94%</p>
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
              <span className="text-2xl font-bold">8</span>
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
              <span className="text-2xl font-bold">24</span>
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
              <span className="text-2xl font-bold">1.2 hrs</span>
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
              <span className="text-2xl font-bold">3</span>
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
              {appointments.map(appointment => (
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
              ))}

              {appointments.length === 0 && (
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
    </div>
  );
}
