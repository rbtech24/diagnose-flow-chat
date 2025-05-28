
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { Button } from '@/components/ui/button';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { getCommunityPosts } from '@/data/mockCommunity';

export default function CompanyCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

  // Load posts from database
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getCommunityPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading community posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

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
    // In a real implementation, this would create the post in the database
    // For now, we'll create a temporary post object
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
      attachments: [], // In a real app, you would upload these files
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      views: 0,
      isSolved: false,
      tags: post.tags,
      comments: []
    };
    
    setPosts([newPost, ...posts]);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/company/community/${postId}`);
  };

  // Count stats
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  
  // In a real app, you'd calculate this differently
  const activeMemberCount = new Set(posts.map(post => post.authorId)
    .concat(posts.flatMap(post => post.comments.map(comment => comment.authorId)))).size;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading community posts...</p>
        </div>
      </div>
    );
  }

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

      {sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map(post => (
            <div key={post.id} onClick={() => handlePostClick(post.id)}>
              <CommunityPostCard post={post} basePath="/company/community" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
