import { supabase } from '@/integrations/supabase/client';
import { FeatureRequest, FeatureRequestComment, FeatureRequestVote } from '@/types/featureRequest';
import { useUserManagementStore } from '@/store/userManagementStore';

export interface FeatureRequestsApi {
  getFeatureRequests: () => Promise<FeatureRequest[]>;
  getFeatureRequestById: (id: string) => Promise<FeatureRequest | null>;
  createFeatureRequest: (data: Partial<FeatureRequest>) => Promise<FeatureRequest | null>;
  updateFeatureRequest: (id: string, data: Partial<FeatureRequest>) => Promise<FeatureRequest | null>;
  deleteFeatureRequest: (id: string) => Promise<boolean>;
  voteForFeatureRequest: (requestId: string, userId: string, voteType: 'up' | 'down') => Promise<boolean>;
  removeVoteFromFeatureRequest: (requestId: string, userId: string) => Promise<boolean>;
  addCommentToFeatureRequest: (requestId: string, userId: string, content: string) => Promise<FeatureRequestComment | null>;
  updateComment: (commentId: string, content: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
}

export const useFeatureRequestsApi = (): FeatureRequestsApi => {
  const { currentUser } = useUserManagementStore();

  const getFeatureRequests = async (): Promise<FeatureRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select(`
          *,
          votes:feature_request_votes(*),
          comments:feature_request_comments(
            *,
            created_by_user:users(*)
          ),
          created_by_user:users(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feature requests:', error);
        return [];
      }

      return data.map(transformFeatureRequestData);
    } catch (error) {
      console.error('Error in getFeatureRequests:', error);
      return [];
    }
  };

  const getFeatureRequestById = async (id: string): Promise<FeatureRequest | null> => {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select(`
          *,
          votes:feature_request_votes(*),
          comments:feature_request_comments(
            *,
            created_by_user:users(*)
          ),
          created_by_user:users(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching feature request:', error);
        return null;
      }

      return transformFeatureRequestData(data);
    } catch (error) {
      console.error('Error in getFeatureRequestById:', error);
      return null;
    }
  };

  const createFeatureRequest = async (data: Partial<FeatureRequest>): Promise<FeatureRequest | null> => {
    try {
      if (!currentUser) {
        console.error('No current user found');
        return null;
      }

      const newFeatureRequest = {
        title: data.title,
        description: data.description,
        status: data.status || 'pending',
        category: data.category || 'general',
        priority: data.priority || 'medium',
        created_by: currentUser.id,
        company_id: currentUser.companyId,
      };

      const { data: createdData, error } = await supabase
        .from('feature_requests')
        .insert([newFeatureRequest])
        .select()
        .single();

      if (error) {
        console.error('Error creating feature request:', error);
        return null;
      }

      // Return the created feature request with minimal data
      return {
        id: createdData.id,
        title: createdData.title,
        description: createdData.description,
        status: createdData.status,
        category: createdData.category,
        priority: createdData.priority,
        created_at: new Date(createdData.created_at),
        updated_at: new Date(createdData.updated_at),
        created_by: currentUser.id,
        votes: [],
        comments: [],
        vote_count: 0,
        created_by_user: {
          id: currentUser.id,
          name: currentUser.name || '',
          avatar: currentUser.avatarUrl || '',
          role: currentUser.role
        }
      };
    } catch (error) {
      console.error('Error in createFeatureRequest:', error);
      return null;
    }
  };

