
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureRequest, FeatureRequestStatus } from "@/types/feature-request";
import { FeatureRequestCard } from "@/components/feature-request/FeatureRequestCard";
import { NewFeatureRequestForm } from "@/components/feature-request/NewFeatureRequestForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { emptyFeatureRequests } from "@/utils/placeholderData";
import { convertToFeatureRequestUser } from "@/utils/userConverter";
import { placeholderUser } from "@/utils/placeholderData";

export default function TechFeatureRequests() {
  const [requests, setRequests] = useState<FeatureRequest[]>(emptyFeatureRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreateRequest = (values: { title?: string; description?: string; priority?: "low" | "medium" | "high" | "critical" }) => {
    if (!values.title || !values.description) return;
    setIsSubmitting(true);
    
    const frUser = convertToFeatureRequestUser(placeholderUser);
    
    const newRequest: FeatureRequest = {
      id: `request-${Date.now()}`,
      title: values.title,
      description: values.description,
      status: "under-review" as FeatureRequestStatus,
      priority: values.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: frUser,
      votes: [],
      score: 0,
      comments: [],
      category: "General"
    };
    
    // Simulate API call
    setTimeout(() => {
      setRequests([newRequest, ...requests]);
      setIsFormOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleRequestClick = (requestId: string) => {
    navigate(`/tech/feature-requests/${requestId}`);
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
          <p className="text-muted-foreground">Request and vote on new features</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Feature Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NewFeatureRequestForm onSubmit={handleCreateRequest} isSubmitting={isSubmitting} />
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

        <TabsContent value="under-review" className="space-y-4">
          {reviewRequests.length > 0 ? (
            reviewRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                featureRequest={request} 
                onViewDetails={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No feature requests under review</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planned" className="space-y-4">
          {plannedRequests.length > 0 ? (
            plannedRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                featureRequest={request} 
                onViewDetails={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No planned feature requests</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressRequests.length > 0 ? (
            inProgressRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                featureRequest={request} 
                onViewDetails={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No feature requests in progress</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRequests.length > 0 ? (
            completedRequests.map((request) => (
              <FeatureRequestCard 
                key={request.id} 
                featureRequest={request} 
                onViewDetails={() => handleRequestClick(request.id)} 
              />
            ))
          ) : (
            <Card>
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
