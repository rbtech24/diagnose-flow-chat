
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Check, AlertCircle, RefreshCw, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function CRMIntegration() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnected, setIsConnected] = useState(false);
  
  // Simulated data for integrations
  const crmSystems = [
    { id: "salesforce", name: "Salesforce", connected: false, lastSync: null },
    { id: "hubspot", name: "HubSpot", connected: false, lastSync: null },
    { id: "zoho", name: "Zoho CRM", connected: false, lastSync: null },
    { id: "dynamics", name: "Microsoft Dynamics", connected: false, lastSync: null },
  ];
  
  const handleConnect = () => {
    setIsConnected(true);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">CRM Integration</h1>
          <p className="text-muted-foreground">Connect and sync data with your CRM system</p>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="mappings">Field Mappings</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>CRM Integration Status</CardTitle>
                <CardDescription>Current status of your CRM integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isConnected ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Connection Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? 'Connected to CRM System' : 'Not connected to any CRM system'}
                      </p>
                    </div>
                    {isConnected ? (
                      <Button variant="destructive" className="ml-auto" onClick={handleDisconnect}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button className="ml-auto" onClick={handleConnect}>
                        Connect
                      </Button>
                    )}
                  </div>
                  
                  {isConnected && (
                    <>
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <RefreshCw className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Last Sync</h3>
                          <p className="text-sm text-muted-foreground">
                            Today at 10:30 AM
                          </p>
                        </div>
                        <Button variant="outline" className="ml-auto">
                          Sync Now
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 rounded-lg border">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                          <Database className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Data Sync</h3>
                          <p className="text-sm text-muted-foreground">
                            124 records synced successfully
                          </p>
                        </div>
                        <Button variant="outline" className="ml-auto">
                          View Details
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Integration Options</CardTitle>
                <CardDescription>Available CRM systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {crmSystems.map((crm) => (
                    <div key={crm.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <span>{crm.name}</span>
                      </div>
                      <Badge variant={crm.connected ? "default" : "outline"}>
                        {crm.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Integrations
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>CRM Integration Settings</CardTitle>
              <CardDescription>Configure your CRM connection settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API URL</Label>
                    <Input id="api-url" placeholder="https://api.yourcrm.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" placeholder="Enter your API key" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="webhook-url" 
                      readOnly 
                      value="https://yourdomain.com/api/crm/webhook" 
                      className="flex-1"
                    />
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this URL in your CRM system to receive real-time updates.
                  </p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium">Sync Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-sync">Automatic Sync</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically sync data every hour
                        </p>
                      </div>
                      <Switch id="auto-sync" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-way-sync">Two-way Sync</Label>
                        <p className="text-xs text-muted-foreground">
                          Changes are synced in both directions
                        </p>
                      </div>
                      <Switch id="two-way-sync" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notification-sync">Sync Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications for sync issues
                        </p>
                      </div>
                      <Switch id="notification-sync" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="mappings">
          <Card>
            <CardHeader>
              <CardTitle>Field Mappings</CardTitle>
              <CardDescription>Configure how fields map between systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Connect to a CRM system to configure field mappings
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Sync Logs</CardTitle>
              <CardDescription>View history of data synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No sync logs available yet
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
