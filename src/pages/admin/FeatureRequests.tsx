
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RotateCw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";

export default function AdminFeatureRequests() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureRequests();
  }, []);

  const fetchFeatureRequests = async () => {
    try {
      setLoading(true);
      
      // Using mock data to avoid database schema issues
      if (mockFeatureRequests && mockFeatureRequests.length > 0) {
        setFeatureRequests(mockFeatureRequests);
        setLoading(false);
        return;
      }
      
      // If no mock data, set empty array for now
      setFeatureRequests([]);
      setError("No feature requests found.");
    } catch (err) {
      console.error("Error fetching feature requests:", err);
      toast({
        variant: "destructive",
        title: "Error loading requests",
        description: "There was a problem fetching feature requests."
      });
      setFeatureRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: FeatureRequestStatus) => {
    try {
      // For development, update the mock data in state
      const updatedRequests = featureRequests.map(req => 
        req.id === id ? { ...req, status } : req  
      );
      
      setFeatureRequests(updatedRequests);
      
      toast({
        title: "Status updated",
        description: `Feature request status updated to ${status}`
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update feature request status."
      });
    }
  };

  const handleUpdatePriority = async (id: string, priority: string) => {
    try {
      // For development, update the mock data in state
      const updatedRequests = featureRequests.map(req => 
        req.id === id ? { ...req, priority: priority as any } : req  
      );
      
      setFeatureRequests(updatedRequests);
      
      toast({
        title: "Priority updated",
        description: `Feature request priority updated to ${priority}`
      });
    } catch (err) {
      console.error("Error updating priority:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update feature request priority."
      });
    }
  };

  const filteredRequests = featureRequests.filter(request => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter(request => 
    request.status === "pending" || request.status === "submitted"
  );
  
  const approvedRequests = filteredRequests.filter(request => 
    ["approved", "in-progress"].includes(request.status as string)
  );
  
  const completedRequests = filteredRequests.filter(request => 
    request.status === "completed"
  );
  
  const rejectedRequests = filteredRequests.filter(request => 
    request.status === "rejected"
  );

  const viewRequestDetails = (id: string) => {
    navigate(`/admin/feature-requests/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-gray-500">Review and manage customer feature requests</p>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchFeatureRequests}
            disabled={loading}
          >
            <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Card className="mb-6 bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">{pendingRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{approvedRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{completedRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">{rejectedRequests.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </Card>
            ))
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onViewDetails={viewRequestDetails}
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No pending feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : approvedRequests.length > 0 ? (
            approvedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onViewDetails={viewRequestDetails}
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No approved feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onViewDetails={viewRequestDetails}
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No completed feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : rejectedRequests.length > 0 ? (
            rejectedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onViewDetails={viewRequestDetails}
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
                onUpdatePriority={handleUpdatePriority}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No rejected feature requests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
