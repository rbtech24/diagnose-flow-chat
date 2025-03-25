
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityPost, CommunityPostComment } from '@/types/community';
import { useAuth } from '@/context/AuthContext';

// Use manual type definition to match the tables we've created in Supabase
type CommunityPostData = {
  id: string;
  title: string;
  content: string;
  type: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  upvotes: number;
  views: number;
  is_solved: boolean;
  author: {
    id: string;
    email: string;
    raw_user_meta_data: {
      name: string;
      role: string;
      avatarUrl: string;
    };
  };
  comments: {
    id: string;
    post_id: string;
    content: string;
    author_id: string;
    created_at: string;
    updated_at: string;
    upvotes: number;
    is_answer: boolean;
    author: {
      id: string;
      email: string;
      raw_user_meta_data: {
        name: string;
        role: string;
        avatarUrl: string;
      };
    };
  }[];
};

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use 'any' type temporarily to bypass TypeScript errors
      // This is necessary because the tables we created aren't in the TypeScript definitions yet
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id(id, email, raw_user_meta_data),
          comments:community_post_comments(
            *,
            author:author_id(id, email, raw_user_meta_data)
          )
        `) as { data: CommunityPostData[] | null, error: any };
      
      if (error) throw error;

      if (!data) {
        setPosts([]);
        return;
      }

      // Transform the data to match our existing type structure
      const transformedPosts: CommunityPost[] = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type as any,
        authorId: post.author_id,
        author: {
          id: post.author?.id || '',
          name: post.author?.raw_user_meta_data?.name || 'Unknown User',
          email: post.author?.email || '',
          role: post.author?.raw_user_meta_data?.role || 'tech',
          avatarUrl: post.author?.raw_user_meta_data?.avatarUrl || '',
        },
        attachments: [],
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        tags: post.tags || [],
        upvotes: post.upvotes || 0,
        views: post.views || 0,
        isSolved: post.is_solved || false,
        comments: (post.comments || []).map((comment) => ({
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          authorId: comment.author_id,
          author: {
            id: comment.author?.id || '',
            name: comment.author?.raw_user_meta_data?.name || 'Unknown User',
            email: comment.author?.email || '',
            role: comment.author?.raw_user_meta_data?.role || 'tech',
            avatarUrl: comment.author?.raw_user_meta_data?.avatarUrl || '',
          },
          attachments: [],
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at),
          upvotes: comment.upvotes || 0,
          isAnswer: comment.is_answer || false,
        })),
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

      // First, increment view count
      try {
        await supabase.rpc('increment', { 
          row_id: postId,
          field_name: 'views', 
          table_name: 'community_posts' 
        });
      } catch (viewError) {
        console.error('Error updating view count:', viewError);
        // Continue even if view incrementing fails
      }
      
      // Use 'any' type temporarily to bypass TypeScript errors
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id(id, email, raw_user_meta_data),
          comments:community_post_comments(
            *,
            author:author_id(id, email, raw_user_meta_data)
          )
        `)
        .eq('id', postId)
        .single() as { data: CommunityPostData | null, error: any };
      
      if (error) throw error;
      
      if (!data) return null;

      // Transform the post to match our existing type structure
      const transformedPost: CommunityPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type as any,
        authorId: data.author_id,
        author: {
          id: data.author?.id || '',
          name: data.author?.raw_user_meta_data?.name || 'Unknown User',
          email: data.author?.email || '',
          role: data.author?.raw_user_meta_data?.role || 'tech',
          avatarUrl: data.author?.raw_user_meta_data?.avatarUrl || '',
        },
        attachments: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        tags: data.tags || [],
        upvotes: data.upvotes || 0,
        views: data.views || 0,
        isSolved: data.is_solved || false,
        comments: (data.comments || []).map((comment) => ({
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          authorId: comment.author_id,
          author: {
            id: comment.author?.id || '',
            name: comment.author?.raw_user_meta_data?.name || 'Unknown User',
            email: comment.author?.email || '',
            role: comment.author?.raw_user_meta_data?.role || 'tech',
            avatarUrl: comment.author?.raw_user_meta_data?.avatarUrl || '',
          },
          attachments: [],
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at),
          upvotes: comment.upvotes || 0,
          isAnswer: comment.is_answer || false,
        })),
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

      // Use 'any' type temporarily to bypass TypeScript errors
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
        .single() as { data: any, error: any };

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
          role: user.role || 'tech',
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

      // Use 'any' type temporarily to bypass TypeScript errors
      const { data, error } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: postId,
          content,
          author_id: user.id,
        })
        .select()
        .single() as { data: any, error: any };

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
          role: user.role || 'tech',
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
        .update({ is_answer: false } as any)
        .eq('post_id', postId) as { error: any };

      if (resetError) throw resetError;

      // Then mark the selected comment as answer
      const { error } = await supabase
        .from('community_post_comments')
        .update({ is_answer: true } as any)
        .eq('id', commentId) as { error: any };

      if (error) throw error;

      // Update the post as solved
      const { error: postError } = await supabase
        .from('community_posts')
        .update({ is_solved: true } as any)
        .eq('id', postId) as { error: any };

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
      const { error } = await supabase.rpc('increment', {
        row_id: postId,
        field_name: 'upvotes',
        table_name: 'community_posts'
      });

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
      const { error } = await supabase.rpc('increment', {
        row_id: commentId,
        field_name: 'upvotes',
        table_name: 'community_post_comments'
      });

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
