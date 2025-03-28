import React, { useState, useEffect } from 'react';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { CommunityFilters } from './CommunityFilters';
import { CommunityPostCard } from './CommunityPostCard';
import { CommunityStats } from './CommunityStats';
import { NewPostDialog } from './NewPostDialog';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCommunitySync } from '@/hooks/useCommunitySync';
import { SyncStatusIndicator } from '@/components/system/SyncStatusIndicator';
import { SyncStatusBadge } from '@/components/system/SyncStatusBadge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface OfflineAwareCommunityForumProps {
  initialPosts: CommunityPost[];
  basePath: string;
  userRole?: 'admin' | 'company' | 'tech';
  onCreatePost?: (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
    attachments: File[];
  }) => void;
  showDocumentTypes?: boolean;
  isLoading?: boolean;
}

export function OfflineAwareCommunityForum({
  initialPosts,
  basePath,
  userRole = 'tech',
  onCreatePost,
  showDocumentTypes = false,
  isLoading = false,
}: OfflineAwareCommunityForumProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<CommunityPostType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddNewPost, setShowAddNewPost] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = useIsMobile();
  
  const { syncStatus, pendingChanges, processedChanges, syncOfflineChanges } = useCommunitySync();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPosts(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter posts based on search, type, and tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || post.type === selectedType;
    
    const matchesTags = selectedTags.length === 0 ||
                        selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesType && matchesTags;
  });
  
  // Handle create post
  const handleCreatePost = (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
    attachments: File[];
  }) => {
    if (onCreatePost) {
      onCreatePost(post);
      setShowAddNewPost(false);
    }
  };
  
  // Create array of all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  );
  
  if (isLoading || isLoadingPosts) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-52" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // Render mobile filters sheet when on mobile
  const renderMobileFilters = () => {
    if (!isMobile) return null;
    
    return (
      <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300 ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 transition-transform duration-300 ${showMobileFilters ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
              Close
            </Button>
          </div>
          
          <div className="space-y-4">
            <CommunityStats posts={posts} showDocumentStats={showDocumentTypes} />
            <CommunityFilters
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={(tag) => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              showDocumentFilters={showDocumentTypes}
              activeTab={selectedType}
              onTabChange={(value) => setSelectedType(value as CommunityPostType | 'all')}
            />
            
            <Button 
              className="w-full mt-4" 
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {pendingChanges > 0 && (
        <SyncStatusIndicator
          syncItems={pendingChanges}
          processedItems={processedChanges}
          showDetails={true}
          moduleName="Community Posts"
        />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Community Posts</h2>
          <SyncStatusBadge 
            syncItems={pendingChanges} 
            syncType="community"
            variant={isMobile ? "icon-only" : "badge"} 
          />
        </div>
        
        <div className="flex gap-2 self-end">
          {pendingChanges > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={syncOfflineChanges}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
          )}
          <Button
            onClick={() => setShowAddNewPost(true)}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Tabs
            defaultValue="all"
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as CommunityPostType | 'all')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="question">Questions</TabsTrigger>
              <TabsTrigger value="discussion">Discussions</TabsTrigger>
              <TabsTrigger value="announcement">Announcements</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isMobile ? (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredPosts.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No posts match your current filters</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedTags([]);
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`${basePath}/${post.id}`}>
                  <CommunityPostCard post={post} basePath={basePath} />
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Desktop sidebar - hide on mobile */}
        {!isMobile && (
          <div className="hidden lg:block space-y-6">
            <CommunityStats posts={posts} showDocumentStats={showDocumentTypes} />
            <CommunityFilters
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={(tag) => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              showDocumentFilters={showDocumentTypes}
              activeTab={selectedType}
              onTabChange={(value) => setSelectedType(value as CommunityPostType | 'all')}
            />
          </div>
        )}
      </div>
      
      <NewPostDialog
        isOpen={showAddNewPost}
        onOpenChange={setShowAddNewPost}
        onSubmit={handleCreatePost}
        userRole={userRole}
        showDocumentTypes={showDocumentTypes}
      />
      
      {/* Mobile filters drawer */}
      {renderMobileFilters()}
    </div>
  );
}
