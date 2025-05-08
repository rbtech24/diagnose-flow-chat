
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunityPostType } from '@/types/community';

export function TechCommunity() {
  const navigate = useNavigate();
  const { posts, isLoading, refreshPosts, createPost } = useCommunity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

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
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      default:
        return 0;
    }
  });

  const handleCreatePost = async (post: {
    title: string;
    content: string;
    type: CommunityPostType;
    tags: string[];
  }) => {
    await createPost(post);
    refreshPosts();
  };

  const handlePostClick = (postId: string) => {
    navigate(`/tech/community/${postId}`);
  };

  // Count stats
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  
  // Rough estimate of active members (unique authors)
  const activeMemberCount = new Set(posts.map(post => post.authorId)).size;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Technician Community</h1>
          <p className="text-muted-foreground mt-1">
            Share knowledge, request technical documents, and solve problems together
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <NewPostDialog onSubmit={handleCreatePost} />
        </div>
      </div>
      
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

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
          <Button onClick={() => setSelectedType('all')} variant="outline" className="mt-4">
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {sortedPosts.map(post => (
            <div key={post.id} onClick={() => handlePostClick(post.id)}>
              <CommunityPostCard post={post} basePath="/tech/community" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechCommunity;
