
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { mockPosts } from '@/data/mockCommunity';

export default function CompanyCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);

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
      authorId: 'company-1',
      author: {
        id: 'company-1',
        name: 'Company User',
        email: 'company@example.com',
        role: 'company',
        avatarUrl: ''
      },
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      views: 0,
      tags: post.tags,
      comments: [],
      isSolved: false
    };
    
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="container mx-auto px-0 sm:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Company Community</h1>
          <p className="text-muted-foreground mt-1">
            Share knowledge, request technical documents, and collaborate with technicians
          </p>
        </div>
      </div>
      
      <OfflineAwareCommunityForum
        basePath="/company/community"
        initialPosts={posts}
        onCreatePost={handleCreatePost}
        userRole="company"
        showDocumentTypes={true}
      />
    </div>
  );
}
