
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, CheckCircle, MapPin, Wrench, 
  Calendar, FileText, Workflow, Settings 
} from "lucide-react";

export default function TechnicianDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-500">John Doe • ABC Appliance Repair</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/tech/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">1</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">2</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">45m</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/tech/workflows">
                  <Workflow className="mr-2 h-4 w-4" />
                  Diagnostic Workflows
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/tech/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Reports
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/tech/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/tech/tools">
                  <Wrench className="mr-2 h-4 w-4" />
                  Tool Inventory
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
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
                    <div className="flex items-center mt-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">3.2 miles away</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/tech/workflows/refrigerator">
                        <Workflow className="mr-2 h-3 w-3" />
                        Diagnostics
                      </Link>
                    </Button>
                    <Button size="sm">Start</Button>
                  </div>
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
                    <div className="flex items-center mt-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">5.8 miles away</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/tech/workflows/dryer">
                        <Workflow className="mr-2 h-3 w-3" />
                        Diagnostics
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="font-medium">4:00 PM</p>
                    </div>
                    <h3 className="text-lg font-bold mt-1">Dishwasher Leaking</h3>
                    <p className="text-sm text-gray-600 mt-1">Robert Jones • 789 Pine Ave</p>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">2.4 miles away</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/tech/workflows/dishwasher">
                        <Workflow className="mr-2 h-3 w-3" />
                        Diagnostics
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
