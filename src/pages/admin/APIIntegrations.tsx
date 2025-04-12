import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, Check, X, Lock, ExternalLink, ArrowRightLeft, Copy, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiIntegrationsStore } from "@/store/apiIntegrationsStore";
import { IntegrationConnectDialog } from "@/components/admin/integrations/IntegrationConnectDialog";
import { WebhookCreateDialog } from "@/components/admin/integrations/WebhookCreateDialog";
import { toast } from "react-hot-toast";

export default function APIIntegrations() {
  const { 
    availableIntegrations, 
    connectedIntegrations, 
    webhooks,
    isLoading,
    activeTab,
    setActiveTab,
    fetchAvailableIntegrations,
    fetchConnectedIntegrations,
    fetchWebhooks,
    disconnectIntegration
  } = useApiIntegrationsStore();

  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [selectedWebhookIntegrationId, setSelectedWebhookIntegrationId] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableIntegrations();
    fetchConnectedIntegrations();
  }, [fetchAvailableIntegrations, fetchConnectedIntegrations]);

  const handleConnect = (integration: any) => {
    setSelectedIntegration(integration);
    setShowConnectDialog(true);
  };

  const handleDisconnect = async (integrationId: string) => {
    if (window.confirm("Are you sure you want to disconnect this integration? This action cannot be undone.")) {
      await disconnectIntegration(integrationId);
    }
  };

  const handleCreateWebhook = (integrationId: string) => {
    setSelectedWebhookIntegrationId(integrationId);
    setShowWebhookDialog(true);
  };

  const handleCopyWebhookUrl = () => {
    const url = `${window.location.origin}/api/webhooks/inbound`;
    navigator.clipboard.writeText(url);
    toast("Webhook URL has been copied to clipboard");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">API Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services and APIs</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {isLoading.available ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
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
                      <Badge variant={integration.status === 'Connected' ? 'secondary' : 'outline'} className={integration.status === 'Connected' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-muted'}>
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
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect(integration)}
                      disabled={integration.status === 'Connected'}
                    >
                      {integration.status === 'Connected' ? 'Connected' : 'Connect'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="connected">
          {isLoading.connected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-20" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : connectedIntegrations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Network className="h-16 w-16 mx-auto opacity-20 mb-3" />
                <h3 className="text-lg font-medium mb-1">No connected integrations</h3>
                <p className="text-sm mb-4">You haven't connected any third-party services yet.</p>
                <Button onClick={() => setActiveTab('available')}>View Available Integrations</Button>
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
                        Connected
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Last synced: {integration.lastSync || integration.last_sync ? new Date(integration.lastSync || integration.last_sync).toLocaleString() : 'Never'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleCreateWebhook(integration.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Webhook
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
                      {window.location.origin}/api/webhooks/inbound
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto" size="sm" onClick={handleCopyWebhookUrl}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
                
                <div className="text-sm">
                  <h3 className="font-medium mb-2">Webhook Endpoints</h3>
                  {isLoading.webhooks ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <Skeleton className="h-4 w-36 mb-1" />
                            <Skeleton className="h-3 w-64" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : webhooks.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground border rounded-md">
                      <p>No webhook endpoints configured</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{webhook.name}</p>
                            <p className="text-xs text-muted-foreground">{webhook.url}</p>
                          </div>
                          <Badge variant={webhook.status === 'active' ? 'default' : 'outline'}>
                            {webhook.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {connectedIntegrations.length > 0 ? (
                <Button className="ml-auto" onClick={() => {
                  if (connectedIntegrations.length > 0) {
                    handleCreateWebhook(connectedIntegrations[0].id);
                  } else {
                    toast({
                      title: "No integrations",
                      description: "You need to connect an integration first",
                      variant: "destructive"
                    });
                  }
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Webhook
                </Button>
              ) : (
                <Button className="ml-auto" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Webhook
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedIntegration && (
        <IntegrationConnectDialog
          integration={selectedIntegration}
          isOpen={showConnectDialog}
          onClose={() => {
            setShowConnectDialog(false);
            setSelectedIntegration(null);
          }}
        />
      )}

      {selectedWebhookIntegrationId && (
        <WebhookCreateDialog
          isOpen={showWebhookDialog}
          onClose={() => {
            setShowWebhookDialog(false);
            setSelectedWebhookIntegrationId(null);
          }}
          integrationId={selectedWebhookIntegrationId}
        />
      )}
    </div>
  );
}
