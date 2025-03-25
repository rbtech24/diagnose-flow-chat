
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPostType } from '@/types/community';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';

export default function TechCommunity() {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Technician Community</h1>
          <p className="text-muted-foreground mt-1">
            Connect with other technicians, share knowledge, and get help
          </p>
        </div>
      </div>
      
      <OfflineAwareCommunityForum
        basePath="/tech/community"
        initialPosts={posts}
        onCreatePost={handleCreatePost}
        userRole="tech"
        isLoading={isLoading}
      />
    </div>
  );
}
