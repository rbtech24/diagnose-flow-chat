
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityComment } from '@/types/community';
import { fetchCommunityPostById, addCommentToPost, markCommentAsAnswer, upvotePost, upvoteComment } from '@/api/communityApi';
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
        const data = await fetchCommunityPostById(postId);
        setPost(data);
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
      if (!post) return;

      const newComment = await addCommentToPost(postId, content);
      
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

      await markCommentAsAnswer(postId, commentId);

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
        await upvoteComment(commentId);
        
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
        await upvotePost(postId);
        
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
