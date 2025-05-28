
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityComment } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CompanyCommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        // Fetch post from database
        const { data: postData, error: postError } = await supabase
          .from('community_posts')
          .select(`
            *,
            author:author_id(
              id,
              email,
              raw_user_meta_data
            ),
            community_comments(
              *,
              author:author_id(
                id,
                email,
                raw_user_meta_data
              )
            )
          `)
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('Error loading post:', postError);
          toast.error('Failed to load post');
          return;
        }

        if (postData) {
          // Transform the data to match our types
          const transformedPost: CommunityPost = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            type: postData.type as CommunityPost['type'],
            authorId: postData.author_id,
            author: {
              id: postData.author.id,
              name: postData.author.raw_user_meta_data?.name || 'Unknown User',
              email: postData.author.email || '',
              role: 'company',
              avatarUrl: postData.author.raw_user_meta_data?.avatar_url
            },
            attachments: [],
            createdAt: new Date(postData.created_at),
            updatedAt: new Date(postData.updated_at),
            upvotes: postData.upvotes || 0,
            views: postData.views || 0,
            tags: postData.tags || [],
            isSolved: postData.is_solved || false,
            comments: (postData.community_comments || []).map((comment: any) => ({
              id: comment.id,
              postId: comment.post_id,
              content: comment.content,
              authorId: comment.author_id,
              author: {
                id: comment.author.id,
                name: comment.author.raw_user_meta_data?.name || 'Unknown User',
                email: comment.author.email || '',
                role: 'company',
                avatarUrl: comment.author.raw_user_meta_data?.avatar_url
              },
              attachments: comment.attachments || [],
              createdAt: new Date(comment.created_at),
              updatedAt: new Date(comment.updated_at),
              upvotes: comment.upvotes || 0,
              isAnswer: comment.is_answer || false
            }))
          };

          // Increment view count
          await supabase.rpc('increment_view_count', {
            table_name: 'community_posts',
            row_id: postId
          });

          setPost({
            ...transformedPost,
            views: transformedPost.views + 1
          });
        }
      } catch (error) {
        console.error('Error loading post:', error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const handleBack = () => {
    navigate('/company/community');
  };

  const handleAddComment = async (postId: string, content: string, files: File[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user || !post) return;

      // Create comment in database
      const { data: commentData, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          content,
          author_id: userData.user.id
        })
        .select(`
          *,
          author:author_id(
            id,
            email,
            raw_user_meta_data
          )
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment');
        return;
      }

      const newComment: CommunityComment = {
        id: commentData.id,
        postId,
        content,
        authorId: userData.user.id,
        author: {
          id: userData.user.id,
          name: commentData.author.raw_user_meta_data?.name || 'Unknown User',
          email: userData.user.email || '',
          role: 'company',
          avatarUrl: commentData.author.raw_user_meta_data?.avatar_url
        },
        attachments: [],
        createdAt: new Date(commentData.created_at),
        updatedAt: new Date(commentData.updated_at),
        upvotes: 0,
        isAnswer: false
      };
      
      setPost({
        ...post,
        comments: [...post.comments, newComment],
        updatedAt: new Date()
      });

      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleMarkAsAnswer = async (postId: string, commentId: string) => {
    try {
      if (!post) return;

      // Update comment in database
      const { error } = await supabase
        .from('community_comments')
        .update({ is_answer: true })
        .eq('id', commentId);

      if (error) {
        console.error('Error marking as answer:', error);
        toast.error('Failed to mark as answer');
        return;
      }

      // Update post as solved
      await supabase
        .from('community_posts')
        .update({ is_solved: true })
        .eq('id', postId);

      const updatedComments = post.comments.map(comment => ({
        ...comment,
        isAnswer: comment.id === commentId
      }));
      
      setPost({
        ...post,
        comments: updatedComments,
        isSolved: true,
        updatedAt: new Date()
      });

      toast.success('Comment marked as answer');
    } catch (error) {
      console.error('Error marking as answer:', error);
      toast.error('Failed to mark as answer');
    }
  };

  const handleUpvote = async (postId: string, commentId?: string) => {
    try {
      if (!post) return;

      if (commentId) {
        // Upvote a comment
        const { error } = await supabase
          .from('community_comments')
          .update({ upvotes: supabase.raw('upvotes + 1') })
          .eq('id', commentId);

        if (error) {
          console.error('Error upvoting comment:', error);
          return;
        }

        const updatedComments = post.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, upvotes: comment.upvotes + 1 } 
            : comment
        );
        
        setPost({
          ...post,
          comments: updatedComments
        });
      } else {
        // Upvote the post
        const { error } = await supabase
          .from('community_posts')
          .update({ upvotes: supabase.raw('upvotes + 1') })
          .eq('id', postId);

        if (error) {
          console.error('Error upvoting post:', error);
          return;
        }

        setPost({
          ...post,
          upvotes: post.upvotes + 1
        });
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Post Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The post you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <CommunityPostDetail
        post={post}
        onBack={handleBack}
        onAddComment={handleAddComment}
        onMarkAsAnswer={handleMarkAsAnswer}
        onUpvote={handleUpvote}
      />
    </div>
  );
}
