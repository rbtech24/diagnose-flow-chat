
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Status() {
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
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">System Status</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Check the current status of all Repair Auto Pilot services and systems.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold">All Systems Operational</h2>
            <p className="text-gray-600">All services are running normally.</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Web Application</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Mobile Applications</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">API Services</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Database</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Authentication</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Analytics Engine</span>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Degraded Performance</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Notification Services</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Operational</Badge>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Past Incidents</h2>
        
        <div className="space-y-6 mb-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">API Service Disruption</h3>
                <Badge variant="outline">Resolved</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">July 12, 2023</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">11:45 AM</p>
                <p>The issue has been resolved and all services have been restored to full functionality.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">10:30 AM</p>
                <p>Our engineers have identified the root cause and are implementing a fix.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">9:15 AM</p>
                <p>We are investigating reports of API service disruptions affecting some diagnostic workflows.</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Database Maintenance</h3>
                <Badge variant="outline">Resolved</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">June 5, 2023</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">2:00 AM</p>
                <p>Scheduled maintenance has been completed. All systems are functioning normally.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">12:00 AM</p>
                <p>Scheduled database maintenance has begun. Some services may experience temporary disruptions.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Subscribe to Updates</h2>
          <p className="text-gray-600 mb-4">Receive real-time notifications about system status and scheduled maintenance.</p>
          <Button className="bg-blue-600">Subscribe to Status Updates</Button>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" onClick={() => window.scrollTo(0, 0)} className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
