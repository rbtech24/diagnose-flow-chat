import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { FeatureRequest, FeatureRequestPriority } from "@/types/feature-request";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";
import { currentUser } from "@/data/mockTickets";

export default function CompanyFeatureRequests() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(mockFeatureRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleVote = (id: string) => {
    const updatedRequests = featureRequests.map((request) => {
      if (request.id === id) {
        return {
          ...request,
          votes_count: (request.votes_count || 0) + 1,
          user_has_voted: true
        };
      }
      return request;
    });
    
    setFeatureRequests(updatedRequests);
  };

  const handleAddFeatureRequest = (values: any) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newFeatureRequest: FeatureRequest = {
        id: `fr-${Date.now()}`,
        title: values.title,
        description: values.description,
        status: "pending",
        priority: values.priority as FeatureRequestPriority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: currentUser.id,
        created_by_user: {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role as "admin" | "company" | "tech",
          avatar_url: currentUser.avatar_url
        },
        votes_count: 0,
        comments_count: 0,
        user_has_voted: false
      };

      setFeatureRequests([newFeatureRequest, ...featureRequests]);
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }, 1000);
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

  const pendingRequests = filteredRequests.filter((request) => request.status === "pending" || request.status === "submitted");
  const approvedRequests = filteredRequests.filter((request) => 
    ["approved", "in-progress"].includes(request.status)
  );
  const completedRequests = filteredRequests.filter((request) => request.status === "completed");
  const rejectedRequests = filteredRequests.filter((request) => request.status === "rejected");

  const viewRequestDetails = (id: string) => {
    navigate(`/company/feature-requests/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-gray-500">Request and vote on new features</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <NewFeatureRequestForm
                onSubmit={handleAddFeatureRequest}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
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

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">{filteredRequests.filter(request => request.status === "pending").length}</span>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{filteredRequests.filter(request => ["approved", "in-progress"].includes(request.status)).length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{filteredRequests.filter(request => request.status === "completed").length}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">{filteredRequests.filter(request => request.status === "rejected").length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={handleVote}
                onViewDetails={viewRequestDetails}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No pending feature requests</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit a Feature Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <NewFeatureRequestForm
                    onSubmit={handleAddFeatureRequest}
                    isSubmitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvedRequests.length > 0 ? (
            approvedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={handleVote}
                onViewDetails={viewRequestDetails}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No approved feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={handleVote}
                onViewDetails={viewRequestDetails}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No completed feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={handleVote}
                onViewDetails={viewRequestDetails}
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
