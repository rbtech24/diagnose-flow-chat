
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureRequest } from "@/types/feature-request";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { emptyFeatureRequests } from "@/utils/placeholderData";

export default function AdminFeatureRequests() {
  const [requests, setRequests] = useState<FeatureRequest[]>(emptyFeatureRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateRequest = (title: string, description: string) => {
    const newRequest: FeatureRequest = {
      id: `request-${Date.now()}`,
      title,
      description,
      status: "under-review",
      category: "General",
      createdAt: new Date(),
      updatedAt: new Date(),
      score: 0,
      userId: "admin-1",
      user: {
        id: "admin-1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        avatarUrl: ""
      },
      votes: [],
      comments: []
    };
    
    setRequests([newRequest, ...requests]);
    setIsFormOpen(false);
  };

  const handleRequestClick = (requestId: string) => {
    navigate(`/admin/feature-requests/${requestId}`);
  };

  const filteredRequests = requests.filter(request => 
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const plannedRequests = filteredRequests.filter(r => r.status === "planned");
  const inProgressRequests = filteredRequests.filter(r => r.status === "in-progress");
  const completedRequests = filteredRequests.filter(r => r.status === "completed");
  const reviewRequests = filteredRequests.filter(r => r.status === "under-review");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-muted-foreground">View and manage feature requests</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Feature Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewFeatureRequestForm onSubmit={handleCreateRequest} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feature requests..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="under-review">
        <TabsList className="mb-6">
          <TabsTrigger value="under-review">
            Under Review <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{reviewRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="planned">
            Planned <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">{plannedRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-600">{inProgressRequests.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">{completedRequests.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="under-review" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewRequests.length > 0 ? (
            reviewRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                request={request} 
                onClick={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No feature requests under review</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planned" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedRequests.length > 0 ? (
            plannedRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                request={request} 
                onClick={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No planned feature requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressRequests.length > 0 ? (
            inProgressRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                request={request} 
                onClick={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No feature requests in progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                request={request} 
                onClick={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No completed feature requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
