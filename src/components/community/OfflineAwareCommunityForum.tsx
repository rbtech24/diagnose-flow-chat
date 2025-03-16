
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { useCommunitySync } from '@/hooks/useCommunitySync';
import { SyncStatusIndicator } from '@/components/system/SyncStatusIndicator';
import { communityStorage } from '@/utils/offlineStorage';
import { Button } from '@/components/ui/button';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Loader2, RefreshCw } from 'lucide-react';
import { CommunityFilters } from './CommunityFilters';
import { CommunityPostCard } from './CommunityPostCard';
import { CommunityStats } from './CommunityStats';
import { NewPostDialog } from './NewPostDialog';

interface OfflineAwareCommunityForumProps {
  basePath: string;
  initialPosts: CommunityPost[];
  onCreatePost: (post: { 
    title: string; 
    content: string; 
    type: CommunityPostType; 
    tags: string[]; 
    attachments: File[]; 
  }) => void;
  userRole: 'tech' | 'company' | 'admin';
}

export function OfflineAwareCommunityForum({ 
  basePath, 
  initialPosts, 
  onCreatePost, 
  userRole 
}: OfflineAwareCommunityForumProps) {
  const navigate = useNavigate();
  const { isOffline } = useOfflineStatus();
  const { 
    syncStatus, 
    pendingChanges, 
    processedChanges, 
    syncOfflineChanges 
  } = useCommunitySync();
  
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

  // Load posts from local storage if offline, or merge with server posts if online
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      
      try {
        // First try to load from local storage
        const localPosts = await communityStorage.getAllPosts<CommunityPost>();
        
        if (isOffline) {
          // When offline, use the local posts if available
          if (localPosts.length > 0) {
            setPosts(localPosts);
          }
        } else {
          // When online, merge with server data (in a real app)
          // For now, just use initial posts + local posts
          const combinedPosts = [...initialPosts];
          
          // Add local posts that aren't in initialPosts
          localPosts.forEach(localPost => {
            if (!initialPosts.some(post => post.id === localPost.id)) {
              combinedPosts.push(localPost);
            }
          });
          
          setPosts(combinedPosts);
        }
      } catch (error) {
        console.error('Error loading community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [initialPosts, isOffline]);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    // Filter by search query
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by type
    const matchesType = selectedType === 'all' || post.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (selectedSort) {
      case 'recent':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'popular':
        return b.views - a.views;
      case 'upvotes':
        return b.upvotes - a.upvotes;
      case 'comments':
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });

  const handleCreatePost = async (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
    attachments: File[];
  }) => {
    const authorId = userRole === 'tech' ? 'tech-1' : userRole === 'company' ? 'company-1' : 'admin-1';
    const authorName = userRole === 'tech' ? 'Tech User' : userRole === 'company' ? 'Company User' : 'Admin User';
    
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: post.title,
      content: post.content,
      type: post.type,
      authorId: authorId,
      author: {
        id: authorId,
        name: authorName,
        email: `${userRole}@example.com`,
        role: userRole,
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
    
    // Store in local cache
    await communityStorage.storePost(newPost);
    
    // If online, also use the parent component's handler
    if (!isOffline) {
      onCreatePost(post);
    } else {
      // If offline, queue for sync
      await communityStorage.storePendingUpdate({
        url: '/api/community/posts',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newPost
      });
    }
    
    // Update local state
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostClick = (postId: string) => {
    navigate(`${basePath}/${postId}`);
  };

  // Count stats
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  
  // In a real app, you'd calculate this differently
  const activeMemberCount = new Set(posts.map(post => post.authorId)
    .concat(posts.flatMap(post => post.comments.map(comment => comment.authorId)))).size;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span className="text-lg">Loading community posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SyncStatusIndicator 
        syncItems={pendingChanges} 
        processedItems={processedChanges} 
        showDetails={true}
        moduleName="Community posts"
      />
      
      {pendingChanges > 0 && syncStatus !== 'syncing' && (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={syncOfflineChanges}
            className="mb-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync {pendingChanges} Posts
          </Button>
        </div>
      )}
      
      <CommunityStats
        questionCount={questionCount}
        techSheetRequestCount={techSheetRequestCount}
        wireDiagramRequestCount={wireDiagramRequestCount}
        activeMemberCount={activeMemberCount}
      />
      
      <CommunityFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />

      {sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map(post => (
            <div key={post.id} onClick={() => handlePostClick(post.id)}>
              <CommunityPostCard post={post} basePath={basePath} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
