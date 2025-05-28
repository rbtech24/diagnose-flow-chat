
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        
        const { data: postsData, error } = await supabase
          .from('community_posts')
          .select(`
            *,
            author:author_id(
              id,
              email,
              raw_user_meta_data
            ),
            community_comments(count)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading posts:', error);
          toast.error('Failed to load community posts');
          return;
        }

        const transformedPosts: CommunityPost[] = (postsData || []).map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          type: post.type as CommunityPostType,
          authorId: post.author_id,
          author: {
            id: post.author.id,
            name: post.author.raw_user_meta_data?.name || 'Unknown User',
            email: post.author.email || '',
            role: 'company',
            avatarUrl: post.author.raw_user_meta_data?.avatar_url
          },
          attachments: [],
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          upvotes: post.upvotes || 0,
          views: post.views || 0,
          tags: post.tags || [],
          isSolved: post.is_solved || false,
          comments: [] // We'll load comments separately when needed
        }));

        setPosts(transformedPosts);
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
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('You must be logged in to create a post');
        return;
      }

      const { data: postData, error } = await supabase
        .from('community_posts')
        .insert({
          title: post.title,
          content: post.content,
          type: post.type,
          tags: post.tags,
          author_id: userData.user.id
        })
        .select(`
          *,
          author:author_id(
            id,
            email,
            raw_user_meta_data
          )
        `)
        .single();

      if (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post');
        return;
      }

      const newPost: CommunityPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        type: postData.type as CommunityPostType,
        authorId: postData.author_id,
        author: {
          id: userData.user.id,
          name: postData.author.raw_user_meta_data?.name || 'Unknown User',
          email: userData.user.email || '',
          role: 'company',
          avatarUrl: postData.author.raw_user_meta_data?.avatar_url
        },
        attachments: [],
        createdAt: new Date(postData.created_at),
        updatedAt: new Date(postData.updated_at),
        upvotes: 0,
        views: 0,
        isSolved: false,
        tags: postData.tags || [],
        comments: []
      };
      
      setPosts([newPost, ...posts]);
      toast.success('Post created successfully');
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