  const updateFeatureRequest = async (id: string, data: Partial<FeatureRequest>): Promise<FeatureRequest | null> => {
    try {
      const updateData = {
        title: data.title,
        description: data.description,
        status: data.status,
        category: data.category,
        priority: data.priority,
      };

      const { data: updatedData, error } = await supabase
        .from('feature_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating feature request:', error);
        return null;
      }

      return await getFeatureRequestById(id);
    } catch (error) {
      console.error('Error in updateFeatureRequest:', error);
      return null;
    }
  };

  const deleteFeatureRequest = async (id: string): Promise<boolean> => {
    try {
      // First delete all votes and comments
      await supabase.from('feature_request_votes').delete().eq('feature_request_id', id);
      await supabase.from('feature_request_comments').delete().eq('feature_request_id', id);
      
      // Then delete the feature request
      const { error } = await supabase.from('feature_requests').delete().eq('id', id);

      if (error) {
        console.error('Error deleting feature request:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFeatureRequest:', error);
      return false;
    }
  };

  const voteForFeatureRequest = async (requestId: string, userId: string, voteType: 'up' | 'down'): Promise<boolean> => {
    try {
      // Check if user already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('feature_request_votes')
        .select('*')
        .eq('feature_request_id', requestId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking existing vote:', checkError);
        return false;
      }

      // If vote exists and is the same type, remove it (toggle)
      if (existingVote && existingVote.vote_type === voteType) {
        return await removeVoteFromFeatureRequest(requestId, userId);
      }

      // If vote exists but different type, update it
      if (existingVote) {
        const { error: updateError } = await supabase
          .from('feature_request_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return false;
        }
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from('feature_request_votes')
          .insert([{
            feature_request_id: requestId,
            user_id: userId,
            vote_type: voteType
          }]);

        if (insertError) {
          console.error('Error creating vote:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in voteForFeatureRequest:', error);
      return false;
    }
  };

  const removeVoteFromFeatureRequest = async (requestId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feature_request_votes')
        .delete()
        .eq('feature_request_id', requestId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing vote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeVoteFromFeatureRequest:', error);
      return false;
    }
  };

  const addCommentToFeatureRequest = async (requestId: string, userId: string, content: string): Promise<FeatureRequestComment | null> => {
    try {
      const { data, error } = await supabase
        .from('feature_request_comments')
        .insert([{
          feature_request_id: requestId,
          created_by: userId,
          content
        }])
        .select(`
          *,
          created_by_user:users(*)
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return null;
      }

      // Process comment data
      const createdBy = data.created_by_user ? {
        id: data.created_by_user.id || '',
        name: data.created_by_user.name || '',
        avatar: data.created_by_user.avatar_url || '',
        role: data.created_by_user.role || 'user'
      } : {
        id: '',
        name: 'Unknown User',
        avatar: '',
        role: 'user'
      };

      return {
        id: data.id,
        content: data.content,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        created_by: data.created_by,
        is_edited: data.is_edited || false,
        attachments: data.attachments || [],
        created_by_user: createdBy
      };
    } catch (error) {
      console.error('Error in addCommentToFeatureRequest:', error);
      return null;
    }
  };

  const updateComment = async (commentId: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feature_request_comments')
        .update({
          content,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) {
        console.error('Error updating comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateComment:', error);
      return false;
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feature_request_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteComment:', error);
      return false;
    }
  };

  // Helper function to transform feature request data
  const transformFeatureRequestData = (data: any): FeatureRequest => {
    // Process votes
    const votes: FeatureRequestVote[] = data.votes?.map((vote: any) => ({
      id: vote.id,
      user_id: vote.user_id,
      vote_type: vote.vote_type,
      created_at: new Date(vote.created_at)
    })) || [];

    // Calculate vote count
    const upvotes = votes.filter(vote => vote.vote_type === 'up').length;
    const downvotes = votes.filter(vote => vote.vote_type === 'down').length;
    const voteCount = upvotes - downvotes;

    // Process comments data
    const comments = data.comments?.map((comment: any) => {
      const createdBy = comment.created_by_user ? {
        id: comment.created_by_user.id || '',
        name: comment.created_by_user.name || '',
        avatar: comment.created_by_user.avatar_url || '',
        role: comment.created_by_user.role || 'user'
      } : {
        id: '',
        name: 'Unknown User',
        avatar: '',
        role: 'user'
      };
      
      return {
        id: comment.id,
        content: comment.content,
        created_at: new Date(comment.created_at),
        updated_at: new Date(comment.updated_at),
        created_by: comment.created_by,
        is_edited: comment.is_edited,
        attachments: comment.attachments || [],
        created_by_user: createdBy
      };
    }) || [];

    // Process created_by_user
    const createdByUser = data.created_by_user ? {
      id: data.created_by_user.id || '',
      name: data.created_by_user.name || '',
      avatar: data.created_by_user.avatar_url || '',
      role: data.created_by_user.role || 'user'
    } : {
      id: '',
      name: 'Unknown User',
      avatar: '',
      role: 'user'
    };

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      category: data.category,
      priority: data.priority,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      created_by: data.created_by,
      votes,
      comments,
      vote_count: voteCount,
      created_by_user: createdByUser
    };
  };

  return {
    getFeatureRequests,
    getFeatureRequestById,
    createFeatureRequest,
    updateFeatureRequest,
    deleteFeatureRequest,
    voteForFeatureRequest,
    removeVoteFromFeatureRequest,
    addCommentToFeatureRequest,
    updateComment,
    deleteComment
  };
};
