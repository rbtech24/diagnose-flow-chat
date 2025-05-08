
import { useFeatureRequests } from '@/hooks/useFeatureRequests';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureRequestCard } from '@/components/feature-request/FeatureRequestCard';
import { NewFeatureRequestForm } from '@/components/feature-request/NewFeatureRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SearchIcon, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export function CompanyFeatureRequests() {
  const { featureRequests, isLoading, voteForFeature } = useFeatureRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const navigate = useNavigate();
  
  const filteredRequests = featureRequests.filter(
    req => req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           req.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-muted-foreground mt-1">
            Request new features and vote on existing requests
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setShowNewRequestForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Feature Request
          </Button>
        </div>
      </div>
      
      <div className="mb-6 max-w-md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feature requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <FeatureRequestCard 
              key={request.id}
              featureRequest={request}
              onVote={() => voteForFeature(request.id)}
              onClick={() => navigate(`/company/feature-requests/${request.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No feature requests found</h3>
          <p className="text-muted-foreground mb-4">Be the first to suggest a new feature!</p>
          <Button onClick={() => setShowNewRequestForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Feature Request
          </Button>
        </div>
      )}
      
      <Dialog open={showNewRequestForm} onOpenChange={setShowNewRequestForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit a Feature Request</DialogTitle>
          </DialogHeader>
          <NewFeatureRequestForm 
            onSubmit={() => setShowNewRequestForm(false)}
            onCancel={() => setShowNewRequestForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
