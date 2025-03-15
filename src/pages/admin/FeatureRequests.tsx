
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RotateCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";

export default function AdminFeatureRequests() {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(mockFeatureRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  const handleUpdateStatus = (id: string, status: FeatureRequestStatus) => {
    setFeatureRequests(
      featureRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              updatedAt: new Date(),
            }
          : request
      )
    );
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
          <Button variant="ghost" size="icon">
            <RotateCw className="h-4 w-4" />
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
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No pending feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inProgressRequests.length > 0 ? (
            inProgressRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
              />
            ))
          ) : (
            <div className="col-span-full p-8 text-center border rounded-lg">
              <p className="text-gray-500">No in-progress feature requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard
                key={request.id}
                featureRequest={request}
                onVote={() => {}}
                onViewDetails={viewRequestDetails}
                canVote={false}
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
