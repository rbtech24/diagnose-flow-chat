
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityPostComment } from '@/types/community';
import { emptyPosts, placeholderUser } from '@/utils/placeholderData';

export default function TechCommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, this would fetch from the server
      setPost(null);
      setLoading(false);
    }, 300);
  }, [postId]);

  const handleBack = () => {
    navigate('/tech/community');
  };

  const handleAddComment = (postId: string, content: string, files: File[]) => {
    if (post) {
      // In a real app, you would upload files and get URLs
      const newComment: CommunityPostComment = {
        id: `comment-${Date.now()}`,
        postId,
        content,
        authorId: placeholderUser.id,
        author: placeholderUser,
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0
      };
      
      setPost({
        ...post,
        comments: [...post.comments, newComment],
        updatedAt: new Date()
      });
    }
  };

  const handleMarkAsAnswer = (postId: string, commentId: string) => {
    if (post) {
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

  const handleUpvote = (postId: string, commentId?: string) => {
    if (post) {
      if (commentId) {
        // Upvote a comment
        const updatedComments = post.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, upvotes: (comment.upvotes || 0) + 1 } 
            : comment
        );
        
        setPost({
          ...post,
          comments: updatedComments
        });
      } else {
        // Upvote the post
        setPost({
          ...post,
          upvotes: post.upvotes + 1
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
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
