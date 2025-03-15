
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
import { FeatureRequest } from "@/types/feature-request";
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
    setFeatureRequests(
      featureRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              score: request.score + 1,
              votes: [
                ...request.votes,
                {
                  id: `vote-${Date.now()}`,
                  userId: currentUser.id,
                  featureRequestId: id,
                  createdAt: new Date(),
                  user: currentUser,
                },
              ],
            }
          : request
      )
    );
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
        priority: values.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser,
        votes: [],
        score: 0,
        comments: [],
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

  const myRequests = filteredRequests.filter((request) => request.createdBy.id === currentUser.id);
  const pendingRequests = filteredRequests.filter((request) => request.status === "pending");
  const approvedRequests = filteredRequests.filter((request) => 
    ["approved", "in-progress"].includes(request.status)
  );
  const completedRequests = filteredRequests.filter((request) => request.status === "completed");
  
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

      <Tabs defaultValue="my-requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-requests">
            My Requests <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">{myRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-600">{pendingRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="approved">
            In Development <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{approvedRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{completedRequests.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-requests" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myRequests.length > 0 ? (
            myRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={handleVote}
                onViewDetails={viewRequestDetails}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">You haven't submitted any feature requests yet</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Your First Feature Request
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
              <p className="text-gray-500">No feature requests in development</p>
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
      </Tabs>
    </div>
  );
}
