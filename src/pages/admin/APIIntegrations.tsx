
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Check, X, Lock, ExternalLink, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function APIIntegrations() {
  const [activeTab, setActiveTab] = useState("available");
  
  // Simulated data
  const availableIntegrations = [
    { id: "stripe", name: "Stripe", category: "Payment", status: "Not Connected", description: "Process payments and subscriptions" },
    { id: "twilio", name: "Twilio", category: "Communication", status: "Not Connected", description: "Send SMS and make voice calls" },
    { id: "sendgrid", name: "SendGrid", category: "Email", status: "Not Connected", description: "Send transactional and marketing emails" },
    { id: "google", name: "Google Maps", category: "Maps", status: "Not Connected", description: "Integrate maps and location services" },
    { id: "openai", name: "OpenAI", category: "AI", status: "Not Connected", description: "Add AI and ML capabilities" },
    { id: "s3", name: "Amazon S3", category: "Storage", status: "Not Connected", description: "Cloud storage for files and media" },
  ];
  
  const connectedIntegrations = [
    { id: "slack", name: "Slack", category: "Communication", status: "Connected", lastSync: "1 hour ago", description: "Team communication and notifications" },
    { id: "zendesk", name: "Zendesk", category: "Support", status: "Connected", lastSync: "3 hours ago", description: "Customer support and ticketing" },
  ];
  
  const handleConnect = (id: string) => {
    console.log(`Connect to ${id}`);
  };
  
  const handleDisconnect = (id: string) => {
    console.log(`Disconnect from ${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">API Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services and APIs</p>
        </div>
      </div>

      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableIntegrations.map((integration) => (
              <Card key={integration.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-muted">
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Docs
                  </Button>
                  <Button size="sm" onClick={() => handleConnect(integration.id)}>
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connected">
          {connectedIntegrations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No connected integrations
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedIntegrations.map((integration) => (
                <Card key={integration.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Last synced: {integration.lastSync}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDisconnect(integration.id)}>
                      Disconnect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>Manage incoming webhooks for third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-lg border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">System Webhook URL</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      https://yourapp.com/api/webhooks/inbound
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto" size="sm">
                    Copy URL
                  </Button>
                </div>
                
                <div className="text-sm">
                  <h3 className="font-medium mb-2">Available Webhooks</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Payment Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive notifications when payments are processed</p>
                      </div>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">User Events</p>
                        <p className="text-xs text-muted-foreground">Notifications for user registrations and activities</p>
                      </div>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Support Tickets</p>
                        <p className="text-xs text-muted-foreground">Receive notifications for new support tickets</p>
                      </div>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Create New Webhook</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
