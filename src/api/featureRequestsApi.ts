
import { supabase } from "@/integrations/supabase/client";
import { FeatureRequest, FeatureComment } from "@/types/feature-request";

/**
 * Fetch feature requests
 * @param status Filter by feature status (optional)
 * @param companyId Filter by company ID (optional)
 * @returns Array of feature requests
 */
export async function fetchFeatureRequests(
  status?: string, 
  companyId?: string
): Promise<FeatureRequest[]> {
  try {
    let query = supabase.from('feature_requests').select('*');
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    // Order by created_at timestamp (newest first)
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform to expected type with safe defaults
    return data.map(request => ({
      id: request.id,
      title: request.title,
      description: request.description,
      status: request.status || 'pending',
      priority: request.priority || 'medium',
      company_id: request.company_id,
      user_id: request.user_id || '',
      created_at: request.created_at,
      updated_at: request.updated_at,
      votes_count: request.votes_count || 0,
      user_has_voted: request.user_has_voted || false,
      comments_count: request.comments_count || 0,
      created_by_user: request.created_by_user ? {
        name: typeof request.created_by_user === 'object' && request.created_by_user !== null && 'name' in request.created_by_user ? 
          String(request.created_by_user.name) : 'Unknown User',
        email: typeof request.created_by_user === 'object' && request.created_by_user !== null && 'email' in request.created_by_user ? 
          String(request.created_by_user.email) : '',
        role: typeof request.created_by_user === 'object' && request.created_by_user !== null && 'role' in request.created_by_user && 
          ['admin', 'company', 'tech'].includes(String(request.created_by_user.role)) ? 
          String(request.created_by_user.role) as "admin" | "company" | "tech" : 'tech',
        avatar_url: typeof request.created_by_user === 'object' && request.created_by_user !== null && 'avatar_url' in request.created_by_user ? 
          String(request.created_by_user.avatar_url) : undefined
      } : undefined
    }));
    
  } catch (error) {
    console.error('Error fetching feature requests:', error);
    throw error;
  }
}

/**
 * Fetch a single feature request by ID
 * @param requestId Request ID
 * @returns Feature request object
 */
export async function fetchFeatureRequestById(requestId: string): Promise<FeatureRequest> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error(`Feature request with ID ${requestId} not found`);
    }
    
    // Fetch user data for the created_by_user field
    let createdByUser;
    if (data.user_id) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user_id)
        .maybeSingle();
      
      if (!userError && userData) {
        createdByUser = {
          name: userData.full_name || 'Unknown User',
          email: userData.email || '',
          role: (userData.role as "admin" | "company" | "tech") || 'tech',
          avatar_url: userData.avatar_url
        };
      }
    }
    
    // Format the response with proper typing
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      company_id: data.company_id,
      user_id: data.user_id || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: data.votes_count || 0,
      user_has_voted: data.user_has_voted || false,
      comments_count: data.comments_count || 0,
      created_by_user: createdByUser
    };
    
  } catch (error) {
    console.error(`Error fetching feature request ${requestId}:`, error);
    throw error;
  }
}

/**
 * Fetch comments for a specific feature request
 * @param requestId Request ID
 * @returns Array of feature comments
 */
export async function fetchFeatureComments(requestId: string): Promise<FeatureComment[]> {
  try {
    const { data, error } = await supabase
      .from('feature_comments')
      .select(`
        *,
        created_by_user:user_id(
          name,
          email,
          avatar_url,
          role
        )
      `)
      .eq('feature_id', requestId)
      .order('created_at');
    
    if (error) {
      throw error;
    }
    
    // Format the response with proper typing
    return data.map(comment => ({
      id: comment.id,
      feature_id: comment.feature_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      created_by_user: comment.created_by_user ? {
        name: typeof comment.created_by_user === 'object' && comment.created_by_user !== null && 'name' in comment.created_by_user ? 
          String(comment.created_by_user.name) : 'Unknown User',
        email: typeof comment.created_by_user === 'object' && comment.created_by_user !== null && 'email' in comment.created_by_user ? 
          String(comment.created_by_user.email) : '',
        role: typeof comment.created_by_user === 'object' && comment.created_by_user !== null && 'role' in comment.created_by_user && 
          ['admin', 'company', 'tech'].includes(String(comment.created_by_user.role)) ? 
          String(comment.created_by_user.role) as "admin" | "company" | "tech" : 'tech',
        avatar_url: typeof comment.created_by_user === 'object' && comment.created_by_user !== null && 'avatar_url' in comment.created_by_user ? 
          String(comment.created_by_user.avatar_url) : undefined
      } : undefined
    }));
    
  } catch (error) {
    console.error(`Error fetching comments for feature request ${requestId}:`, error);
    throw error;
  }
}

