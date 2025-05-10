
import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureComment } from '@/types/feature-request';
import { useUserManagementStore } from '@/store/userManagementStore';

// Function to fetch all feature requests
export const fetchFeatureRequests = async (status?: string, companyId?: string): Promise<FeatureRequest[]> => {
  try {
    let query = supabase
      .from('feature_requests')
      .select(`
        *,
        created_by_user:user_id(*)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching feature requests:', error);
      return [];
    }

    // Transform data to match FeatureRequest type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status as FeatureRequest['status'],
      priority: item.priority as FeatureRequest['priority'],
      company_id: item.company_id,
      user_id: item.user_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      votes_count: item.votes_count || 0,
      user_has_voted: item.user_has_voted || false,
      comments_count: item.comments_count || 0,
      created_by_user: item.created_by_user ? {
        name: item.created_by_user.name || 'Unknown User',
        email: item.created_by_user.email || '',
        avatar_url: item.created_by_user.avatar_url,
        role: (item.created_by_user.role || 'tech') as "admin" | "company" | "tech"
      } : undefined
    }));
  } catch (err) {
    console.error('Error in fetchFeatureRequests:', err);
    return [];
  }
};

// Function to fetch a feature request by ID
export const fetchFeatureRequestById = async (id: string): Promise<FeatureRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .select(`
        *,
        created_by_user:user_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching feature request:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as FeatureRequest['status'],
      priority: data.priority as FeatureRequest['priority'],
      company_id: data.company_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: data.votes_count || 0,
      user_has_voted: data.user_has_voted || false,
      comments_count: data.comments_count || 0,
      created_by_user: data.created_by_user ? {
        name: data.created_by_user.name || 'Unknown User',
        email: data.created_by_user.email || '',
        avatar_url: data.created_by_user.avatar_url,
        role: (data.created_by_user.role || 'tech') as "admin" | "company" | "tech"
      } : undefined
    };
  } catch (err) {
    console.error('Error in fetchFeatureRequestById:', err);
    return null;
  }
};

// Function to fetch comments for a feature request
export const fetchFeatureComments = async (requestId: string): Promise<FeatureComment[]> => {
  try {
    const { data, error } = await supabase
      .from('feature_request_comments')
      .select(`
        *,
        created_by_user:user_id(*)
      `)
      .eq('feature_id', requestId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      feature_id: item.feature_id,
      user_id: item.user_id,
      content: item.content,
      created_at: item.created_at,
      created_by_user: item.created_by_user ? {
        name: item.created_by_user.name || 'Unknown User',
        email: item.created_by_user.email || '',
        avatar_url: item.created_by_user.avatar_url,
        role: (item.created_by_user.role || 'tech') as "admin" | "company" | "tech"
      } : undefined
    }));
  } catch (err) {
    console.error('Error in fetchFeatureComments:', err);
    return [];
  }
};

// Function to create a feature request
export const createFeatureRequest = async (requestData: Partial<FeatureRequest>): Promise<FeatureRequest> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('feature_requests')
      .insert([{
        title: requestData.title,
        description: requestData.description,
        status: requestData.status || 'pending',
        priority: requestData.priority || 'medium',
        user_id: currentUser.user.id,
        company_id: requestData.company_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating feature request:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as FeatureRequest['status'],
      priority: data.priority as FeatureRequest['priority'],
      company_id: data.company_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: 0,
      user_has_voted: false,
      comments_count: 0
    };
  } catch (err) {
    console.error('Error in createFeatureRequest:', err);
    throw err;
  }
};

// Function to update a feature request
export const updateFeatureRequest = async (requestId: string, updateData: Partial<FeatureRequest>): Promise<FeatureRequest> => {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .update({
        title: updateData.title,
        description: updateData.description,
        status: updateData.status,
        priority: updateData.priority
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating feature request:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as FeatureRequest['status'],
      priority: data.priority as FeatureRequest['priority'],
      company_id: data.company_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: data.votes_count || 0,
      user_has_voted: data.user_has_voted || false,
      comments_count: data.comments_count || 0
    };
  } catch (err) {
    console.error('Error in updateFeatureRequest:', err);
    throw err;
  }
};

// Function to vote for a feature request
export const voteForFeature = async (requestId: string): Promise<boolean> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      throw new Error('User not authenticated');
    }

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('feature_request_votes')
      .select('*')
      .eq('feature_id', requestId)
      .eq('user_id', currentUser.user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing vote:', checkError);
      return false;
    }

    // If vote exists, return false (don't allow double voting)
    if (existingVote) {
      return false;
    }

    // Create new vote
    const { error: insertError } = await supabase
      .from('feature_request_votes')
      .insert([{
        feature_id: requestId,
        user_id: currentUser.user.id
      }]);

    if (insertError) {
      console.error('Error creating vote:', insertError);
      return false;
    }

    // Update vote count on the feature request
    await supabase.rpc('increment', {
      row_id: requestId,
      field_name: 'votes_count',
      table_name: 'feature_requests'
    });

    return true;
  } catch (err) {
    console.error('Error in voteForFeature:', err);
    return false;
  }
};

// Function to add a comment to a feature request
export const addFeatureComment = async (commentData: { feature_id: string; content: string }): Promise<FeatureComment> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('feature_request_comments')
      .insert([{
        feature_id: commentData.feature_id,
        user_id: currentUser.user.id,
        content: commentData.content
      }])
      .select(`
        *,
        created_by_user:user_id(*)
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    // Increment comments count on the feature request
    await supabase.rpc('increment', {
      row_id: commentData.feature_id,
      field_name: 'comments_count',
      table_name: 'feature_requests'
    });

    return {
      id: data.id,
      feature_id: data.feature_id,
      user_id: data.user_id,
      content: data.content,
      created_at: data.created_at,
      created_by_user: data.created_by_user ? {
        name: data.created_by_user.name || 'Unknown User',
        email: data.created_by_user.email || '',
        avatar_url: data.created_by_user.avatar_url,
        role: (data.created_by_user.role || 'tech') as "admin" | "company" | "tech"
      } : undefined
    };
  } catch (err) {
    console.error('Error in addFeatureComment:', err);
    throw err;
  }
};
