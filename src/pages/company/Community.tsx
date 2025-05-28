
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { fetchCommunityPosts, createCommunityPost } from '@/api/communityApi';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { toast } from 'sonner';

export default function CompanyCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');
  
  const { articles: knowledgeArticles } = useKnowledgeBase();

  // Load posts from database using the API
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchCommunityPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading community posts:', error);
        toast.error('Failed to load community posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
    try {
      // Check if this is a tech sheet or wire diagram request
      let knowledgeBaseArticleId = null;
      if (post.type === 'tech-sheet-request' || post.type === 'wire-diagram-request') {
        // Try to find matching knowledge base article
        const matchingArticle = knowledgeArticles.find(article =>
          article.title.toLowerCase().includes(post.title.toLowerCase()) ||
          article.tags.some(tag => 
            post.tags.some(postTag => 
              postTag.toLowerCase().includes(tag.toLowerCase())
            )
          )
        );
        
        if (matchingArticle) {
          knowledgeBaseArticleId = matchingArticle.id;
        }
      }

      const postId = await createCommunityPost({
        title: post.title,
        content: post.content,
        type: post.type,
        tags: post.tags
      });

      // Refresh posts to show the new one
      const updatedPosts = await fetchCommunityPosts();
      setPosts(updatedPosts);
      
      if (knowledgeBaseArticleId) {
        toast.success('Post created and linked to knowledge base article');
      } else {
        toast.success('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/company/community/${postId}`);
  };

  // Count stats
  const questionCount = posts.filter(post => post.type === 'question').length;
  const techSheetRequestCount = posts.filter(post => post.type === 'tech-sheet-request').length;
  const wireDiagramRequestCount = posts.filter(post => post.type === 'wire-diagram-request').length;
  
  // Calculate active member count from unique authors
  const activeMemberCount = new Set(posts.map(post => post.authorId)).size;

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
