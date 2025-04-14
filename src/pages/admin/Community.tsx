
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPost as TypedCommunityPost, CommunityPostType } from '@/types/community';
import { useCommunityPosts, CommunityPost } from '@/hooks/useCommunityPosts';

export default function AdminCommunity() {
  const navigate = useNavigate();
  const { posts, isLoading, createPost } = useCommunityPosts();

  const handleCreatePost = async (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
    attachments: File[];
  }) => {
    await createPost({
      title: post.title,
      content: post.content,
      type: post.type,
      tags: post.tags
    });
  };

  // Convert posts to the expected type for OfflineAwareCommunityForum
  const typedPosts: TypedCommunityPost[] = posts.map(post => ({
    ...post,
    authorId: post.authorId || "",
    attachments: post.attachments || [],
    views: post.views || 0
  }));

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and moderate community discussions
          </p>
        </div>
      </div>
      
      <OfflineAwareCommunityForum
        basePath="/admin/community"
        initialPosts={typedPosts}
        onCreatePost={handleCreatePost}
        userRole="admin"
        isLoading={isLoading}
      />
    </div>
  );
}
