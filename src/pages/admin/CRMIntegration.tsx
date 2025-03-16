
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowUpDown, Settings } from "lucide-react";

export default function CRMIntegration() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">CRM Integrations</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              HouseCallPro Integration
            </CardTitle>
            <CardDescription>Connect Repair Auto Pilot with HouseCallPro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="bg-blue-100 text-blue-700 inline-block p-2 rounded-lg text-xs font-semibold mb-3">COMING SOON</div>
              <p className="text-sm text-gray-600 mb-4">Seamlessly sync customer and job data between platforms</p>
              <Button disabled className="bg-blue-300">Setup Integration</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-purple-600" />
              Service Titan Integration
            </CardTitle>
            <CardDescription>Connect Repair Auto Pilot with Service Titan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="bg-purple-100 text-purple-700 inline-block p-2 rounded-lg text-xs font-semibold mb-3">COMING SOON</div>
              <p className="text-sm text-gray-600 mb-4">Automatically sync jobs and customer information</p>
              <Button disabled className="bg-purple-300">Setup Integration</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Roadmap</CardTitle>
          <CardDescription>Our planned CRM integration timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-green-50 border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-green-800">Phase 1: HouseCallPro & Service Titan</p>
                  <p className="text-sm text-gray-600">Core data synchronization for jobs and customers</p>
                </div>
                <div className="bg-green-100 text-green-700 p-1 rounded text-xs font-semibold">Q3 2024</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Phase 2: Additional CRM Platforms</p>
                  <p className="text-sm text-gray-600">Expanding support to more industry-standard CRMs</p>
                </div>
                <div className="bg-blue-100 text-blue-700 p-1 rounded text-xs font-semibold">Q4 2024</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Phase 3: Advanced Integration Features</p>
                  <p className="text-sm text-gray-600">Two-way syncing, real-time updates, and advanced automation</p>
                </div>
                <div className="bg-purple-100 text-purple-700 p-1 rounded text-xs font-semibold">Q1 2025</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
