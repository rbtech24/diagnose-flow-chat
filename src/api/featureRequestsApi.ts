
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureComment } from '@/types/feature-request';

export async function fetchFeatureRequests(status?: string, companyId?: string): Promise<FeatureRequest[]> {
  try {
    let query = supabase
      .from('feature_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch feature requests: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchFeatureRequests:', error);
    throw error;
  }
}

export async function fetchFeatureRequestById(id: string): Promise<FeatureRequest> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch feature request: ${error.message}`);
    }

    if (!data) {
      throw new Error('Feature request not found');
    }

    return data;
  } catch (error) {
    console.error('Error in fetchFeatureRequestById:', error);
    throw error;
  }
}

export async function fetchFeatureComments(featureId: string): Promise<FeatureComment[]> {
  try {
    const { data, error } = await supabase
      .from('feature_comments')
      .select('*')
      .eq('feature_id', featureId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchFeatureComments:', error);
    throw error;
  }
}

export async function createFeatureRequest(requestData: Partial<FeatureRequest>): Promise<FeatureRequest> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .insert([{
        title: requestData.title,
        description: requestData.description,
        priority: requestData.priority || 'medium',
        status: requestData.status || 'submitted',
        user_id: requestData.user_id,
        company_id: requestData.company_id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create feature request: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createFeatureRequest:', error);
    throw error;
  }
}

export async function updateFeatureRequest(id: string, updateData: Partial<FeatureRequest>): Promise<FeatureRequest> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to update feature request: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateFeatureRequest:', error);
    throw error;
  }
}

export async function addFeatureComment(commentData: { feature_id: string; content: string }): Promise<FeatureComment> {
  try {
    const { data, error } = await supabase
      .from('feature_comments')
      .insert([{
        feature_id: commentData.feature_id,
        content: commentData.content,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to add comment: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in addFeatureComment:', error);
    throw error;
  }
}

export async function voteForFeature(featureId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('feature_votes')
      .select('id')
      .eq('feature_id', featureId)
      .eq('user_id', user.user.id)
      .single();

    if (existingVote) {
      return false; // User has already voted
    }

    // Add vote
    const { error: voteError } = await supabase
      .from('feature_votes')
      .insert([{
        feature_id: featureId,
        user_id: user.user.id,
      }]);

    if (voteError) {
      console.error('Supabase error:', voteError);
      throw new Error(`Failed to vote: ${voteError.message}`);
    }

    // Update vote count
    const { error: updateError } = await supabase.rpc('increment', {
      row_id: featureId,
      field_name: 'votes_count',
      table_name: 'feature_requests'
    });

    if (updateError) {
      console.error('Error updating vote count:', updateError);
    }

    return true;
  } catch (error) {
    console.error('Error in voteForFeature:', error);
    throw error;
  }
}
