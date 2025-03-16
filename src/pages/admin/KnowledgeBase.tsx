
import { useState } from "react";
import { 
  Book, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  FileText,
  BookOpen,
  Link as LinkIcon,
  MessageSquare,
  Eye,
  EyeOff,
  ChevronDown,
  Tag,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { KnowledgeArticle, KnowledgeArticleType, KnowledgeCategory } from "@/types/knowledge";

// Mock data
const mockCategories: KnowledgeCategory[] = [
  { id: "cat-1", name: "Refrigeration", description: "Refrigerator and freezer repair guides", slug: "refrigeration", articleCount: 8 },
  { id: "cat-2", name: "HVAC", description: "Heating, ventilation, and air conditioning guides", slug: "hvac", articleCount: 12 },
  { id: "cat-3", name: "Laundry", description: "Washing machine and dryer repair", slug: "laundry", articleCount: 6 },
  { id: "cat-4", name: "Cooking", description: "Stove, oven, and range repair", slug: "cooking", articleCount: 5 },
  { id: "cat-5", name: "Commercial", description: "Commercial appliance repair guides", slug: "commercial", articleCount: 10 },
];

const mockArticles: KnowledgeArticle[] = [
  {
    id: "kb-001",
    title: "Refrigerator Compressor Troubleshooting Guide",
    content: "Full content here...",
    excerpt: "Step-by-step process for diagnosing and repairing common compressor issues in residential refrigerators.",
    category: "Refrigeration",
    type: "guide",
    tags: ["compressor", "refrigerator", "cooling", "frost"],
    author: "John Smith",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-08-20T14:45:00Z",
    published: true,
    views: 1245,
    helpfulVotes: 89,
    notHelpfulVotes: 3
  },
  {
    id: "kb-002",
    title: "HVAC System 3000 Service Manual",
    content: "Full content here...",
    excerpt: "Complete technical specifications and repair procedures for the HVAC System 3000 series.",
    category: "HVAC",
    type: "manual",
    tags: ["hvac", "system 3000", "manual", "specifications"],
    author: "Technical Team",
    createdAt: "2023-05-10T08:15:00Z",
    updatedAt: "2023-07-12T11:20:00Z",
    published: true,
    views: 987,
    helpfulVotes: 76,
    notHelpfulVotes: 5
  },
  {
    id: "kb-003",
    title: "Common Washing Machine Leaks and Fixes",
    content: "Full content here...",
    excerpt: "Frequently asked questions about detecting and repairing water leaks in various washing machine models.",
    category: "Laundry",
    type: "faq",
    tags: ["washing machine", "leaks", "water damage", "repair"],
    author: "Sarah Johnson",
    createdAt: "2023-04-22T13:45:00Z",
    updatedAt: "2023-09-05T09:30:00Z",
    published: true,
    views: 2134,
    helpfulVotes: 143,
    notHelpfulVotes: 12
  },
  {
    id: "kb-004",
    title: "Commercial Freezer Temperature Calibration",
    content: "Full content here...",
    excerpt: "Guidelines for proper temperature calibration and troubleshooting inconsistencies in commercial freezers.",
    category: "Commercial",
    type: "guide",
    tags: ["commercial", "freezer", "temperature", "calibration"],
    author: "Michael Davis",
    createdAt: "2023-03-18T15:20:00Z",
    updatedAt: "2023-08-30T10:15:00Z",
    published: false,
    views: 567,
    helpfulVotes: 42,
    notHelpfulVotes: 4
  },
  {
    id: "kb-005",
    title: "Manufacturer Support Resources",
    content: "Full content here...",
    excerpt: "Direct links to manufacturer support portals, warranty information, and parts ordering systems.",
    category: "Resources",
    type: "link",
    tags: ["manufacturers", "support", "warranty", "parts"],
    author: "Admin Team",
    createdAt: "2023-02-14T11:10:00Z",
    updatedAt: "2023-07-25T16:40:00Z",
    published: true,
    views: 1875,
    helpfulVotes: 98,
    notHelpfulVotes: 7
  }
];

const getTypeIcon = (type: KnowledgeArticleType) => {
  switch(type) {
    case "guide":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "manual":
      return <FileText className="h-4 w-4 text-amber-500" />;
    case "faq":
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case "link":
      return <LinkIcon className="h-4 w-4 text-purple-500" />;
    case "troubleshooting":
      return <Book className="h-4 w-4 text-red-500" />;
  }
};

export default function AdminKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("articles");
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [categories, setCategories] = useState<KnowledgeCategory[]>(mockCategories);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<KnowledgeArticleType | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = categoryFilter === null || article.category === categoryFilter;
    const matchesType = typeFilter === null || article.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && article.published) || 
      (statusFilter === 'draft' && !article.published);
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });
  
  const toggleArticlePublishStatus = (id: string) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, published: !article.published } : article
    ));
  };
  
  const deleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };
  
  const handleAddArticle = () => {
    // In a real app, this would open a form to add a new article
    setIsAddArticleOpen(true);
  };
  
  const handleAddCategory = () => {
    // In a real app, this would open a form to add a new category
    setIsAddCategoryOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          Knowledge Base Management
        </h1>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddArticle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="articles" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter || ""} onValueChange={(val) => setCategoryFilter(val || null)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={typeFilter || ""} onValueChange={(val: KnowledgeArticleType | "") => setTypeFilter(val || null)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={(val: 'all' | 'published' | 'draft') => setStatusFilter(val)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="hidden lg:table-cell">Views</TableHead>
                  <TableHead className="hidden lg:table-cell">Helpful</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-start gap-2">
                          {getTypeIcon(article.type)}
                          <div>
                            <div>{article.title}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block mt-1">
                              {article.excerpt.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{article.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
                        {article.type}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {article.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {article.helpfulVotes}/{article.helpfulVotes + article.notHelpfulVotes}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={article.published ? "success" : "secondary"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleArticlePublishStatus(article.id)}>
                              {article.published ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteArticle(article.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No articles found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Categories</h2>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.slug}
                    </TableCell>
                    <TableCell>{category.articleCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Articles</h3>
              <p className="text-3xl font-bold">{articles.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Published</h3>
              <p className="text-3xl font-bold">{articles.filter(a => a.published).length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Views</h3>
              <p className="text-3xl font-bold">
                {articles.reduce((sum, article) => sum + article.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Most Viewed Articles</h3>
              <ul className="space-y-3">
                {[...articles]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map(article => (
                    <li key={article.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(article.type)}
                        <span className="text-sm">{article.title}</span>
                      </div>
                      <Badge variant="secondary">{article.views.toLocaleString()} views</Badge>
                    </li>
                  ))
                }
              </ul>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Most Helpful Articles</h3>
              <ul className="space-y-3">
                {[...articles]
                  .sort((a, b) => b.helpfulVotes - a.helpfulVotes)
                  .slice(0, 5)
                  .map(article => (
                    <li key={article.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(article.type)}
                        <span className="text-sm">{article.title}</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {article.helpfulVotes} helpful
                      </Badge>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Article Dialog - Would be expanded in a real implementation */}
      <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Add New Knowledge Base Article</DialogTitle>
            <DialogDescription>
              Create a new article to help users troubleshoot and fix issues.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input id="title" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Category
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional fields would be added here */}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddArticleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog - Would be expanded in a real implementation */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize knowledge base articles.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input id="category-name" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-desc" className="text-right text-sm font-medium">
                Description
              </label>
              <Input id="category-desc" className="col-span-3" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
