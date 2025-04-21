
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Calendar, Tag, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";



interface Appointment {
  id: string;
  title: string;
  time: string;
  date: string;
  customer: string;
  address: string;
  modelName: string;
  modelNumber: string;
  symptom: string;
  technicianId: string;
  status: 'pending' | 'assigned' | 'completed' | 'canceled';
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Refrigerator Not Cooling",
      time: "10:00 AM",
      date: "2024-04-15",
      customer: "Sarah Johnson",
      address: "123 Main St",
      modelName: "WhirlFrost XL",
      modelNumber: "WF-2023-XL",
      symptom: "Not cooling properly",
      technicianId: "1",
      status: 'assigned'
    },
    {
      id: "2",
      title: "Dryer Not Heating",
      time: "1:30 PM",
      date: "2024-04-16",
      customer: "Mike Williams",
      address: "456 Oak Dr",
      modelName: "DryMaster Pro",
      modelNumber: "DMP-500",
      symptom: "No heat",
      technicianId: "2",
      status: 'pending'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id' | 'status'>>({
    title: "",
    time: "",
    date: "",
    customer: "",
    address: "",
    modelName: "",
    modelNumber: "",
    symptom: "",
    technicianId: ""
  });

  const [filterTechnicianId, setFilterTechnicianId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesTechnician = filterTechnicianId === "all" || appointment.technicianId === filterTechnicianId;
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.symptom.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTechnician && matchesStatus && matchesSearch;
  });

  const handleAddAppointment = () => {
    // Validate required fields
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time || 
        !newAppointment.customer || !newAppointment.technicianId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'pending'
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      title: "",
      time: "",
      date: "",
      customer: "",
      address: "",
      modelName: "",
      modelNumber: "",
      symptom: "",
      technicianId: ""
    });

    toast.success("Appointment created and assigned to technician");
  };

  const getTechnicianName = (id: string) => {
    const technician = mockTechnicians.find(tech => tech.id === id);
    return technician ? technician.name : "Unknown";
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: newStatus }
        : appointment
    ));
    
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          <p className="text-muted-foreground">Assign and manage technician appointments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4">
                <label htmlFor="job-title" className="text-sm font-medium">Job Title</label>
                <Input 
                  id="job-title" 
                  placeholder="e.g. Refrigerator Repair" 
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="text-sm font-medium">Date</label>
                  <Input 
                    id="date" 
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="text-sm font-medium">Time</label>
                  <Input 
                    id="time" 
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid items-center gap-4">
                <label htmlFor="customer" className="text-sm font-medium">Customer Name</label>
                <Input 
                  id="customer" 
                  placeholder="Customer Name" 
                  value={newAppointment.customer}
                  onChange={(e) => setNewAppointment({...newAppointment, customer: e.target.value})}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input 
                  id="address" 
                  placeholder="Customer Address" 
                  value={newAppointment.address}
                  onChange={(e) => setNewAppointment({...newAppointment, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="model-name" className="text-sm font-medium">Model Name</label>
                  <Input 
                    id="model-name" 
                    placeholder="e.g. WhirlFrost XL" 
                    value={newAppointment.modelName}
                    onChange={(e) => setNewAppointment({...newAppointment, modelName: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="model-number" className="text-sm font-medium">Model Number</label>
                  <Input 
                    id="model-number" 
                    placeholder="e.g. WF-2023-XL" 
                    value={newAppointment.modelNumber}
                    onChange={(e) => setNewAppointment({...newAppointment, modelNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid items-center gap-4">
                <label htmlFor="symptom" className="text-sm font-medium">Symptom</label>
                <Input 
                  id="symptom" 
                  placeholder="e.g. Not cooling properly" 
                  value={newAppointment.symptom}
                  onChange={(e) => setNewAppointment({...newAppointment, symptom: e.target.value})}
                />
              </div>
              
              <div className="grid items-center gap-4">
                <label htmlFor="technician" className="text-sm font-medium">Assign Technician</label>
                <Select 
                  value={newAppointment.technicianId} 
                  onValueChange={(value) => setNewAppointment({...newAppointment, technicianId: value})}
                >
                  <SelectTrigger id="technician">
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTechnicians.map(tech => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name} - {tech.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddAppointment}>Create Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search appointments..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterTechnicianId} onValueChange={setFilterTechnicianId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technicians</SelectItem>
            {mockTechnicians.map(tech => (
              <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Appointments</CardTitle>
          <CardDescription>Manage and track technician appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{appointment.date} at {appointment.time}</span>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <h3 className="text-lg font-bold">{appointment.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {appointment.customer} • {appointment.address}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
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
                      
                      <div className="text-sm text-muted-foreground">
                        <strong>Technician:</strong> {getTechnicianName(appointment.technicianId)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Select 
                        value={appointment.status}
                        onValueChange={(value) => handleStatusChange(
                          appointment.id, 
                          value as Appointment['status']
                        )}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No appointments match your filters</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => {
                  setFilterTechnicianId("all");
                  setFilterStatus("all");
                  setSearchTerm("");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
