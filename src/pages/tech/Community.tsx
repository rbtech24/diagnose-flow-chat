
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Filter, PlusCircle } from "lucide-react";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CommunityFilters } from "@/components/community/CommunityFilters";
import { CommunityStats } from "@/components/community/CommunityStats";
import { NewPostDialog } from "@/components/community/NewPostDialog";
import { useUserManagementStore } from "@/store/userManagementStore";
import { mockPosts } from "@/data/mockCommunity";
import { toast } from "sonner";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recent");
  
  // Get the current user for creating posts
  const { users } = useUserManagementStore();
  const currentUser = users.find(user => user.role === 'tech') || users[0];
  
  // Filter posts based on search query and active tab
  const filteredPosts = mockPosts
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   post.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(post => {
      if (activeTab === "all") return true;
      if (activeTab === "questions") return post.type === "question";
      if (activeTab === "discussions") return post.type === "discussion";
      if (activeTab === "solved") return post.isSolved;
      if (activeTab === "my-posts") return post.authorId === currentUser?.id;
      return true;
    });
  
  const handleCreatePost = (postData: any) => {
    // In a real app this would call an API to create the post
    toast.success("Post created successfully!");
    setShowNewPostDialog(false);
  };
  
  const handleVote = (postId: string, direction: 'up' | 'down') => {
    // In a real app this would call an API to record the vote
    toast.success(`Vote ${direction} registered!`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tech Community</h1>
        <Button onClick={() => setShowNewPostDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search community posts..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              {showFilters && (
                <CommunityFilters 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                  className="mb-4"
                />
              )}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="solved">Solved</TabsTrigger>
                  <TabsTrigger value="my-posts">My Posts</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No posts match your search" : "No posts found"}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <CommunityPostCard 
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  basePath="/tech/community"
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <CommunityStats 
            questionCount={25}
            techSheetRequestCount={14}
            wireDiagramRequestCount={19}
            activeMemberCount={42}
          />
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>Please follow these guidelines for posting</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>Be respectful and professional</li>
                <li>Provide as much detail as possible in questions</li>
                <li>Search before posting to avoid duplicates</li>
                <li>Use appropriate tags for better visibility</li>
                <li>Keep discussions on-topic and constructive</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showNewPostDialog && (
        <NewPostDialog
          onSubmit={handleCreatePost}
          currentUser={currentUser}
          onClose={() => setShowNewPostDialog(false)}
        />
      )}
    </div>
  );
}
