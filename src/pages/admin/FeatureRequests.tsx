
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RotateCw, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

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
      
      // Get feature requests with their creator info
      const { data: requests, error: requestsError } = await supabase
        .from("feature_requests")
        .select(`
          *,
          created_by_user:created_by(id, name, email, avatar_url, role)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      
      // Process the data we received
      const requestsWithMetadata = await Promise.all(
        (requests || []).map(async (request) => {
          // Get vote count for each feature request
          const { count: voteCount, error: votesError } = await supabase
            .from("feature_votes")
            .select("id", { count: true, head: true })
            .eq("feature_id", request.id);
            
          // Get comments count for each feature request
          const { count: commentsCount, error: commentsError } = await supabase
            .from("feature_comments")
            .select("id", { count: true, head: true })
            .eq("feature_id", request.id);

          // Get current user's vote status
          const { data: userData } = await supabase.auth.getUser();
          let userHasVoted = false;
          
          if (userData?.user) {
            const { data: userVote } = await supabase
              .from("feature_votes")
              .select("id")
              .eq("feature_id", request.id)
              .eq("user_id", userData.user.id)
              .maybeSingle();
              
            userHasVoted = !!userVote;
          }

          return {
            ...request,
            votes_count: voteCount || 0,
            user_has_voted: userHasVoted,
            comments_count: commentsCount || 0
          };
        })
      );

      setFeatureRequests(requestsWithMetadata as FeatureRequest[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching feature requests:", err);
      setError("Failed to load feature requests");
      toast({
        variant: "destructive",
        title: "Error loading feature requests",
        description: "There was a problem retrieving the feature requests."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: FeatureRequestStatus) => {
    try {
      const { error } = await supabase
        .from("feature_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setFeatureRequests(
        featureRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status,
                updated_at: new Date().toISOString(),
              }
            : request
        )
      );

      toast({
        title: "Status updated",
        description: `Feature request status changed to ${status}`
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

  const filteredRequests = featureRequests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter((request) => request.status === "pending");
  const inProgressRequests = filteredRequests.filter((request) => request.status === "in-progress");
  const completedRequests = filteredRequests.filter((request) => 
    ["completed", "approved", "rejected"].includes(request.status)
  );

  const viewRequestDetails = (id: string) => {
    navigate(`/admin/feature-requests/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-gray-500">Manage feature requests from companies and technicians</p>
        </div>
        <div className="flex items-center gap-2">
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
            placeholder="Search feature requests..."
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
          <TabsTrigger value="in-progress">
            In Progress <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{inProgressRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed/Reviewed <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{completedRequests.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <div className="flex justify-center">
                <RotateCw className="h-6 w-6 animate-spin" />
              </div>
              <p className="mt-2 text-gray-500">Loading feature requests...</p>
            </div>
          ) : pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No pending feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <div className="flex justify-center">
                <RotateCw className="h-6 w-6 animate-spin" />
              </div>
              <p className="mt-2 text-gray-500">Loading feature requests...</p>
            </div>
          ) : inProgressRequests.length > 0 ? (
            inProgressRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No in-progress feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center">
              <div className="flex justify-center">
                <RotateCw className="h-6 w-6 animate-spin" />
              </div>
              <p className="mt-2 text-gray-500">Loading feature requests...</p>
            </div>
          ) : completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No completed feature requests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
