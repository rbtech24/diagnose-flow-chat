
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, Trash2 } from 'lucide-react';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { Button } from '@/components/ui/button';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { mockPosts } from '@/data/mockCommunity';

export default function AdminCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
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
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });

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
      attachments: [], // In a real app, you would upload these files
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      views: 0,
      tags: post.tags,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/admin/community/${postId}`);
  };

  // Count stats
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  
  // In a real app, you'd calculate this differently
  const activeMemberCount = new Set(posts.map(post => post.authorId)
    .concat(posts.flatMap(post => post.comments.map(comment => comment.authorId)))).size;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage community discussions and requests
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="destructive" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reported Content
          </Button>
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

      {sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map(post => (
            <div key={post.id} className="flex gap-4">
              <div className="flex-grow" onClick={() => handlePostClick(post.id)}>
                <CommunityPostCard post={post} basePath="/admin/community" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0 h-10 w-10 mt-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
