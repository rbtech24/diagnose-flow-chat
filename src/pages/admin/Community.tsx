
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';

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
        initialPosts={posts}
        onCreatePost={handleCreatePost}
        userRole="admin"
        isLoading={isLoading}
      />
    </div>
  );
}