/**
 * Create a new feature request
 * @param requestData Request data to create
 * @returns Created feature request
 */
export async function createFeatureRequest(requestData: Partial<FeatureRequest>): Promise<FeatureRequest> {
  try {
    // Get current user info
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('You need to be logged in to create a feature request');
    }
  
    // Make sure required fields are present
    if (!requestData.title || !requestData.description) {
      throw new Error('Missing required fields for feature request creation');
    }

    const { data, error } = await supabase
      .from('feature_requests')
      .insert({
        title: requestData.title,
        description: requestData.description,
        status: requestData.status || 'submitted',
        priority: requestData.priority || 'medium',
        company_id: requestData.company_id,
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Get user profile for created_by_user
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
      
    // Format the response with proper typing
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status || 'submitted',
      priority: data.priority || 'medium',
      company_id: data.company_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: 0,
      user_has_voted: false,
      comments_count: 0,
      created_by_user: profileData ? {
        name: profileData.full_name || 'Unknown User',
        email: profileData.email || '',
        role: (profileData.role as "admin" | "company" | "tech") || 'tech',
        avatar_url: profileData.avatar_url
      } : undefined
    };
    
  } catch (error) {
    console.error('Error creating feature request:', error);
    throw error;
  }
}

/**
 * Add a comment to a feature request
 * @param commentData Comment data to add
 * @returns Created comment
 */
export async function addFeatureComment(commentData: { content: string, feature_id: string }): Promise<FeatureComment> {
  try {
    // Get current user info
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('You need to be logged in to comment on a feature request');
    }
  
    // Make sure required fields are present
    if (!commentData.content || !commentData.feature_id) {
      throw new Error('Missing required fields for comment creation');
    }

    const { data, error } = await supabase
      .from('feature_comments')
      .insert({
        content: commentData.content,
        feature_id: commentData.feature_id,
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Increment comment count on the feature request
    await supabase.rpc('increment', {
      row_id: commentData.feature_id,
      field_name: 'comments_count',
      table_name: 'feature_requests'
    }).then(
      result => {},
      err => console.error('Error incrementing comment count:', err)
    );
    
    // Get user profile for created_by_user
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
    
    // Format the response with proper typing
    return {
      id: data.id,
      feature_id: data.feature_id,
      user_id: data.user_id,
      content: data.content,
      created_at: data.created_at,
      created_by_user: profileData ? {
        name: profileData.full_name || 'Unknown User',
        email: profileData.email || '',
        role: (profileData.role as "admin" | "company" | "tech") || 'tech',
        avatar_url: profileData.avatar_url
      } : undefined
    };
    
  } catch (error) {
    console.error('Error adding feature comment:', error);
    throw error;
  }
}

/**
 * Update a feature request
 * @param requestId Request ID to update
 * @param updateData Data to update
 * @returns Updated feature request
 */
export async function updateFeatureRequest(
  requestId: string, 
  updateData: Partial<FeatureRequest>
): Promise<FeatureRequest> {
  try {
    const { data, error } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Format the response with proper typing
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      company_id: data.company_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes_count: data.votes_count || 0,
      user_has_voted: data.user_has_voted || false,
      comments_count: data.comments_count || 0,
      created_by_user: data.created_by_user
    };
    
  } catch (error) {
    console.error(`Error updating feature request ${requestId}:`, error);
    throw error;
  }
}

/**
 * Vote for a feature request
 * @param requestId Request ID to vote for
 * @returns Boolean indicating if vote was successful
 */
export async function voteForFeature(requestId: string): Promise<boolean> {
  try {
    // Get current user info
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('You need to be logged in to vote for a feature request');
    }
    
    // Check if user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('feature_votes')
      .select('*')
      .eq('feature_id', requestId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If user has already voted, return false
    if (existingVote) {
      return false;
    }
    
    // Create a new vote
    const { error: voteError } = await supabase
      .from('feature_votes')
      .insert({
        feature_id: requestId,
        user_id: userData.user.id
      });
    
    if (voteError) {
      throw voteError;
    }
    
    // Increment votes count on the feature request
    await supabase.rpc('increment', {
      row_id: requestId,
      field_name: 'votes_count',
      table_name: 'feature_requests'
    });
    
    return true;
    
  } catch (error) {
    console.error(`Error voting for feature request ${requestId}:`, error);
    throw error;
  }
}
