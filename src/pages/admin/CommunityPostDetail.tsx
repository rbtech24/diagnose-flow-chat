
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CommunityPostDetail } from '@/components/community/CommunityPostDetail';
import { CommunityPost, CommunityComment } from '@/types/community';
import { getCommunityPosts } from '@/data/mockCommunity';
import { supabase } from '@/integrations/supabase/client';

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
        const posts = await getCommunityPosts();
        const foundPost = posts.find(p => p.id === postId);
        
        if (foundPost) {
          // Increment view count
          setPost({
            ...foundPost,
            views: foundPost.views + 1
          });
        }
      } catch (error) {
        console.error('Error loading post:', error);
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

      // In a real app, you would upload files and get URLs
      const newComment: CommunityComment = {
        id: `comment-${Date.now()}`,
        postId,
        content,
        authorId: userData.user.id,
        author: {
          id: userData.user.id,
          name: userData.user.user_metadata?.name || 'Unknown User',
          email: userData.user.email || '',
          role: 'admin',
          avatarUrl: userData.user.user_metadata?.avatar_url
        },
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
        isAnswer: false
      };
      
      setPost({
        ...post,
        comments: [...post.comments, newComment],
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
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
            ? { ...comment, upvotes: comment.upvotes + 1 } 
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
