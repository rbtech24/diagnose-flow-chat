
import { supabase } from "@/integrations/supabase/client";

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  type: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  attachments: any[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  views: number;
  isSolved: boolean;
  tags: string[];
  comments: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  attachments: any[];
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isAnswer: boolean;
}

// Fetch all community posts
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
  
  // Transform the data to match our component structure
  const posts: CommunityPost[] = await Promise.all(data.map(async (post) => {
    // Fetch author details
    const { data: authorData } = await supabase
      .from("profiles")
      .select("name, email, avatar_url, role")
      .eq("id", post.author_id)
      .single();
      
    // Fetch comments for this post
    const { data: commentsData } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", post.id);
      
    // Process comments
    const comments: CommunityComment[] = await Promise.all((commentsData || []).map(async (comment) => {
      // Fetch comment author
      const { data: commentAuthorData } = await supabase
        .from("profiles")
        .select("name, email, avatar_url, role")
        .eq("id", comment.author_id)
        .single();
        
      return {
        id: comment.id,
        postId: comment.post_id,
        content: comment.content,
        authorId: comment.author_id,
        author: commentAuthorData ? {
          id: comment.author_id,
          name: commentAuthorData.name,
          email: commentAuthorData.email,
          role: commentAuthorData.role,
          avatarUrl: commentAuthorData.avatar_url
        } : undefined,
        attachments: comment.attachments || [],
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
        upvotes: comment.upvotes || 0,
        isAnswer: comment.is_answer || false
      };
    }));
    
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      type: post.type,
      authorId: post.author_id,
      author: authorData ? {
        id: post.author_id,
        name: authorData.name,
        email: authorData.email,
        role: authorData.role,
        avatarUrl: authorData.avatar_url
      } : undefined,
      attachments: post.attachments || [],
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      upvotes: post.upvotes || 0,
      views: post.views || 0,
      isSolved: post.is_solved || false,
      tags: post.tags || [],
      comments: comments
    };
  }));
  
  return posts;
};

// Fetch a single community post
export const fetchCommunityPostById = async (id: string): Promise<CommunityPost> => {
  // Increment view count
  await supabase
    .from("community_posts")
    .update({ views: supabase.rpc("increment", { row_id: id, table_name: "community_posts", column_name: "views" }) })
    .eq("id", id);
  
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error(`Error fetching community post ${id}:`, error);
    throw error;
  }
  
  // Fetch author details
  const { data: authorData } = await supabase
    .from("profiles")
    .select("name, email, avatar_url, role")
    .eq("id", data.author_id)
    .single();
    
  // Fetch comments for this post
  const { data: commentsData } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", data.id);
    
  // Process comments
  const comments: CommunityComment[] = await Promise.all((commentsData || []).map(async (comment) => {
    // Fetch comment author
    const { data: commentAuthorData } = await supabase
      .from("profiles")
      .select("name, email, avatar_url, role")
      .eq("id", comment.author_id)
      .single();
      
    return {
      id: comment.id,
      postId: comment.post_id,
      content: comment.content,
      authorId: comment.author_id,
      author: commentAuthorData ? {
        id: comment.author_id,
        name: commentAuthorData.name,
        email: commentAuthorData.email,
        role: commentAuthorData.role,
        avatarUrl: commentAuthorData.avatar_url
      } : undefined,
      attachments: comment.attachments || [],
      createdAt: new Date(comment.created_at),
      updatedAt: new Date(comment.updated_at),
      upvotes: comment.upvotes || 0,
      isAnswer: comment.is_answer || false
    };
  }));
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    type: data.type,
    authorId: data.author_id,
    author: authorData ? {
      id: data.author_id,
      name: authorData.name,
      email: authorData.email,
      role: authorData.role,
      avatarUrl: authorData.avatar_url
    } : undefined,
    attachments: data.attachments || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    upvotes: data.upvotes || 0,
    views: data.views || 0,
    isSolved: data.is_solved || false,
    tags: data.tags || [],
    comments: comments
  };
};

// Create a new community post
export const createCommunityPost = async (post: {
  title: string;
  content: string;
  type: string;
  tags: string[];
}): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You need to be logged in to create a post");
  }
  
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      title: post.title,
      content: post.content,
      type: post.type,
      author_id: userData.user.id,
      tags: post.tags
    })
    .select();
    
  if (error) {
    console.error("Error creating community post:", error);
    throw error;
  }
  
  return data[0].id;
};

// Add a comment to a post
export const addCommentToPost = async (postId: string, content: string): Promise<CommunityComment> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error("You need to be logged in to comment");
  }
  
  const { data, error } = await supabase
    .from("community_comments")
    .insert({
      post_id: postId,
      content: content,
      author_id: userData.user.id
    })
    .select()
    .single();
    
  if (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
  
  // Fetch author details
  const { data: authorData } = await supabase
    .from("profiles")
    .select("name, email, avatar_url, role")
    .eq("id", userData.user.id)
    .single();
  
  return {
    id: data.id,
    postId: data.post_id,
    content: data.content,
    authorId: data.author_id,
    author: authorData ? {
      id: data.author_id,
      name: authorData.name,
      email: authorData.email,
      role: authorData.role,
      avatarUrl: authorData.avatar_url
    } : undefined,
    attachments: data.attachments || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    upvotes: data.upvotes || 0,
    isAnswer: data.is_answer || false
  };
};

// Mark a comment as an answer
export const markCommentAsAnswer = async (postId: string, commentId: string): Promise<void> => {
  // Update comment to mark as answer
  const { error: commentError } = await supabase
    .from("community_comments")
    .update({ is_answer: true })
    .eq("id", commentId);
    
  if (commentError) {
    console.error("Error marking comment as answer:", commentError);
    throw commentError;
  }
  
  // Update post to mark as solved
  const { error: postError } = await supabase
    .from("community_posts")
    .update({ is_solved: true })
    .eq("id", postId);
    
  if (postError) {
    console.error("Error marking post as solved:", postError);
    throw postError;
  }
};

// Upvote a post
export const upvotePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from("community_posts")
    .update({ upvotes: supabase.rpc("increment", { row_id: postId, table_name: "community_posts", column_name: "upvotes" }) })
    .eq("id", postId);
    
  if (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
};

// Upvote a comment
export const upvoteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from("community_comments")
    .update({ upvotes: supabase.rpc("increment", { row_id: commentId, table_name: "community_comments", column_name: "upvotes" }) })
    .eq("id", commentId);
    
  if (error) {
    console.error("Error upvoting comment:", error);
    throw error;
  }
};
