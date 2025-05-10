
import { supabase } from "@/integrations/supabase/client";
import { CommunityPost, CommunityComment, Attachment, CommunityPostType } from "@/types/community";

// Helper function to format user data
const formatUserData = (userData: any) => {
  if (!userData) return undefined;
  
  return {
    id: userData.id || '',
    name: userData.full_name || userData.name || 'Unknown User',
    email: userData.email || '',
    role: userData.role || '',
    avatarUrl: userData.avatar_url || undefined
  };
};

// Function to create empty attachments array if none exist
const formatAttachments = (attachmentsData: any): Attachment[] => {
  if (!attachmentsData || !Array.isArray(attachmentsData)) return [];
  
  return attachmentsData.map(attachment => ({
    id: attachment.id || '',
    fileName: attachment.fileName || attachment.file_name || '',
    fileUrl: attachment.fileUrl || attachment.file_url || '',
    fileType: attachment.fileType || attachment.file_type || '',
    fileSize: attachment.fileSize || attachment.file_size || 0,
    uploadedAt: new Date(attachment.uploadedAt || attachment.uploaded_at || Date.now()),
    uploadedBy: attachment.uploadedBy || attachment.uploaded_by || ''
  }));
};

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
      .select("*")
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
        .select("*")
        .eq("id", comment.author_id)
        .single();
        
      return {
        id: comment.id,
        postId: comment.post_id,
        content: comment.content,
        authorId: comment.author_id,
        author: formatUserData(commentAuthorData),
        attachments: comment.attachments ? formatAttachments(comment.attachments) : [],
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
      type: post.type as CommunityPostType,
      authorId: post.author_id,
      author: formatUserData(authorData),
      attachments: [],  // Default empty array as the field doesn't exist in the table
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
  // First update view count
  try {
    await supabase.rpc("increment", { 
      row_id: id,
      field_name: "views",
      table_name: "community_posts" 
    });
  } catch (err) {
    console.error("Error incrementing view count:", err);
    // Don't throw here, continue with fetching the post
  }
  
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
    .select("*")
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
      .select("*")
      .eq("id", comment.author_id)
      .single();
      
    return {
      id: comment.id,
      postId: comment.post_id,
      content: comment.content,
      authorId: comment.author_id,
      author: formatUserData(commentAuthorData),
      attachments: comment.attachments ? formatAttachments(comment.attachments) : [],
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
    type: data.type as CommunityPostType,
    authorId: data.author_id,
    author: formatUserData(authorData),
    attachments: [], // Default empty array as the field doesn't exist in the table
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
      tags: post.tags,
      is_solved: false
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
    .select("*")
    .eq("id", userData.user.id)
    .single();
  
  return {
    id: data.id,
    postId: data.post_id,
    content: data.content,
    authorId: data.author_id,
    author: formatUserData(authorData),
    attachments: [],
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
  try {
    await supabase.rpc("increment", { 
      row_id: postId,
      field_name: "upvotes",
      table_name: "community_posts" 
    });
  } catch (error) {
    console.error("Error upvoting post:", error);
    throw error;
  }
};

// Upvote a comment
export const upvoteComment = async (commentId: string): Promise<void> => {
  try {
    await supabase.rpc("increment", { 
      row_id: commentId,
      field_name: "upvotes",
      table_name: "community_comments" 
    });
  } catch (error) {
    console.error("Error upvoting comment:", error);
    throw error;
  }
};
