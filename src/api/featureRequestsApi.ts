
import { supabase } from "@/integrations/supabase/client";
import { FeatureRequest, FeatureComment } from "@/types/feature-request";

/**
 * Fetch feature requests
 * @param status Filter by request status (optional)
 * @param companyId Filter by company ID (optional)
 * @returns Array of feature requests
 */
export async function fetchFeatureRequests(
  status?: string, 
  companyId?: string
): Promise<FeatureRequest[]> {
  let query = supabase.from('feature_requests').select(`
    *,
    created_by_user:user_id(
      name,
      email,
      avatar_url,
      role
    )
  `);
  
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
    console.error('Error fetching feature requests:', error);
    throw error;
  }
  
  // Process data to add additional fields we need
  const requests = await Promise.all((data || []).map(async (item) => {
    // Count votes
    const { count: votesCount, error: votesError } = await supabase
      .from('feature_votes')
      .select('*', { count: 'exact' })
      .eq('feature_id', item.id);
      
    if (votesError) {
      console.error(`Error counting votes for feature request ${item.id}:`, votesError);
    }
    
    // Count comments
    const { count: commentsCount, error: commentsError } = await supabase
      .from('feature_comments')
      .select('*', { count: 'exact' })
      .eq('feature_id', item.id);
      
    if (commentsError) {
      console.error(`Error counting comments for feature request ${item.id}:`, commentsError);
    }
    
    // Check if current user has voted
    const userId = (await supabase.auth.getUser()).data.user?.id;
    let userHasVoted = false;
    
    if (userId) {
      const { data: voteData, error: userVoteError } = await supabase
        .from('feature_votes')
        .select('id')
        .eq('feature_id', item.id)
        .eq('user_id', userId)
        .single();
        
      userHasVoted = !!voteData;
      
      if (userVoteError && userVoteError.code !== 'PGRST116') { // Not found error is expected
        console.error(`Error checking if user voted for feature request ${item.id}:`, userVoteError);
      }
    }
    
    return {
      ...item,
      votes_count: votesCount || 0,
      comments_count: commentsCount || 0,
      user_has_voted: userHasVoted
    } as FeatureRequest;
  }));
  
  return requests;
}

/**
 * Fetch a single feature request by ID
 * @param requestId Feature request ID
 * @returns Feature request object
 */
export async function fetchFeatureRequestById(requestId: string): Promise<FeatureRequest> {
  const { data, error } = await supabase
    .from('feature_requests')
    .select(`
      *,
      created_by_user:user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .eq('id', requestId)
    .single();
  
  if (error) {
    console.error(`Error fetching feature request ${requestId}:`, error);
    throw error;
  }
  
  // Get votes count
  const { count: votesCount, error: votesError } = await supabase
    .from('feature_votes')
    .select('*', { count: 'exact' })
    .eq('feature_id', requestId);
    
  if (votesError) {
    console.error(`Error counting votes for feature request ${requestId}:`, votesError);
  }
  
  // Get comments count
  const { count: commentsCount, error: commentsError } = await supabase
    .from('feature_comments')
    .select('*', { count: 'exact' })
    .eq('feature_id', requestId);
    
  if (commentsError) {
    console.error(`Error counting comments for feature request ${requestId}:`, commentsError);
  }
  
  // Check if current user has voted
  const userId = (await supabase.auth.getUser()).data.user?.id;
  let userHasVoted = false;
  
  if (userId) {
    const { data: voteData, error: userVoteError } = await supabase
      .from('feature_votes')
      .select('id')
      .eq('feature_id', requestId)
      .eq('user_id', userId)
      .single();
      
    userHasVoted = !!voteData;
    
    if (userVoteError && userVoteError.code !== 'PGRST116') { // Not found error is expected
      console.error(`Error checking if user voted for feature request ${requestId}:`, userVoteError);
    }
  }
  
  return {
    ...data,
    votes_count: votesCount || 0,
    comments_count: commentsCount || 0,
    user_has_voted: userHasVoted
  } as unknown as FeatureRequest;
}

/**
 * Fetch comments for a specific feature request
 * @param requestId Feature request ID
 * @returns Array of feature comments
 */
export async function fetchFeatureComments(requestId: string): Promise<FeatureComment[]> {
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
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error(`Error fetching comments for feature request ${requestId}:`, error);
    throw error;
  }
  
  return data as FeatureComment[];
}

/**
 * Create a new feature request
 * @param requestData Feature request data
 * @returns Created feature request
 */
export async function createFeatureRequest(requestData: Partial<FeatureRequest>): Promise<FeatureRequest> {
  // Make sure required fields are present
  if (!requestData.title || !requestData.description) {
    throw new Error('Missing required fields for feature request creation');
  }

  const { data, error } = await supabase
    .from('feature_requests')
    .insert({
      title: requestData.title,
      description: requestData.description,
      status: requestData.status || 'pending',
      priority: requestData.priority || 'medium',
      user_id: (await supabase.auth.getUser()).data.user?.id,
      company_id: requestData.company_id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating feature request:', error);
    throw error;
  }
  
  return {
    ...data,
    votes_count: 0,
    comments_count: 0,
    user_has_voted: false
  } as FeatureRequest;
}

/**
 * Add a comment to a feature request
 * @param commentData Comment data
 * @returns Created comment
 */
export async function addFeatureComment(commentData: { feature_id: string, content: string }): Promise<FeatureComment> {
  // Make sure required fields are present
  if (!commentData.content || !commentData.feature_id) {
    throw new Error('Missing required fields for comment creation');
  }

  const { data, error } = await supabase
    .from('feature_comments')
    .insert({
      content: commentData.content,
      feature_id: commentData.feature_id,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding comment to feature request:', error);
    throw error;
  }
  
  return data as FeatureComment;
}

/**
 * Vote for a feature request
 * @param featureId Feature request ID
 * @returns True if vote was added, false if already voted
 */
export async function voteForFeature(featureId: string): Promise<boolean> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    throw new Error('You must be logged in to vote');
  }
  
  // Check if user already voted
  const { data: existingVote, error: checkError } = await supabase
    .from('feature_votes')
    .select('id')
    .eq('feature_id', featureId)
    .eq('user_id', userId)
    .single();
    
  if (existingVote) {
    return false; // User already voted
  }
  
  if (checkError && checkError.code !== 'PGRST116') { // Not found error is expected
    console.error(`Error checking vote for feature ${featureId}:`, checkError);
    throw checkError;
  }
  
  // Add vote
  const { error } = await supabase
    .from('feature_votes')
    .insert({
      feature_id: featureId,
      user_id: userId
    });
  
  if (error) {
    console.error(`Error voting for feature ${featureId}:`, error);
    throw error;
  }
  
  return true;
}

/**
 * Update a feature request
 * @param requestId Feature request ID
 * @param updateData Data to update
 * @returns Updated feature request
 */
export async function updateFeatureRequest(
  requestId: string, 
  updateData: Partial<FeatureRequest>
): Promise<FeatureRequest> {
  const { data, error } = await supabase
    .from('feature_requests')
    .update(updateData)
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating feature request ${requestId}:`, error);
    throw error;
  }
  
  return data as FeatureRequest;
}
