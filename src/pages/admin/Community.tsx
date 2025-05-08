
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle, Trash2 } from 'lucide-react';
import { CommunityFilters } from '@/components/community/CommunityFilters';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { Button } from '@/components/ui/button';
import { CommunityPost, CommunityPostType } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function AdminCommunity() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('recent');

  // Fetch community posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('community_posts')
          .select(`
            *,
            author:profiles(id, name, email, role, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching community posts:', error);
          toast({
            title: 'Error fetching posts',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        // Transform data to match CommunityPost type
        const formattedPosts = data.map((post: any): CommunityPost => ({
          id: post.id,
          title: post.title,
          content: post.content,
          type: post.type as CommunityPostType,
          authorId: post.author_id,
          author: {
            id: post.author?.id || 'unknown',
            name: post.author?.name || 'Unknown User',
            email: post.author?.email || '',
            role: post.author?.role || 'user',
            avatarUrl: post.author?.avatar_url || ''
          },
          attachments: post.attachments || [],
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          upvotes: post.upvotes || 0,
          views: post.views || 0,
          tags: post.tags || [],
          comments: post.comments || []
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error in fetchPosts:', error);
        toast({
          title: 'Unexpected error',
          description: 'Failed to load community posts',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  // If no posts exist in the database, create some sample ones to display
  useEffect(() => {
    const createSamplePosts = async () => {
      if (!loading && posts.length === 0) {
        const samplePosts = [
          {
            title: 'How to troubleshoot refrigerator cooling issues',
            content: 'I frequently encounter refrigerators that aren\'t cooling properly. Here are my steps for diagnosis...',
            type: 'question' as CommunityPostType,
            tags: ['refrigerator', 'cooling', 'troubleshooting'],
            author_id: 'admin-1', // Using a placeholder ID
          },
          {
            title: 'Request: Whirlpool WF-350 Washer Tech Sheet',
            content: 'Looking for the technical documentation for a Whirlpool WF-350 washer. If anyone has it, please share.',
            type: 'tech-sheet-request' as CommunityPostType,
            tags: ['whirlpool', 'washer', 'documentation'],
            author_id: 'admin-1',
          },
          {
            title: 'Wire diagram needed for GE Profile oven',
            content: 'I\'m working on a GE Profile oven from 2019 and need the wiring diagram. Model number PGB911SEJSS.',
            type: 'wire-diagram-request' as CommunityPostType,
            tags: ['GE', 'oven', 'wiring'],
            author_id: 'admin-1',
          }
        ];

        // Insert sample posts into the database
        for (const post of samplePosts) {
          const { error } = await supabase
            .from('community_posts')
            .insert({
              ...post,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              upvotes: 0,
              views: 0,
              comments: []
            });

          if (error) {
            console.error('Error inserting sample post:', error);
          }
        }

        // Refresh posts after creating samples
        const { data } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) {
          const formattedPosts = data.map((post: any): CommunityPost => ({
            id: post.id,
            title: post.title,
            content: post.content,
            type: post.type as CommunityPostType,
            authorId: post.author_id,
            author: {
              id: 'admin-1', 
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin',
              avatarUrl: ''
            },
            attachments: post.attachments || [],
            createdAt: new Date(post.created_at),
            updatedAt: new Date(post.updated_at),
            upvotes: post.upvotes || 0,
            views: post.views || 0,
            tags: post.tags || [],
            comments: post.comments || []
          }));

          setPosts(formattedPosts);
        }
      }
    };

    createSamplePosts();
  }, [loading, posts.length]);

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
      // Insert the post into the database
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: post.title,
          content: post.content,
          type: post.type,
          author_id: 'admin-1', // Using a placeholder admin ID
          tags: post.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes: 0,
          views: 0,
          comments: []
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newPost: CommunityPost = {
          id: data[0].id,
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

        toast({
          title: 'Post created',
          description: 'Your post has been created successfully',
        });
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error creating post',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/admin/community/${postId}`);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: 'Post deleted',
        description: 'The post has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error deleting post',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading community posts...</p>
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map(post => (
            <div key={post.id} className="flex gap-4">
              <div className="flex-grow cursor-pointer" onClick={() => handlePostClick(post.id)}>
                <CommunityPostCard post={post} basePath="/admin/community" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="flex-shrink-0 h-10 w-10 mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeletePost(post.id)}
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
