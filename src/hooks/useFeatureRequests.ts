
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest } from '@/types/feature-request';
import { toast } from 'sonner';

export function useFeatureRequests(companyId?: string) {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Query based on whether we want company-specific or all feature requests
      const query = supabase
        .from('feature_requests')
        .select(`
          *,
          created_by_user:user_id(
            id,
            name,
            email,
            role,
            avatar_url
          ),
          votes_count:feature_votes(count),
          comments_count:ticket_comments(count)
        `)
        .order('created_at', { ascending: false });
      
      // Filter by company if companyId is provided
      if (companyId) {
        query.eq('company_id', companyId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Check if current user has voted
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && data) {
        // Get all votes by current user
        const { data: userVotes } = await supabase
          .from('feature_votes')
          .select('feature_id')
          .eq('user_id', user.id);
        
        const userVoteMap = new Map(userVotes?.map(vote => [vote.feature_id, true]) || []);
        
        // Format the data to match our FeatureRequest type
        const formattedRequests: FeatureRequest[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          status: item.status,
          priority: item.priority || 'medium',
          company_id: item.company_id,
          user_id: item.user_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          votes_count: item.votes_count || 0,
          comments_count: item.comments_count || 0,
          user_has_voted: userVoteMap.has(item.id),
          created_by_user: item.created_by_user || {
            id: 'unknown',
            name: 'Unknown User',
            email: '',
            role: 'user',
            avatar_url: ''
          }
        }));
        
        setFeatureRequests(formattedRequests);
      }
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
      
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('feature_votes')
        .select()
        .eq('feature_id', featureId)
        .eq('user_id', user.id)
        .single();
      
      if (existingVote) {
        // Remove vote
        await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', featureId)
          .eq('user_id', user.id);
          
        // Update local state
        setFeatureRequests(prev => 
          prev.map(feature => 
            feature.id === featureId 
              ? { 
                  ...feature, 
                  votes_count: Math.max(0, feature.votes_count - 1),
                  user_has_voted: false
                }
              : feature
          )
        );
        
        toast.success('Vote removed');
      } else {
        // Add vote
        await supabase
          .from('feature_votes')
          .insert({
            feature_id: featureId,
            user_id: user.id
          });
          
        // Update local state  
        setFeatureRequests(prev => 
          prev.map(feature => 
            feature.id === featureId 
              ? { 
                  ...feature, 
                  votes_count: feature.votes_count + 1,
                  user_has_voted: true
                }
              : feature
          )
        );
        
        toast.success('Vote added');
      }
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
