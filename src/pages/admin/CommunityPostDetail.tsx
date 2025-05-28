
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityComment } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminCommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        const { data: postData, error: postError } = await supabase
          .from('community_posts')
          .select(`
            *,
            community_comments(*)
          `)
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('Error loading post:', postError);
          toast.error('Failed to load post');
          return;
        }

        if (postData) {
          const transformedPost: CommunityPost = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            type: postData.type as CommunityPost['type'],
            authorId: postData.author_id,
            author: {
              id: postData.author_id,
              name: 'Admin User',
              email: 'admin@company.com',
              role: 'admin',
              avatarUrl: undefined
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
                id: comment.author_id,
                name: 'User',
                email: 'user@company.com',
                role: 'tech',
                avatarUrl: undefined
              },
              attachments: comment.attachments || [],
              createdAt: new Date(comment.created_at),
              updatedAt: new Date(comment.updated_at),
              upvotes: comment.upvotes || 0,
              isAnswer: comment.is_answer || false
            }))
          };

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
    navigate('/admin/community');
  };

  const handleAddComment = async (postId: string, content: string, files: File[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user || !post) return;

      const { data: commentData, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          content,
          author_id: userData.user.id
        })
        .select()
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
          name: 'Admin User',
          email: userData.user.email || '',
          role: 'admin',
          avatarUrl: undefined
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

      const { error } = await supabase
        .from('community_comments')
        .update({ is_answer: true })
        .eq('id', commentId);

      if (error) {
        console.error('Error marking as answer:', error);
        toast.error('Failed to mark as answer');
        return;
      }

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
        const { error } = await supabase
          .from('community_comments')
          .update({ upvotes: post.comments.find(c => c.id === commentId)?.upvotes || 0 + 1 })
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
        const { error } = await supabase
          .from('community_posts')
          .update({ upvotes: post.upvotes + 1 })
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
