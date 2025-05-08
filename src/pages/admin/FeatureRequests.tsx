import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { mockFeatureRequests } from "@/data/mockFeatureRequests"; 

export default function AdminFeatureRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "priority">("newest");
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(mockFeatureRequests);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "completed" | "rejected">("all");
  
  // Filter requests based on search query, status, etc.
  const filteredRequests = featureRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === "all") return true;
    
    // Map the tabs to the appropriate statuses
    if (activeTab === "pending") return request.status === "pending" || request.status === "submitted";
    return request.status === activeTab;
  });
  
  // Sort requests based on sortBy option
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "votes") {
      return b.votes_count - a.votes_count;
    }
    if (sortBy === "priority") {
      const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });
  
  const handleCreateRequest = (newRequest: Omit<FeatureRequest, "id" | "created_at" | "updated_at" | "votes_count" | "user_has_voted" | "comments_count">) => {
    const createdRequest: FeatureRequest = {
      ...newRequest,
      id: `fr-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      votes_count: 0,
      user_has_voted: false,
      comments_count: 0,
    };
    
    setFeatureRequests([createdRequest, ...featureRequests]);
    setIsNewRequestDialogOpen(false);
  };

  // Fix the approvedRequests filter to include both "approved" and "in-progress" statuses
  const approvedRequests = filteredRequests.filter(request => 
    ["approved", "in-progress"].includes(request.status as string)
  );
  
  const totalPendingCount = featureRequests.filter(request => request.status === "pending" || request.status === "submitted").length;
  const totalApprovedCount = approvedRequests.length;
  const totalCompletedCount = featureRequests.filter(request => request.status === "completed").length;
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Feature Requests</h1>
        
        <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Feature Request</DialogTitle>
              <DialogDescription>
                Submit a new feature request for the platform
              </DialogDescription>
            </DialogHeader>
            <NewFeatureRequestForm onSubmit={handleCreateRequest} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search feature requests..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select defaultValue={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="votes">Most Voted</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6" onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">{featureRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">{totalPendingCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge variant="secondary" className="ml-2">{totalApprovedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">{totalCompletedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {featureRequests.filter(r => r.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/admin/feature-requests/${request.id}`} key={request.id}>
                  <FeatureRequestCard request={request} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No feature requests found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Other tabs content would be similar, filtered by status */}
        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/admin/feature-requests/${request.id}`} key={request.id}>
                  <FeatureRequestCard request={request} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending feature requests found</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Similar structure for approved, completed, and rejected tabs */}
        <TabsContent value="approved" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/admin/feature-requests/${request.id}`} key={request.id}>
                  <FeatureRequestCard request={request} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No approved feature requests found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/admin/feature-requests/${request.id}`} key={request.id}>
                  <FeatureRequestCard request={request} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No completed feature requests found</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/admin/feature-requests/${request.id}`} key={request.id}>
                  <FeatureRequestCard request={request} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No rejected feature requests found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
