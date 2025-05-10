
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Filter,
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCommunityPosts, CommunityPost } from "@/api/communityApi";

export default function TechCommunity() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchCommunityPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading community posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filter posts based on search term and selected tab
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = 
      selectedTab === "all" ||
      (selectedTab === "questions" && post.type === "question") ||
      (selectedTab === "tech-sheets" && post.type === "tech-sheet-request") ||
      (selectedTab === "wire-diagrams" && post.type === "wire-diagram-request");
    
    return matchesSearch && matchesTab;
  });

  // Sort filtered posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "popular":
        return b.views - a.views;
      case "upvotes":
        return b.upvotes - a.upvotes;
      case "comments":
        return b.comments.length - a.comments.length;
      default:
        return 0;
    }
  });

  // Count stats
  const questionCount = posts.filter(post => post.type === "question").length;
  const techSheetRequestCount = posts.filter(post => post.type === "tech-sheet-request").length;
  const wireDiagramRequestCount = posts.filter(post => post.type === "wire-diagram-request").length;
  const userCount = new Set(posts.map(post => post.authorId)).size;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPostTypeDisplay = (type: string) => {
    switch (type) {
      case "question": return "Question";
      case "tech-sheet-request": return "Tech Sheet Request";
      case "wire-diagram-request": return "Wire Diagram Request";
      case "discussion": return "Discussion";
      default: return type;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "question": return "bg-blue-100 text-blue-800";
      case "tech-sheet-request": return "bg-purple-100 text-purple-800";
      case "wire-diagram-request": return "bg-green-100 text-green-800";
      case "discussion": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Technician Community</h1>
          <p className="text-muted-foreground">
            Ask questions, share knowledge, and help fellow technicians
          </p>
        </div>
        <Button onClick={() => navigate("/tech/community/new")} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{questionCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tech Sheet Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{techSheetRequestCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wire Diagram Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{wireDiagramRequestCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{userCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Viewed</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="tech-sheets">Tech Sheets</TabsTrigger>
            <TabsTrigger value="wire-diagrams">Wire Diagrams</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderPosts()}
          </TabsContent>
          
          <TabsContent value="questions" className="mt-0">
            {renderPosts()}
          </TabsContent>
          
          <TabsContent value="tech-sheets" className="mt-0">
            {renderPosts()}
          </TabsContent>
          
          <TabsContent value="wire-diagrams" className="mt-0">
            {renderPosts()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderPosts() {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (sortedPosts.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            {searchTerm ? (
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">
                  Be the first to start a discussion or ask a question
                </p>
                <Button onClick={() => navigate("/tech/community/new")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {sortedPosts.map((post) => (
          <Card
            key={post.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/tech/community/${post.id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author?.avatarUrl} />
                    <AvatarFallback>
                      {post.author?.name.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {post.author?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • {formatDate(post.createdAt)}
                  </span>
                </div>
                <Badge className={getPostTypeColor(post.type)}>
                  {getPostTypeDisplay(post.type)}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2 line-clamp-1">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{post.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
              {post.isSolved && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Solved
                </Badge>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
}
