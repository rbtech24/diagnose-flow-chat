
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export type CommunityPostType = 'question' | 'tech-sheet-request' | 'wire-diagram-request';

export interface CommunityComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  upvotes: number;
  isAnswer: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: CommunityPostType;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isSolved: boolean;
  comments: CommunityComment[];
}

export function useCommunityPosts() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Implement actual API call here
      const response = await fetch('/api/community/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data);
      return data;
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a specific post by ID
  const fetchPostById = useCallback(async (postId: string) => {
    try {
      // Implement actual API call here
      const response = await fetch(`/api/community/posts/${postId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const post = await response.json();
      return post;
    } catch (err) {
      console.error(`Error fetching post ${postId}:`, err);
      toast.error('Failed to load the post. Please try again.');
      return null;
    }
  }, []);

  // Create a new post
  const createPost = useCallback(async (postData: { 
    title: string; 
    content: string; 
    type: CommunityPostType;
    tags: string[];
  }) => {
    try {
      if (!user) {
        toast.error('You must be logged in to create a post');
        return null;
      }

      // Implement actual API call here
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          authorId: user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newPost = await response.json();
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success('Post created successfully!');
      return newPost;
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post. Please try again.');
      return null;
    }
  }, [user]);

  // Add a comment to a post
  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to comment');
        return null;
      }

      // Implement actual API call here
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          authorId: user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newComment = await response.json();
      
      // Update the posts state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? {
                ...post,
                comments: [...post.comments, newComment],
                updatedAt: new Date()
              }
            : post
        )
      );
      
      toast.success('Comment added successfully!');
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment. Please try again.');
      return null;
    }
  }, [user]);

  // Mark a comment as the answer to a post
  const markAsAnswer = useCallback(async (postId: string, commentId: string) => {
    try {
      // Implement actual API call here
      const response = await fetch(`/api/community/posts/${postId}/comments/${commentId}/answer`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the posts state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              isSolved: true,
              comments: post.comments.map(comment => ({
                ...comment,
                isAnswer: comment.id === commentId
              }))
            };
          }
          return post;
        })
      );
      
      toast.success('Solution marked successfully!');
      return true;
    } catch (err) {
      console.error('Error marking solution:', err);
      toast.error('Failed to mark solution. Please try again.');
      return false;
    }
  }, []);

  // Upvote a post
  const upvotePost = useCallback(async (postId: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to upvote');
        return false;
      }

      // Implement actual API call here
      const response = await fetch(`/api/community/posts/${postId}/upvote`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the posts state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, upvotes: post.upvotes + 1 }
            : post
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error upvoting post:', err);
      toast.error('Failed to upvote post. Please try again.');
      return false;
    }
  }, [user]);

  // Upvote a comment
  const upvoteComment = useCallback(async (commentId: string) => {
    try {
      if (!user) {
        toast.error('You must be logged in to upvote');
        return false;
      }

      // Implement actual API call here
      const response = await fetch(`/api/community/comments/${commentId}/upvote`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update the posts state
      setPosts(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          comments: post.comments.map(comment => 
            comment.id === commentId 
              ? { ...comment, upvotes: comment.upvotes + 1 }
              : comment
          )
        }))
      );
      
      return true;
    } catch (err) {
      console.error('Error upvoting comment:', err);
      toast.error('Failed to upvote comment. Please try again.');
      return false;
    }
  }, [user]);

  // Initialize data loading
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
