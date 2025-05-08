
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureRequestCard } from '@/components/feature-request/FeatureRequestCard';
import { NewFeatureRequestForm } from '@/components/feature-request/NewFeatureRequestForm';
import { PlusCircle, Filter } from 'lucide-react';
import { useFeatureRequests } from '@/hooks/useFeatureRequests';
import { FeatureRequest } from '@/types/feature-request';

export function CompanyFeatureRequests() {
  const navigate = useNavigate();
  const { featureRequests, isLoading, error, refreshFeatureRequests, voteForFeature } = useFeatureRequests();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter requests based on active tab
  const filteredRequests = featureRequests.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === 'pending' || request.status === 'submitted';
    if (activeTab === 'approved') return request.status === 'approved' || request.status === 'in-progress';
    if (activeTab === 'completed') return request.status === 'completed';
    if (activeTab === 'rejected') return request.status === 'rejected';
    return true;
  });

  const handleVote = async (featureId: string) => {
    await voteForFeature(featureId);
  };

  const handleRequestClick = (id: string) => {
    navigate(`/company/feature-requests/${id}`);
  };

  const handleNewRequestSubmit = async () => {
    setDialogOpen(false);
    await refreshFeatureRequests();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-muted-foreground mt-1">
            View and vote on feature requests for the platform
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Feature Request</DialogTitle>
              <DialogDescription>
                Describe the feature you'd like us to add to the platform.
              </DialogDescription>
            </DialogHeader>
            <NewFeatureRequestForm 
              onSubmit={handleNewRequestSubmit} 
              onCancel={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* All requests content */}
        <TabsContent value={activeTab} forceMount className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div>Loading feature requests...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div>Error loading feature requests. Please try again.</div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[300px] border rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No feature requests found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'all' 
                  ? "Be the first to suggest a new feature."
                  : "No requests in this category yet."}
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map(request => (
                <FeatureRequestCard
                  key={request.id}
                  request={request}
                  onVote={() => handleVote(request.id)}
                  onClick={() => handleRequestClick(request.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
