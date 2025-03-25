
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { Loader2 } from 'lucide-react';

export default function AdminCommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const { 
    fetchPostById, 
    addComment, 
    markAsAnswer, 
    upvotePost,
    upvoteComment
  } = useCommunityPosts();

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      
      setLoading(true);
      const postData = await fetchPostById(postId);
      setPost(postData);
      setLoading(false);
    };

    loadPost();
  }, [postId, fetchPostById]);

  const handleBack = () => {
    navigate('/admin/community');
  };

  const handleAddComment = async (postId: string, content: string, files: File[]) => {
    const newComment = await addComment(postId, content);
    if (newComment && post) {
      setPost({
        ...post,
        comments: [...post.comments, newComment],
        updatedAt: new Date()
      });
    }
  };

  const handleMarkAsAnswer = async (postId: string, commentId: string) => {
    const success = await markAsAnswer(postId, commentId);
    if (success && post) {
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
    }
  };

  const handleUpvote = async (postId: string, commentId?: string) => {
    if (post) {
      if (commentId) {
        // Upvote a comment
        const success = await upvoteComment(commentId);
        if (success) {
          const updatedComments = post.comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, upvotes: (comment.upvotes || 0) + 1 } 
              : comment
          );
          
          setPost({
            ...post,
            comments: updatedComments
          });
        }
      } else {
        // Upvote the post
        const success = await upvotePost(postId);
        if (success) {
          setPost({
            ...post,
            upvotes: post.upvotes + 1
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading post...</p>
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
        showModeratorControls={true}
      />
    </div>
  );
}
