
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { toast } from 'sonner';

export function useCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id(
            id, 
            name, 
            email, 
            role, 
            avatar_url
          ),
          comments:community_post_comments(count)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Format the data to match our CommunityPost type
      const formattedPosts: CommunityPost[] = data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        type: post.type as CommunityPostType,
        authorId: post.author_id,
        author: {
          id: post.author?.id || 'unknown',
          name: post.author?.name || 'Unknown User',
          email: post.author?.email || '',
          role: post.author?.role || 'user',
          avatarUrl: post.author?.avatar_url || ''
        },
        attachments: [], // We would need to fetch attachments separately
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        upvotes: post.upvotes || 0,
        views: post.views || 0,
        isSolved: post.is_solved || false,
        tags: post.tags || [],
        comments: []  // Comments would need to be fetched separately when viewing a post
      })) || [];
      
      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      setError('Failed to load community posts');
      toast.error('Error loading community posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch a single post with its comments
  const fetchPostDetails = async (postId: string) => {
    try {
      // Fetch the post
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:author_id(
            id, 
            name, 
            email, 
            role, 
            avatar_url
          )
        `)
        .eq('id', postId)
        .single();

      if (postError) throw postError;
      
      // Increment view count
      await supabase.rpc('increment', { 
        row_id: postId, 
        field_name: 'views', 
        table_name: 'community_posts' 
      });
      
      // Fetch comments for the post
      const { data: commentsData, error: commentsError } = await supabase
        .from('community_post_comments')
        .select(`
          *,
          author:author_id(
            id, 
            name, 
            email, 
            role, 
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      
      // Format the post with its comments
      const formattedPost: CommunityPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        type: postData.type as CommunityPostType,
        authorId: postData.author_id,
        author: {
          id: postData.author?.id || 'unknown',
          name: postData.author?.name || 'Unknown User',
          email: postData.author?.email || '',
          role: postData.author?.role || 'user',
          avatarUrl: postData.author?.avatar_url || ''
        },
        attachments: [], // We would need to implement attachment handling
        createdAt: new Date(postData.created_at),
        updatedAt: new Date(postData.updated_at),
        upvotes: postData.upvotes || 0,
        views: postData.views || 0,
        isSolved: postData.is_solved || false,
        tags: postData.tags || [],
        comments: commentsData?.map(comment => ({
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          authorId: comment.author_id,
          author: {
            id: comment.author?.id || 'unknown',
            name: comment.author?.name || 'Unknown User',
            email: comment.author?.email || '',
            role: comment.author?.role || 'user',
            avatarUrl: comment.author?.avatar_url || ''
          },
          attachments: [],
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at),
          upvotes: comment.upvotes || 0,
          isAnswer: comment.is_answer || false
        })) || []
      };
      
      return formattedPost;
    } catch (err) {
      console.error('Error fetching post details:', err);
      toast.error('Error loading post details');
      throw err;
    }
  };

  // Function to create a new post
  const createPost = async (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const newPost = {
        ...post,
        author_id: user.id,
      };
      
      const { data, error: insertError } = await supabase
        .from('community_posts')
        .insert(newPost)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      // Refresh posts list
      fetchPosts();
      
      return data;
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Error creating post');
      throw err;
    }
  };

  // Function to add a comment to a post
  const addComment = async (postId: string, content: string, isAnswer: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const comment = {
        post_id: postId,
        author_id: user.id,
        content,
        is_answer: isAnswer
      };
      
      const { data, error: insertError } = await supabase
        .from('community_post_comments')
        .insert(comment)
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return data;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Error adding comment');
      throw err;
    }
  };

  return { 
    posts, 
    isLoading, 
    error, 
    refreshPosts: fetchPosts,
    fetchPostDetails,
    createPost,
    addComment
  };
}
