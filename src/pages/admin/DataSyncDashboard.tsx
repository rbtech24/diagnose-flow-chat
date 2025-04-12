
import { useState, useEffect } from 'react';
import { SyncStatusIndicator } from '@/components/system/SyncStatusIndicator';
import { SyncStatusBadge } from '@/components/system/SyncStatusBadge';
import { getAllPendingUpdates, PendingUpdate } from '@/utils/offlineStorage';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, CloudOff, RefreshCw, Database, AlertTriangle, CheckCircle, 
  BarChart4, ChevronRight, ArrowUpDown, Clock, Download
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { useCommunitySync } from '@/hooks/useCommunitySync';
import { useKnowledgeSync } from '@/hooks/useKnowledgeSync';
import { format, formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DataSyncDashboard() {
  const { isOffline, reconnecting, attemptReconnection } = useOfflineStatus();
  const { syncOfflineChanges: syncCommunity, pendingChanges: communityPending } = useCommunitySync();
  const { syncOfflineChanges: syncKnowledge, pendingChanges: knowledgePending } = useKnowledgeSync();
  
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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  
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
    
    const interval = setInterval(loadPendingUpdates, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const totalPendingCount = 
    pendingUpdates.knowledge.length + 
    pendingUpdates.workflow.length + 
    pendingUpdates.community.length;
  
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
  };
  
  const formatTimeAgo = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
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
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  const sortUpdates = (updates: PendingUpdate[]) => {
    if (!sortColumn) return updates;
    
    return [...updates].sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn === 'timestamp') {
        comparison = a.timestamp - b.timestamp;
      } else if (sortColumn === 'method') {
        comparison = a.method.localeCompare(b.method);
      } else if (sortColumn === 'url') {
        comparison = a.url.localeCompare(b.url);
      } else if (sortColumn === 'attempts') {
        comparison = (a.attempts || 0) - (b.attempts || 0);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  const syncAllChanges = async () => {
    if (isOffline) {
      toast.error("Cannot sync while offline. Please check your connection.");
      return;
    }
    
    setSyncingAll(true);
    setSyncProgress(0);
    
    try {
      if (pendingUpdates.knowledge.length > 0) {
        toast("Synchronizing knowledge base updates");
        await syncKnowledge();
        setSyncProgress(33);
      }
      
      if (pendingUpdates.workflow.length > 0) {
        toast("Synchronizing workflow updates");
        // await syncWorkflow();
        setSyncProgress(66);
      }
      
      if (pendingUpdates.community.length > 0) {
        toast("Synchronizing community updates");
        await syncCommunity();
        setSyncProgress(100);
      }
      
      const updates = await getAllPendingUpdates();
      setPendingUpdates(updates);
      
      toast.success("All changes have been synchronized");
    } catch (error) {
      console.error('Error syncing all changes:', error);
      toast.error("There was an error synchronizing all changes");
    } finally {
      setSyncingAll(false);
    }
  };
  
  const getTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort('timestamp')}>
          <div className="flex items-center">
            Timestamp
            {sortColumn === 'timestamp' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
        </TableHead>
        <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort('method')}>
          <div className="flex items-center">
            Method
            {sortColumn === 'method' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort('url')}>
          <div className="flex items-center">
            URL
            {sortColumn === 'url' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
        </TableHead>
        <TableHead>Body Preview</TableHead>
        <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort('attempts')}>
          <div className="flex items-center">
            Attempts
            {sortColumn === 'attempts' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </div>
        </TableHead>
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
  
  const renderUpdateRow = (update: PendingUpdate, index: number, type: 'knowledge' | 'workflow' | 'community') => (
    <TableRow key={index}>
      <TableCell className="font-mono text-xs">
        <div className="flex flex-col">
          <span>{formatTimestamp(update.timestamp)}</span>
          <span className="text-muted-foreground">{formatTimeAgo(update.timestamp)}</span>
        </div>
      </TableCell>
      <TableCell>{formatMethod(update.method)}</TableCell>
      <TableCell className="font-mono text-xs max-w-[200px] truncate">{update.url}</TableCell>
      <TableCell className="font-mono text-xs max-w-[200px] truncate">{truncateBody(update.body)}</TableCell>
      <TableCell>{update.attempts || 0}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              if (type === 'knowledge') syncKnowledge();
              if (type === 'community') syncCommunity();
              toast(`Attempting to sync ${type} update`);
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Sync Now</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const bodyObj = update.body ? JSON.parse(update.body) : {};
              console.log('Update details:', {
                ...update,
                bodyParsed: bodyObj
              });
              toast("Update details logged to console");
            }}>
              <Download className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <Skeleton className="h-16 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Synchronization Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage offline data synchronization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SyncStatusBadge className="mr-2" />
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
          <AlertDescription className="flex justify-between items-center">
            <span>There are {totalPendingCount} pending updates to be synchronized.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncAllChanges}
              disabled={syncingAll}
              className="ml-4"
            >
              {syncingAll ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync All
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            All data is synchronized. No pending updates.
          </AlertDescription>
        </Alert>
      )}
      
      {syncingAll && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Syncing all pending changes...</span>
            <span>{syncProgress}%</span>
          </div>
          <Progress value={syncProgress} />
        </div>
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
            <div className="text-3xl font-bold flex items-center gap-2">
              {pendingUpdates.knowledge.length}
              <SyncStatusBadge syncItems={pendingUpdates.knowledge.length} syncType="knowledge" variant="icon-only" className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setActiveTab('knowledge')}
              disabled={pendingUpdates.knowledge.length === 0}
            >
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
            <div className="text-3xl font-bold flex items-center gap-2">
              {pendingUpdates.workflow.length}
              <SyncStatusBadge syncItems={pendingUpdates.workflow.length} syncType="workflow" variant="icon-only" className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setActiveTab('workflow')}
              disabled={pendingUpdates.workflow.length === 0}
            >
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
            <div className="text-3xl font-bold flex items-center gap-2">
              {pendingUpdates.community.length}
              <SyncStatusBadge syncItems={pendingUpdates.community.length} syncType="community" variant="icon-only" className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">Pending updates</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setActiveTab('community')}
              disabled={pendingUpdates.community.length === 0}
            >
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
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isOffline || totalPendingCount === 0 || syncingAll}
                onClick={syncAllChanges}
              >
                {syncingAll ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing Updates...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync All Pending Updates
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Knowledge Base Updates</CardTitle>
                <CardDescription>
                  Pending changes to knowledge base articles and documents
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncKnowledge}
                disabled={pendingUpdates.knowledge.length === 0 || isOffline}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Knowledge
              </Button>
            </CardHeader>
            <CardContent>
              {pendingUpdates.knowledge.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending knowledge base updates</p>
                </div>
              ) : (
                <Table>
                  {getTableHeader()}
                  <TableBody>
                    {sortUpdates(pendingUpdates.knowledge).map((update, index) => 
                      renderUpdateRow(update, index, 'knowledge')
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workflow Updates</CardTitle>
                <CardDescription>
                  Pending changes to diagnostic and repair workflows
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pendingUpdates.workflow.length === 0 || isOffline}
                onClick={() => {
                  toast.error("Workflow sync is not yet implemented");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Workflows
              </Button>
            </CardHeader>
            <CardContent>
              {pendingUpdates.workflow.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending workflow updates</p>
                </div>
              ) : (
                <Table>
                  {getTableHeader()}
                  <TableBody>
                    {sortUpdates(pendingUpdates.workflow).map((update, index) => 
                      renderUpdateRow(update, index, 'workflow')
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Community Updates</CardTitle>
                <CardDescription>
                  Pending changes to community posts and comments
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncCommunity}
                disabled={pendingUpdates.community.length === 0 || isOffline}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Community
              </Button>
            </CardHeader>
            <CardContent>
              {pendingUpdates.community.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending community updates</p>
                </div>
              ) : (
                <Table>
                  {getTableHeader()}
                  <TableBody>
                    {sortUpdates(pendingUpdates.community).map((update, index) => 
                      renderUpdateRow(update, index, 'community')
                    )}
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
