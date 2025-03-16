
import { useState, useEffect } from 'react';
import { SyncStatusIndicator } from '@/components/system/SyncStatusIndicator';
import { getAllPendingUpdates, PendingUpdate } from '@/utils/offlineStorage';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cloud, CloudOff, RefreshCw, Database, AlertTriangle, CheckCircle, BarChart4 } from 'lucide-react';

export default function DataSyncDashboard() {
  const { isOffline, reconnecting, attemptReconnection } = useOfflineStatus();
  const [pendingUpdates, setPendingUpdates] = useState<{
    knowledge: PendingUpdate[];
    workflow: PendingUpdate[];
    community: PendingUpdate[];
  }>({
    knowledge: [],
    workflow: [],
    community: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const loadPendingUpdates = async () => {
      setIsLoading(true);
      try {
        const updates = await getAllPendingUpdates();
        setPendingUpdates(updates);
      } catch (error) {
        console.error('Error loading pending updates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPendingUpdates();
    
    // Set up interval to refresh data
    const interval = setInterval(loadPendingUpdates, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const totalPendingCount = 
    pendingUpdates.knowledge.length + 
    pendingUpdates.workflow.length + 
    pendingUpdates.community.length;
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const formatMethod = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return <Badge variant="outline">GET</Badge>;
      case 'POST':
        return <Badge className="bg-green-500">POST</Badge>;
      case 'PUT':
        return <Badge className="bg-blue-500">PUT</Badge>;
      case 'DELETE':
        return <Badge variant="destructive">DELETE</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };
  
  const truncateBody = (body?: string) => {
    if (!body) return '';
    return body.length > 50 ? body.substring(0, 50) + '...' : body;
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Synchronization Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage offline data synchronization
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={attemptReconnection}
          disabled={!isOffline}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Force Sync
        </Button>
      </div>
      
      {isOffline ? (
        <Alert variant="destructive">
          <CloudOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            You are currently offline. Data synchronization is not possible until you reconnect.
          </AlertDescription>
        </Alert>
      ) : reconnecting ? (
        <Alert variant="warning">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <AlertDescription>
            Reconnecting and syncing data...
          </AlertDescription>
        </Alert>
      ) : totalPendingCount > 0 ? (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            There are {totalPendingCount} pending updates to be synchronized.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            All data is synchronized. No pending updates.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Knowledge Base
            </CardTitle>
            <CardDescription>
              Articles and technical documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingUpdates.knowledge.length}</div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('knowledge')}>
              View Details
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart4 className="mr-2 h-4 w-4" />
              Workflows
            </CardTitle>
            <CardDescription>
              Diagnostic and repair procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingUpdates.workflow.length}</div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('workflow')}>
              View Details
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Cloud className="mr-2 h-4 w-4" />
              Community
            </CardTitle>
            <CardDescription>
              Posts, comments, and discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingUpdates.community.length}</div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('community')}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Status Overview</CardTitle>
              <CardDescription>
                Summary of all pending data synchronization operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalPendingCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">All Data Synchronized</h3>
                  <p className="text-muted-foreground max-w-md mt-2">
                    There are no pending updates. All changes have been successfully synchronized with the server.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">POST Requests</div>
                      <div className="text-2xl font-bold">
                        {pendingUpdates.knowledge.filter(u => u.method.toUpperCase() === 'POST').length +
                          pendingUpdates.workflow.filter(u => u.method.toUpperCase() === 'POST').length +
                          pendingUpdates.community.filter(u => u.method.toUpperCase() === 'POST').length}
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">PUT Requests</div>
                      <div className="text-2xl font-bold">
                        {pendingUpdates.knowledge.filter(u => u.method.toUpperCase() === 'PUT').length +
                          pendingUpdates.workflow.filter(u => u.method.toUpperCase() === 'PUT').length +
                          pendingUpdates.community.filter(u => u.method.toUpperCase() === 'PUT').length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Oldest Pending Update</div>
                      <div className="text-lg">
                        {formatTimestamp(Math.min(
                          ...pendingUpdates.knowledge.map(u => u.timestamp),
                          ...pendingUpdates.workflow.map(u => u.timestamp),
                          ...pendingUpdates.community.map(u => u.timestamp),
                          Date.now() // Fallback if there are no updates
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={isOffline || totalPendingCount === 0}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All Pending Updates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Updates</CardTitle>
              <CardDescription>
                Pending changes to knowledge base articles and documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUpdates.knowledge.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending knowledge base updates</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Body Preview</TableHead>
                      <TableHead>Attempts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUpdates.knowledge.map((update, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatTimestamp(update.timestamp)}</TableCell>
                        <TableCell>{formatMethod(update.method)}</TableCell>
                        <TableCell className="font-mono text-xs">{update.url}</TableCell>
                        <TableCell className="font-mono text-xs">{truncateBody(update.body)}</TableCell>
                        <TableCell>{update.attempts || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Updates</CardTitle>
              <CardDescription>
                Pending changes to diagnostic and repair workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUpdates.workflow.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending workflow updates</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Body Preview</TableHead>
                      <TableHead>Attempts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUpdates.workflow.map((update, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatTimestamp(update.timestamp)}</TableCell>
                        <TableCell>{formatMethod(update.method)}</TableCell>
                        <TableCell className="font-mono text-xs">{update.url}</TableCell>
                        <TableCell className="font-mono text-xs">{truncateBody(update.body)}</TableCell>
                        <TableCell>{update.attempts || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Updates</CardTitle>
              <CardDescription>
                Pending changes to community posts and comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUpdates.community.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending community updates</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Body Preview</TableHead>
                      <TableHead>Attempts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUpdates.community.map((update, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatTimestamp(update.timestamp)}</TableCell>
                        <TableCell>{formatMethod(update.method)}</TableCell>
                        <TableCell className="font-mono text-xs">{update.url}</TableCell>
                        <TableCell className="font-mono text-xs">{truncateBody(update.body)}</TableCell>
                        <TableCell>{update.attempts || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
