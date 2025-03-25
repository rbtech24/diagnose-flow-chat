
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityPost, CommunityPostComment } from '@/types/community';
import { useAuth } from '@/context/AuthContext';

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      if (!postsData) {
        setPosts([]);
        return;
      }
      
      // Transform the posts with placeholder author data (we'll use context for real users)
      const transformedPosts: CommunityPost[] = await Promise.all(postsData.map(async (post) => {
        // Fetch comments for this post
        const { data: commentsData, error: commentsError } = await supabase
          .from('community_post_comments')
          .select('*')
          .eq('post_id', post.id);
          
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        }

        // Transform comments with placeholder author data
        const transformedComments: CommunityPostComment[] = (commentsData || []).map(comment => {
          return {
            id: comment.id,
            postId: comment.post_id,
            content: comment.content,
            authorId: comment.author_id,
            author: {
              id: comment.author_id || '',
              // Use the context AuthContext for user info instead of direct DB access
              name: 'User ' + comment.author_id?.substring(0, 4) || 'Unknown User',
              email: '',
              role: 'tech' as 'admin' | 'company' | 'tech',
              avatarUrl: '',
            },
            attachments: [],
            createdAt: new Date(comment.created_at),
            updatedAt: new Date(comment.updated_at),
            upvotes: comment.upvotes || 0,
            isAnswer: comment.is_answer || false,
          };
        });
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          type: post.type as any,
          authorId: post.author_id,
          author: {
            id: post.author_id || '',
            // Use the context AuthContext for user info instead of direct DB access
            name: 'User ' + post.author_id?.substring(0, 4) || 'Unknown User',
            email: '',
            role: 'tech' as 'admin' | 'company' | 'tech',
            avatarUrl: '',
          },
          attachments: [],
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          tags: post.tags || [],
          upvotes: post.upvotes || 0,
          views: post.views || 0,
          isSolved: post.is_solved || false,
          comments: transformedComments,
        };
      }));
      
      setPosts(transformedPosts);
    } catch (err: any) {
      console.error('Error fetching community posts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPostById = async (postId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // First, increment view count using a direct update
      try {
        const { error: viewError } = await supabase
          .from('community_posts')
          .update({ views: supabase.rpc('increment', { 
            row_id: postId,
            field_name: 'views', 
            table_name: 'community_posts' 
          })})
          .eq('id', postId);

        if (viewError) {
          console.error('Error updating view count:', viewError);
          // Continue even if view incrementing fails
        }
      } catch (viewError) {
        console.error('Error updating view count:', viewError);
        // Continue even if view incrementing fails
      }
      
      // Fetch the post
      const { data: post, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', postId)
        .single();
      
      if (postError) throw postError;
      
      if (!post) return null;

      // Fetch comments
      const { data: comments, error: commentsError } = await supabase
        .from('community_post_comments')
        .select('*')
        .eq('post_id', postId);

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }

      // Transform the post with placeholder author data
      const transformedPost: CommunityPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type as any,
        authorId: post.author_id,
        author: {
          id: post.author_id || '',
          // Use the context AuthContext for user info
          name: 'User ' + post.author_id?.substring(0, 4) || 'Unknown User',
          email: '',
          role: 'tech' as 'admin' | 'company' | 'tech',
          avatarUrl: '',
        },
        attachments: [],
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        tags: post.tags || [],
        upvotes: post.upvotes || 0,
        views: post.views || 0,
        isSolved: post.is_solved || false,
        comments: (comments || []).map((comment) => {
          return {
            id: comment.id,
            postId: comment.post_id,
            content: comment.content,
            authorId: comment.author_id,
            author: {
              id: comment.author_id || '',
              // Use the context AuthContext for user info
              name: 'User ' + comment.author_id?.substring(0, 4) || 'Unknown User',
              email: '',
              role: 'tech' as 'admin' | 'company' | 'tech',
              avatarUrl: '',
            },
            attachments: [],
            createdAt: new Date(comment.created_at),
            updatedAt: new Date(comment.updated_at),
            upvotes: comment.upvotes || 0,
            isAnswer: comment.is_answer || false,
          };
        }),
      };

      return transformedPost;
    } catch (err: any) {
      console.error('Error fetching community post:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (post: {
    title: string;
    content: string;
    type: string;
    tags: string[];
  }): Promise<CommunityPost | null> => {
    try {
      if (!user) throw new Error('User must be authenticated to create a post');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: post.title,
          content: post.content,
          type: post.type,
          tags: post.tags,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Refetch posts to update the list
      fetchPosts();

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type as any,
        authorId: data.author_id,
        author: {
          id: user.id,
          name: user.name || 'Unknown User',
          email: user.email,
          role: user.role || 'tech' as 'admin' | 'company' | 'tech',
          avatarUrl: '',
        },
        attachments: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || [],
        upvotes: 0,
        views: 0,
        isSolved: false,
        comments: [],
      };
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message);
      return null;
    }
  };

  const addComment = async (
    postId: string,
    content: string,
  ): Promise<CommunityPostComment | null> => {
    try {
      if (!user) throw new Error('User must be authenticated to add a comment');

      const { data, error } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: postId,
          content,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        postId: data.post_id,
        content: data.content,
        authorId: data.author_id,
        author: {
          id: user.id,
          name: user.name || 'Unknown User',
          email: user.email,
          role: user.role as 'admin' | 'company' | 'tech',
          avatarUrl: '',
        },
        attachments: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        upvotes: 0,
        isAnswer: false,
      };
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.message);
      return null;
    }
  };

  const markAsAnswer = async (postId: string, commentId: string): Promise<boolean> => {
    try {
      // First, reset all comments for this post
      const { error: resetError } = await supabase
        .from('community_post_comments')
        .update({ is_answer: false })
        .eq('post_id', postId);

      if (resetError) throw resetError;

      // Then mark the selected comment as answer
      const { error } = await supabase
        .from('community_post_comments')
        .update({ is_answer: true })
        .eq('id', commentId);

      if (error) throw error;

      // Update the post as solved
      const { error: postError } = await supabase
        .from('community_posts')
        .update({ is_solved: true })
        .eq('id', postId);

      if (postError) throw postError;

      return true;
    } catch (err: any) {
      console.error('Error marking as answer:', err);
      setError(err.message);
      return false;
    }
  };

  const upvotePost = async (postId: string): Promise<boolean> => {
    try {
      // Update the post with an increment to the upvotes
      const { error } = await supabase
        .from('community_posts')
        .update({ upvotes: supabase.rpc('increment', {
          row_id: postId,
          field_name: 'upvotes',
          table_name: 'community_posts'
        })})
        .eq('id', postId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error upvoting post:', err);
      setError(err.message);
      return false;
    }
  };

  const upvoteComment = async (commentId: string): Promise<boolean> => {
    try {
      // Update the comment with an increment to the upvotes
      const { error } = await supabase
        .from('community_post_comments')
        .update({ upvotes: supabase.rpc('increment', {
          row_id: commentId,
          field_name: 'upvotes',
          table_name: 'community_post_comments'
        })})
        .eq('id', commentId);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error upvoting comment:', err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    addComment,
    markAsAnswer,
    upvotePost,
    upvoteComment
  };
}
