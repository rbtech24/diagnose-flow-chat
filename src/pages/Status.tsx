
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Status() {
  const services = [
    {
      name: "Diagnostic API",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None"
    },
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.98%",
      lastIncident: "3 days ago"
    },
    {
      name: "Mobile Application",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "7 days ago"
    },
    {
      name: "Workflow Engine",
      status: "operational",
      uptime: "99.97%",
      lastIncident: "14 days ago"
    },
    {
      name: "Authentication Service",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "None"
    },
    {
      name: "Database",
      status: "maintenance",
      uptime: "99.90%",
      lastIncident: "Ongoing maintenance"
    }
  ];

  const incidents = [
    {
      date: "May 15, 2023",
      title: "Brief API Outage",
      description: "The Diagnostic API experienced a 5-minute outage due to a deployment issue. All systems were quickly restored with no data loss.",
      status: "resolved",
      time: "10:32 AM - 10:37 AM EST"
    },
    {
      date: "April 22, 2023",
      title: "Workflow Editor Performance Degradation",
      description: "The Workflow Editor experienced slow performance for approximately 1 hour due to unusually high traffic. Our team addressed the issue by scaling up resources.",
      status: "resolved",
      time: "3:15 PM - 4:20 PM EST"
    }
  ];

  const maintenanceEvents = [
    {
      date: "May 22, 2023",
      title: "Database Optimization",
      description: "Scheduled maintenance to optimize database performance. No service interruption is expected.",
      status: "scheduled",
      time: "2:00 AM - 4:00 AM EST"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-16"
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">System Status</h1>
        
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h2 className="font-semibold">All Systems Operational</h2>
              </div>
              <p className="text-sm text-gray-600">Last updated: May 19, 2023 - 10:15 AM EST</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">30-Day Uptime</h2>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">99.97%</div>
                <div className="text-sm text-green-600 mb-1">+0.02%</div>
              </div>
              <Progress value={99.97} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">Current Incidents</h2>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">1</div>
                <div className="text-sm text-gray-600">scheduled maintenance</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-semibold mt-12 mb-6">Service Status</h2>
        <div className="space-y-4 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {service.status === "operational" ? (
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    ) : service.status === "maintenance" ? (
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                    ) : (
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    )}
                    <h3 className="font-medium">{service.name}</h3>
                    {service.status === "maintenance" && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Maintenance</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 capitalize font-medium">
                        {service.status === "operational" ? (
                          <span className="text-green-600">Operational</span>
                        ) : service.status === "maintenance" ? (
                          <span className="text-amber-600">Maintenance</span>
                        ) : (
                          <span className="text-red-600">Degraded</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Uptime:</span>
                      <span className="ml-2 font-medium">{service.uptime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Incident:</span>
                      <span className="ml-2">{service.lastIncident}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recent Incidents</h2>
            <div className="space-y-4">
              {incidents.length > 0 ? (
                incidents.map((incident, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{incident.title}</h3>
                          <p className="text-sm text-gray-500">{incident.date} • {incident.time}</p>
                        </div>
                      </div>
                      <div className="pl-8">
                        <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Resolved</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-600">No recent incidents to report.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Upcoming Maintenance</h2>
            <div className="space-y-4">
              {maintenanceEvents.length > 0 ? (
                maintenanceEvents.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                        </div>
                      </div>
                      <div className="pl-8">
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">Scheduled</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-600">No scheduled maintenance at this time.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 my-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Updates</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Get notified about system status changes and scheduled maintenance via email or SMS.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Subscribe to Updates
          </Button>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
