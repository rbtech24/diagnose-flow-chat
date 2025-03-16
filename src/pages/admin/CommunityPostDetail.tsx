
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityPostComment } from '@/types/community';
import { mockPosts, currentUser } from '@/data/mockCommunity';

export default function AdminCommunityPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);

  useEffect(() => {
    const foundPost = mockPosts.find(p => p.id === postId);
    if (foundPost) {
      setPost({
        ...foundPost,
        views: foundPost.views + 1 // Increment view count
      });
    }
  }, [postId]);

  const handleBack = () => {
    navigate('/admin/community');
  };

  const handleAddComment = (postId: string, content: string, files: File[]) => {
    if (post) {
      // In a real app, you would upload files and get URLs
      const newComment: CommunityPostComment = {
        id: `comment-${Date.now()}`,
        postId,
        content,
        authorId: currentUser.id,
        author: currentUser,
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
