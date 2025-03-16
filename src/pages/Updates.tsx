
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Updates() {
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
        <h1 className="text-3xl font-bold mb-4">Product Updates</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Stay up to date with the latest features, improvements, and fixes to Repair Auto Pilot.
        </p>
        
        <div className="grid gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">Version 3.5 Release</h2>
                    <Badge className="bg-blue-500">New Features</Badge>
                  </div>
                  <p className="text-sm text-gray-500">July 15, 2023</p>
                  <div className="prose max-w-none">
                    <p>
                      We're excited to announce the release of Repair Auto Pilot v3.5, which includes several major features
                      and improvements requested by our users.
                    </p>
                    <h3 className="text-lg font-semibold mt-4">New Features:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Advanced diagnostic branching workflows</li>
                      <li>PDF report generation for completed diagnostics</li>
                      <li>Parts inventory integration with popular suppliers</li>
                      <li>Enhanced mobile app experience for field technicians</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-4">Improvements:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Faster loading times for diagnostic workflows</li>
                      <li>Improved search functionality in the appliance database</li>
                      <li>More detailed analytics for company admins</li>
                      <li>Updated user interface for better usability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">Version 3.4.2 Release</h2>
                    <Badge className="bg-green-500">Bug Fixes</Badge>
                  </div>
                  <p className="text-sm text-gray-500">June 2, 2023</p>
                  <div className="prose max-w-none">
                    <p>
                      This release focuses on stability improvements and bug fixes based on user feedback.
                    </p>
                    <h3 className="text-lg font-semibold mt-4">Bug Fixes:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Fixed an issue with image uploads in diagnostic workflows</li>
                      <li>Resolved synchronization problems between mobile and web applications</li>
                      <li>Fixed dashboard analytics calculations for specific date ranges</li>
                      <li>Addressed several UI glitches in dark mode</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-4">Security:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Updated authentication system with enhanced security measures</li>
                      <li>Improved data encryption for sensitive information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">Version 3.4 Release</h2>
                    <Badge className="bg-purple-500">Major Update</Badge>
                  </div>
                  <p className="text-sm text-gray-500">May 10, 2023</p>
                  <div className="prose max-w-none">
                    <p>
                      Version 3.4 introduces our new AI-powered diagnostic suggestion engine along with several workflow improvements.
                    </p>
                    <h3 className="text-lg font-semibold mt-4">New Features:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>AI diagnostic suggestion engine that learns from successful repairs</li>
                      <li>Interactive 3D models for common appliance components</li>
                      <li>Custom branding options for company accounts</li>
                      <li>Technician performance rankings and gamification</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-4">Improvements:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Completely redesigned workflow editor</li>
                      <li>New dashboard with improved KPI visualizations</li>
                      <li>Enhanced customer communication tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center py-8">
          <Button asChild>
            <Link to="#">
              Load More Updates
            </Link>
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
