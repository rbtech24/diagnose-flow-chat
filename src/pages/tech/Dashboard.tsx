
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, CheckCircle, AlertTriangle, Search,
  Timer, Wrench, Percent, MessagesSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TechnicianDashboard() {
  // Get current date
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);
  
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
          <Button size="icon" variant="ghost" className="rounded-full">
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <img className="aspect-square h-full w-full" src="https://i.pravatar.cc/300" alt="Profile" />
            </span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
        <Card className="md:col-span-3">
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-2">
                <MessagesSquare className="h-6 w-6" />
              </div>
              <p className="text-sm text-center">Ask me anything about your diagnostics</p>
              <Button variant="outline" size="sm" className="mt-4">Open Assistant</Button>
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
      
      <div className="mb-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900">System Alert</h3>
                <p className="text-sm text-red-700">
                  Scheduled maintenance tonight from 2AM - 4AM. Some diagnostic workflows may be unavailable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <p className="font-medium text-green-800">Current - 10:00 AM</p>
                    </div>
                    <h3 className="text-lg font-bold mt-1">Refrigerator Not Cooling</h3>
                    <p className="text-sm text-gray-600 mt-1">Sarah Johnson • 123 Main St</p>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="font-medium">1:30 PM</p>
                    </div>
                    <h3 className="text-lg font-bold mt-1">Dryer Not Heating</h3>
                    <p className="text-sm text-gray-600 mt-1">Mike Williams • 456 Oak Dr</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-8 right-8">
        <Button size="lg" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
          <MessagesSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
