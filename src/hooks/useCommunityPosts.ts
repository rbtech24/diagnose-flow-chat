
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
      
      // Fetch all unique author IDs from posts
      const authorIds = [...new Set(postsData.map(post => post.author_id))];
      
      // Fetch author data
      const { data: authorsData, error: authorsError } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .in('id', authorIds);
      
      if (authorsError) {
        console.error('Error fetching authors:', authorsError);
      }
      
      // Create a map of author data for quick lookups
      const authorsMap = (authorsData || []).reduce((map, author) => {
        map[author.id] = author;
        return map;
      }, {});
      
      // Fetch comments for all posts
      const { data: commentsData, error: commentsError } = await supabase
        .from('community_post_comments')
        .select('*');
      
      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }
      
      // Group comments by post ID
      const commentsByPostId = (commentsData || []).reduce((map, comment) => {
        if (!map[comment.post_id]) {
          map[comment.post_id] = [];
        }
        map[comment.post_id].push(comment);
        return map;
      }, {});
      
      // Fetch all unique author IDs from comments
      const commentAuthorIds = [...new Set((commentsData || []).map(comment => comment.author_id))];
      
      // Fetch comment author data
      const { data: commentAuthorsData, error: commentAuthorsError } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .in('id', commentAuthorIds);
      
      if (commentAuthorsError) {
        console.error('Error fetching comment authors:', commentAuthorsError);
      }
      
      // Create a map of comment author data
      const commentAuthorsMap = (commentAuthorsData || []).reduce((map, author) => {
        map[author.id] = author;
        return map;
      }, {});
      
      // Transform the posts with authors and comments
      const transformedPosts: CommunityPost[] = postsData.map(post => {
        const postAuthor = authorsMap[post.author_id] || {};
        const postComments = commentsByPostId[post.id] || [];
        
        const transformedComments: CommunityPostComment[] = postComments.map(comment => {
          const commentAuthor = commentAuthorsMap[comment.author_id] || {};
          
          return {
            id: comment.id,
            postId: comment.post_id,
            content: comment.content,
            authorId: comment.author_id,
            author: {
              id: commentAuthor.id || '',
              name: commentAuthor.raw_user_meta_data?.name || 'Unknown User',
              email: commentAuthor.email || '',
              role: (commentAuthor.raw_user_meta_data?.role || 'tech') as 'admin' | 'company' | 'tech',
              avatarUrl: commentAuthor.raw_user_meta_data?.avatarUrl || '',
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
            id: postAuthor.id || '',
            name: postAuthor.raw_user_meta_data?.name || 'Unknown User',
            email: postAuthor.email || '',
            role: (postAuthor.raw_user_meta_data?.role || 'tech') as 'admin' | 'company' | 'tech',
            avatarUrl: postAuthor.raw_user_meta_data?.avatarUrl || '',
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
      });
      
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

      // First, increment view count using the RPC function
      try {
        const { error: incrementError } = await supabase.rpc('increment', { 
          row_id: postId,
          field_name: 'views', 
          table_name: 'community_posts' 
        });

        if (incrementError) {
          console.error('Error updating view count:', incrementError);
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

      // Fetch the post author
      const { data: postAuthor, error: authorError } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .eq('id', post.author_id)
        .single();
        
      if (authorError) {
        console.error('Error fetching post author:', authorError);
      }
      
      // Fetch comments
      const { data: comments, error: commentsError } = await supabase
        .from('community_post_comments')
        .select('*')
        .eq('post_id', postId);

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }
      
      // Fetch comment authors
      const commentAuthorIds = [...new Set((comments || []).map(comment => comment.author_id))];
      
      const { data: commentAuthors, error: commentAuthorsError } = await supabase
        .from('auth.users')
        .select('id, email, raw_user_meta_data')
        .in('id', commentAuthorIds);
        
      if (commentAuthorsError) {
        console.error('Error fetching comment authors:', commentAuthorsError);
      }
      
      // Create a map of comment authors
      const commentAuthorsMap = (commentAuthors || []).reduce((map, author) => {
        map[author.id] = author;
        return map;
      }, {});

      // Transform the post
      const transformedPost: CommunityPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type as any,
        authorId: post.author_id,
        author: {
          id: postAuthor?.id || '',
          name: postAuthor?.raw_user_meta_data?.name || 'Unknown User',
          email: postAuthor?.email || '',
          role: (postAuthor?.raw_user_meta_data?.role || 'tech') as 'admin' | 'company' | 'tech',
          avatarUrl: postAuthor?.raw_user_meta_data?.avatarUrl || '',
        },
        attachments: [],
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        tags: post.tags || [],
        upvotes: post.upvotes || 0,
        views: post.views || 0,
        isSolved: post.is_solved || false,
        comments: (comments || []).map((comment) => {
          const commentAuthor = commentAuthorsMap[comment.author_id] || {};
          
          return {
            id: comment.id,
            postId: comment.post_id,
            content: comment.content,
            authorId: comment.author_id,
            author: {
              id: commentAuthor.id || '',
              name: commentAuthor.raw_user_meta_data?.name || 'Unknown User',
              email: commentAuthor.email || '',
              role: (commentAuthor.raw_user_meta_data?.role || 'tech') as 'admin' | 'company' | 'tech',
              avatarUrl: commentAuthor.raw_user_meta_data?.avatarUrl || '',
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
