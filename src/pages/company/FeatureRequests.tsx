
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { FeatureRequest } from "@/types/feature-request";
import { useFeatureRequests } from "@/hooks/useFeatureRequests";

export default function CompanyFeatureRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "status">("newest");
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "mine" | "pending" | "approved">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    requests: featureRequests, 
    isLoading, 
    createRequest 
  } = useFeatureRequests();
  
  // Filter requests based on search query, tab, etc.
  const filteredRequests = featureRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === "all") return true;
    if (activeTab === "mine") return request.user_id === "current-user-id"; // Replace with actual user ID logic
    if (activeTab === "pending") return ["pending", "submitted"].includes(request.status);
    if (activeTab === "approved") return ["approved", "in-progress", "completed"].includes(request.status as string);
    
    return true;
  });
  
  // Sort requests based on sortBy option
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "votes") {
      return b.votes_count - a.votes_count;
    }
    if (sortBy === "status") {
      const statusOrder: Record<string, number> = {
        "completed": 4,
        "in-progress": 3,
        "approved": 2,
        "pending": 1,
        "submitted": 0,
        "rejected": -1
      };
      return statusOrder[b.status as string] - statusOrder[a.status as string];
    }
    return 0;
  });
  
  const handleCreateRequest = async (newRequest: Omit<FeatureRequest, "id" | "created_at" | "updated_at" | "votes_count" | "user_has_voted" | "comments_count">) => {
    setIsSubmitting(true);
    try {
      await createRequest(newRequest);
      setIsNewRequestDialogOpen(false);
    } catch (error) {
      console.error("Error creating feature request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix the pendingRequests filter to include both "pending" and "submitted" statuses
  const pendingRequests = filteredRequests.filter((request) => 
    ["pending", "submitted"].includes(request.status)
  );
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Feature Requests</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
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
            <NewFeatureRequestForm onSubmit={handleCreateRequest} isSubmitting={isSubmitting} />
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <Select defaultValue={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="votes">Most Voted</SelectItem>
              <SelectItem value="status">Status</SelectItem>
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
          <TabsTrigger value="mine">
            My Requests
            <Badge variant="secondary" className="ml-2">
              {featureRequests.filter(r => r.user_id === "current-user-id").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved/In Progress
            <Badge variant="secondary" className="ml-2">
              {featureRequests.filter(r => ["approved", "in-progress"].includes(r.status as string)).length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.length > 0 ? (
              sortedRequests.map((request) => (
                <Link to={`/company/feature-requests/${request.id}`} key={request.id}>
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
        
        {/* Other tabs would have similar content */}
        <TabsContent value="mine" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.filter(r => r.user_id === "current-user-id").length > 0 ? (
              sortedRequests
                .filter(r => r.user_id === "current-user-id")
                .map((request) => (
                  <Link to={`/company/feature-requests/${request.id}`} key={request.id}>
                    <FeatureRequestCard request={request} />
                  </Link>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">You haven't created any feature requests yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.filter(r => ["pending", "submitted"].includes(r.status)).length > 0 ? (
              sortedRequests
                .filter(r => ["pending", "submitted"].includes(r.status))
                .map((request) => (
                  <Link to={`/company/feature-requests/${request.id}`} key={request.id}>
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
        
        <TabsContent value="approved" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {sortedRequests.filter(r => ["approved", "in-progress", "completed"].includes(r.status as string)).length > 0 ? (
              sortedRequests
                .filter(r => ["approved", "in-progress", "completed"].includes(r.status as string))
                .map((request) => (
                  <Link to={`/company/feature-requests/${request.id}`} key={request.id}>
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
      </Tabs>
    </div>
  );
}
