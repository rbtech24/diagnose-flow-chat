
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Wrench, Clock, AlertTriangle, Search,
  PlusCircle, ArrowUp, ArrowDown, MessagesSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CompanyDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">ABC Appliance Repair</h1>
          <p className="text-gray-500">Company Dashboard</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Dashboard</CardTitle>
            <CardDescription>Manage your team and start new jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <Button className="flex-1" asChild>
                  <Link to="/company/techs">Manage Team</Link>
                </Button>
                <Button className="flex-1" variant="default">Start a Diagnosis</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-xl font-bold">8</p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold">$12.5k</p>
                    <span className="ml-2 text-xs text-green-600 flex items-center">
                      <ArrowUp className="h-3 w-3" /> 
                      12%
                    </span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-xl font-bold">1.4 hrs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your technicians</CardDescription>
              </div>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Technician
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted rounded-full p-3 mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No team members found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first technician to get started
              </p>
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
                <h3 className="font-medium text-red-900">Failed to load technicians</h3>
                <p className="text-sm text-red-700">
                  There was an error loading your technician data. Please try again later or contact support.
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto self-start bg-white">
                Retry
              </Button>
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
