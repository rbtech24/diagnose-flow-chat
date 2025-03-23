
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { emptyPosts } from '@/utils/placeholderData';

export default function AdminCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>(emptyPosts);

  const handleCreatePost = (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
    attachments: File[];
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: post.title,
      content: post.content,
      type: post.type,
      authorId: 'admin-1',
      author: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatarUrl: ''
      },
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      views: 0,
      tags: post.tags,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
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
        showModeratorControls={true}
      />
    </div>
  );
}
