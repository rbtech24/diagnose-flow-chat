import { supabase } from "@/integrations/supabase/client";
import { FeatureRequest, FeatureComment, FeatureRequestStatus, FeatureRequestPriority } from "@/types/feature-request";

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
  const requests = await Promise.all((data || []).map(async (item: any) => {
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
    
    // Ensure we have a valid created_by_user object
    let createdByUser = {
      name: 'Unknown User',
      email: '',
      role: 'user',
      avatar_url: null
    };
    
    if (item.created_by_user && typeof item.created_by_user === 'object') {
      // Handle case when created_by_user is an object (successful join)
      if (!('error' in item.created_by_user)) {
        const userData = item.created_by_user as Record<string, any>;
        createdByUser = {
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          role: userData.role || 'user',
          avatar_url: userData.avatar_url || null
        };
      }
    }
    
    // Create a properly typed FeatureRequest object
    const featureRequest: FeatureRequest = {
      id: item.id,
      title: item.title,
      description: item.description,
      status: (item.status || 'pending') as FeatureRequestStatus,
      priority: ((item as any).priority || 'medium') as FeatureRequestPriority, // Cast to any to handle missing property
      company_id: item.company_id,
      user_id: item.user_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      votes_count: votesCount || 0,
      comments_count: commentsCount || 0,
      user_has_voted: userHasVoted,
      created_by_user: createdByUser
    };
    
    return featureRequest;
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
  
  // Ensure we have a valid created_by_user object
  let createdByUser = {
    name: 'Unknown User',
    email: '',
    role: 'user' as "admin" | "company" | "tech",
    avatar_url: null
  };
  
  if (data.created_by_user && typeof data.created_by_user === 'object') {
    // Handle case when created_by_user is an object (successful join)
    if (!('error' in data.created_by_user!)) {
      const userData = data.created_by_user as Record<string, any>;
      createdByUser = {
        name: userData.name || 'Unknown User',
        email: userData.email || '',
        role: (userData.role || 'user') as "admin" | "company" | "tech",
        avatar_url: userData.avatar_url || null
      };
    }
  }
  
  // Create a properly typed FeatureRequest object
  const featureRequest: FeatureRequest = {
    id: data.id,
    title: data.title,
    description: data.description,
    status: (data.status || 'pending') as FeatureRequestStatus,
    priority: ((data as any).priority || 'medium') as FeatureRequestPriority, // Cast to any to handle missing property
    company_id: data.company_id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    votes_count: votesCount || 0,
    comments_count: commentsCount || 0,
    user_has_voted: userHasVoted,
    created_by_user: createdByUser
  };
  
  return featureRequest;
}

/**
 * Fetch comments for a specific feature request
 * @param requestId Feature request ID
 * @returns Array of feature comments
 */
export async function fetchFeatureComments(requestId: string): Promise<FeatureComment[]> {
  // Use the proper feature_comments table now that it exists
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
  
  // Process and type the comments
  const comments = (data || []).map((comment: any) => {
    // Ensure we have a valid created_by_user object
    let createdByUser = {
      name: 'Unknown User',
      email: '',
      role: 'user' as "admin" | "company" | "tech",
      avatar_url: null
    };
    
    if (comment.created_by_user && typeof comment.created_by_user === 'object') {
      // Handle case when created_by_user is an object (successful join)
      if (!('error' in comment.created_by_user)) {
        const userData = comment.created_by_user as Record<string, any>;
        createdByUser = {
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          role: (userData.role || 'user') as "admin" | "company" | "tech",
          avatar_url: userData.avatar_url || null
        };
      }
    }
    
    return {
      id: comment.id,
      feature_id: comment.feature_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      created_by_user: createdByUser
    } as FeatureComment;
  });
  
  return comments;
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
  
  // Create a properly typed FeatureRequest object
  const featureRequest: FeatureRequest = {
    id: data.id,
    title: data.title,
    description: data.description,
    status: (data.status || 'pending') as FeatureRequestStatus,
    priority: ((data as any).priority || 'medium') as FeatureRequestPriority, // Cast to any to handle missing property
    company_id: data.company_id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    votes_count: 0,
    comments_count: 0,
    user_has_voted: false,
    created_by_user: { 
      name: 'Current User',
      email: '',
      role: 'user' as "admin" | "company" | "tech",
      avatar_url: null
    }
  };
  
  return featureRequest;
}

/**
 * Add a comment to a feature request
 * @param commentData Comment data
 * @returns Created comment
 */
export async function addFeatureComment(commentData: { feature_id: string, content: string }): Promise<FeatureComment> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    throw new Error('You must be logged in to comment');
  }
  
  const { data, error } = await supabase
    .from('feature_comments')
    .insert({
      feature_id: commentData.feature_id,
      user_id: userId,
      content: commentData.content
    })
    .select(`
      *,
      created_by_user:user_id(
        name, 
        email, 
        avatar_url,
        role
      )
    `)
    .single();
  
  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  
  // Ensure we have a valid created_by_user object
  let createdByUser = {
    name: 'Current User',
    email: 'user@example.com',
    role: 'user' as "admin" | "company" | "tech",
    avatar_url: null
  };
  
  if (data.created_by_user && typeof data.created_by_user === 'object') {
    // Handle case when created_by_user is an object (successful join)
    if (!('error' in data.created_by_user!)) {
      const userData = data.created_by_user as Record<string, any>;
      createdByUser = {
        name: userData.name || 'Current User',
        email: userData.email || 'user@example.com',
        role: (userData.role || 'user') as "admin" | "company" | "tech",
        avatar_url: userData.avatar_url || null
      };
    }
  }
  
  // Create a properly typed FeatureComment object
  const comment: FeatureComment = {
    id: data.id,
    feature_id: data.feature_id,
    user_id: data.user_id,
    content: data.content,
    created_at: data.created_at,
    created_by_user: createdByUser
  };
  
  return comment;
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
    .select(`
      *,
      created_by_user:user_id(
        name,
        email,
        avatar_url,
        role
      )
    `)
    .single();
  
  if (error) {
    console.error(`Error updating feature request ${requestId}:`, error);
    throw error;
  }
  
  // Ensure we have a valid created_by_user object
  let createdByUser = {
    name: 'Unknown User',
    email: '',
    role: 'user' as "admin" | "company" | "tech",
    avatar_url: null
  };
  
  if (data.created_by_user && typeof data.created_by_user === 'object') {
    // Handle case when created_by_user is an object (successful join)
    if (!('error' in data.created_by_user!)) {
      const userData = data.created_by_user as Record<string, any>;
      createdByUser = {
        name: userData.name || 'Unknown User',
        email: userData.email || '',
        role: (userData.role || 'user') as "admin" | "company" | "tech",
        avatar_url: userData.avatar_url || null
      };
    }
  }
  
  // Create a properly typed FeatureRequest object
  const featureRequest: FeatureRequest = {
    id: data.id,
    title: data.title,
    description: data.description,
    status: (data.status || 'pending') as FeatureRequestStatus,
    priority: ((data as any).priority || 'medium') as FeatureRequestPriority, // Cast to any to handle missing property
    company_id: data.company_id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    votes_count: 0, // We don't have this info from the update query
    comments_count: 0, // We don't have this info from the update query
    user_has_voted: false, // We don't have this info from the update query
    created_by_user: createdByUser
  };
  
  return featureRequest;
}
