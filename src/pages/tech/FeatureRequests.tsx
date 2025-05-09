
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, StarIcon } from "lucide-react";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { mockFeatureRequests } from "@/data/mockFeatureRequests";
import { useUserManagementStore } from "@/store/userManagementStore";
import { toast } from "sonner";
import { FeatureRequestStatus } from "@/types/feature-request";

export default function FeatureRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  // Get the current user
  const { users } = useUserManagementStore();
  const currentUser = users.find(user => user.role === 'tech') || users[0];
  
  // Filter feature requests based on search query and active tab
  const filteredRequests = mockFeatureRequests.filter(request => 
    (request.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     request.description.toLowerCase().includes(searchQuery.toLowerCase())) && 
    (activeTab === "all" || 
     (activeTab === "my-requests" && request.user_id === currentUser?.id) ||
     (activeTab === "submitted" && request.status === "submitted") || 
     (activeTab === "in-progress" && (request.status === "in_progress" || request.status === "in-progress")) || 
     (activeTab === "planned" && request.status === "planned") || 
     (activeTab === "completed" && request.status === "completed"))
  );

  const handleCreateRequest = (requestData: any) => {
    toast.success("Feature request submitted successfully!");
    setShowNewRequestForm(false);
  };

  const handleVoteRequest = (requestId: string) => {
    toast.success("Vote recorded successfully!");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Feature Requests</h1>
        <Button onClick={() => setShowNewRequestForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feature requests..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="planned">Planned</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No feature requests found</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              {searchQuery 
                ? "No requests match your search criteria. Try adjusting your search." 
                : "There are no feature requests in this category yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <FeatureRequestCard
              key={request.id}
              request={request}
              onVote={() => handleVoteRequest(request.id)}
              currentUserId={currentUser?.id || ''}
            />
          ))}
        </div>
      )}

      {showNewRequestForm && (
        <NewFeatureRequestForm
          onClose={() => setShowNewRequestForm(false)}
          onSubmit={handleCreateRequest}
          currentUserId={currentUser?.id || ''}
        />
      )}
    </div>
  );
}
