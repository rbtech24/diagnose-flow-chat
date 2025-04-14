
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfflineAwareCommunityForum } from '@/components/community/OfflineAwareCommunityForum';
import { CommunityPost as TypedCommunityPost, CommunityPostType } from '@/types/community';
import { useCommunityPosts, CommunityPost } from '@/hooks/useCommunityPosts';
import { MessageSquare, FileText, Workflow, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function CompanyCommunity() {
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

  // Calculate statistics based on posts
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  const fulfilledRequestCount = posts.filter(post => post.isSolved).length;
  
  // Convert posts to the expected type for OfflineAwareCommunityForum
  const typedPosts: TypedCommunityPost[] = posts.map(post => ({
    ...post,
    authorId: post.authorId || "",
    attachments: post.attachments || [],
    views: post.views || 0
  }));

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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center">
          <div className="bg-blue-100 p-2 rounded-full mb-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-sm text-gray-600">Questions</span>
          <span className="text-2xl font-bold">{questionCount}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <div className="bg-amber-100 p-2 rounded-full mb-2">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-sm text-gray-600">Tech Sheet Requests</span>
          <span className="text-2xl font-bold">{techSheetRequestCount}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <div className="bg-green-100 p-2 rounded-full mb-2">
            <Workflow className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-sm text-gray-600">Wire Diagram Requests</span>
          <span className="text-2xl font-bold">{wireDiagramRequestCount}</span>
        </Card>
        
        <Card className="p-4 flex flex-col items-center">
          <div className="bg-emerald-100 p-2 rounded-full mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-sm text-gray-600">Fulfilled Requests</span>
          <span className="text-2xl font-bold">{fulfilledRequestCount}</span>
        </Card>
      </div>
      
      <OfflineAwareCommunityForum
        basePath="/company/community"
        initialPosts={typedPosts}
        onCreatePost={handleCreatePost}
        userRole="company"
        showDocumentTypes={true}
        isLoading={isLoading}
      />
    </div>
  );
}
