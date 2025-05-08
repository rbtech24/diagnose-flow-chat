
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureRequestStatus, FeatureRequestPriority } from '@/types/feature-request';
import { toast } from 'sonner';
import { mockFeatureRequests } from '@/data/mockFeatureRequests';

export function useFeatureRequests(companyId?: string) {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, use mock data to avoid issues with database integration
      // Later, this will be replaced with actual Supabase queries when the DB schema is properly set up
      let data = [...mockFeatureRequests];
      
      // Filter by company if companyId is provided
      if (companyId) {
        data = data.filter(req => req.company_id === companyId);
      }
      
      setFeatureRequests(data);
    } catch (err) {
      console.error('Error fetching feature requests:', err);
      setError('Failed to load feature requests');
      toast.error('Error loading feature requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureRequests();
  }, [companyId]);

  // Function to vote for a feature request
  const voteForFeature = async (featureId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to vote');
        return;
      }
      
      // Update local state (in a real implementation, this would interact with the database)
      setFeatureRequests(prev => 
        prev.map(feature => 
          feature.id === featureId 
            ? { 
                ...feature, 
                votes_count: feature.user_has_voted 
                  ? Math.max(0, feature.votes_count - 1) 
                  : feature.votes_count + 1,
                user_has_voted: !feature.user_has_voted
              }
            : feature
        )
      );
      
      toast.success(featureRequests.find(f => f.id === featureId)?.user_has_voted 
        ? 'Vote removed' 
        : 'Vote added'
      );
    } catch (err) {
      console.error('Error voting for feature:', err);
      toast.error('Error processing your vote');
    }
  };

  return { 
    featureRequests, 
    isLoading, 
    error, 
    refreshFeatureRequests: fetchFeatureRequests,
    voteForFeature
  };
}
