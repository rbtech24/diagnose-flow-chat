
import { FeatureRequest } from "@/types/feature-request";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation
export const getFeatureRequests = async (
  status?: string,
  companyId?: string
): Promise<FeatureRequest[]> => {
  try {
    console.log('Fetching feature requests from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      let query = supabase
        .from('feature_requests')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          user_id,
          company_id,
          votes_count,
          comments_count,
          user_has_voted,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      return await query;
    });

    if (!result.success) {
      console.error('Failed to fetch feature requests:', result.error);
      return [];
    }

    // Transform database data to FeatureRequest type
    const requests: FeatureRequest[] = (result.data || []).map(request => ({
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status as 'submitted' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected',
      priority: request.priority as 'low' | 'medium' | 'high',
      userId: request.user_id,
      companyId: request.company_id,
      votes_count: request.votes_count || 0,
      comments_count: request.comments_count || 0,
      user_has_voted: request.user_has_voted || false,
      createdAt: new Date(request.created_at),
      updatedAt: new Date(request.updated_at)
    }));

    console.log(`Successfully fetched ${requests.length} feature requests`);
    return requests;
  } catch (error) {
    console.error('Error fetching feature requests:', error);
    return [];
  }
};

// Real-time subscription for feature requests
export const subscribeFeatureRequestsUpdates = (
  companyId: string,
  onUpdate: (requests: FeatureRequest[]) => void
) => {
  console.log('Setting up real-time subscription for feature requests...');
  
  return SupabaseIntegration.handleRealtimeSubscription(
    'feature_requests',
    async () => {
      const updatedRequests = await getFeatureRequests(undefined, companyId);
      onUpdate(updatedRequests);
    }
  );
};
