
import { CommunityPost, CommunityComment } from "@/types/community";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseIntegration } from "@/utils/supabaseIntegration";

// Real data fetching implementation
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    console.log('Fetching community posts from database...');
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      return await supabase
        .from('community_posts')
        .select(`
          id,
          title,
          content,
          type,
          author_id,
          created_at,
          updated_at,
          upvotes,
          views,
          tags,
          is_solved,
          is_fulfilled
        `)
        .order('created_at', { ascending: false });
    });

    if (!result.success) {
      console.error('Failed to fetch community posts:', result.error);
      return [];
    }

    // Transform database data to CommunityPost type
    const posts: CommunityPost[] = (result.data || []).map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type as 'question' | 'discussion' | 'resource',
      authorId: post.author_id,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      upvotes: post.upvotes || 0,
      views: post.views || 0,
      tags: post.tags || [],
      isSolved: post.is_solved || false,
      isFulfilled: post.is_fulfilled || false
    }));

    console.log(`Successfully fetched ${posts.length} community posts`);
    return posts;
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return [];
  }
};

export const getCommunityComments = async (postId: string): Promise<CommunityComment[]> => {
  try {
    console.log(`Fetching comments for post ${postId}...`);
    
    const result = await SupabaseIntegration.safeQuery(async () => {
      return await supabase
        .from('community_comments')
        .select(`
          id,
          content,
          post_id,
          author_id,
          created_at,
          updated_at,
          upvotes,
          is_answer,
          attachments
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
    });

    if (!result.success) {
      console.error('Failed to fetch community comments:', result.error);
      return [];
    }

    // Transform database data to CommunityComment type
    const comments: CommunityComment[] = (result.data || []).map(comment => ({
      id: comment.id,
      content: comment.content,
      postId: comment.post_id,
      authorId: comment.author_id,
      createdAt: new Date(comment.created_at),
      updatedAt: new Date(comment.updated_at),
      upvotes: comment.upvotes || 0,
      isAnswer: comment.is_answer || false,
      attachments: comment.attachments || []
    }));

    console.log(`Successfully fetched ${comments.length} comments`);
    return comments;
  } catch (error) {
    console.error('Error fetching community comments:', error);
    return [];
  }
};

// Real-time subscription for community posts
export const subscribeCommunityUpdates = (
  onPostUpdate: (posts: CommunityPost[]) => void,
  onCommentUpdate?: (postId: string, comments: CommunityComment[]) => void
) => {
  console.log('Setting up real-time subscription for community posts...');
  
  const unsubscribePosts = SupabaseIntegration.handleRealtimeSubscription(
    'community_posts',
    async () => {
      const updatedPosts = await getCommunityPosts();
      onPostUpdate(updatedPosts);
    }
  );

  let unsubscribeComments: (() => void) | undefined;
  
  if (onCommentUpdate) {
    unsubscribeComments = SupabaseIntegration.handleRealtimeSubscription(
      'community_comments',
      async (payload) => {
        const postId = payload.new?.post_id || payload.old?.post_id;
        if (postId) {
          const updatedComments = await getCommunityComments(postId);
          onCommentUpdate(postId, updatedComments);
        }
      }
    );
  }

  return () => {
    unsubscribePosts();
    unsubscribeComments?.();
  };
};
