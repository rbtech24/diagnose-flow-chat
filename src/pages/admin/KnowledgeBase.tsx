
import React, { useState } from 'react';
import { KnowledgeArticle, KnowledgeCategory } from '@/types/knowledge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, Search, Edit, Trash2, Tag, ExternalLink, BookOpen, FileQuestion, HelpCircle, Settings, FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for knowledge articles
const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Troubleshooting Refrigerator Cooling Issues',
    content: 'This guide covers the most common refrigerator cooling problems and their solutions...',
    excerpt: 'Learn how to diagnose and fix refrigerator cooling problems quickly.',
    category: 'refrigerators',
    type: 'troubleshooting',
    tags: ['cooling', 'maintenance', 'refrigerator'],
    author: 'John Smith',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-06-22T14:45:00Z',
    published: true,
    views: 1245,
    helpfulVotes: 87,
    notHelpfulVotes: 12
  },
  {
    id: '2',
    title: 'Washer Error Code Guide',
    content: 'A comprehensive list of error codes for major washer brands and their meanings...',
    excerpt: 'Quick reference for all washing machine error codes and troubleshooting steps.',
    category: 'washers',
    type: 'guide',
    tags: ['error codes', 'washer', 'diagnostics'],
    author: 'Sarah Johnson',
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-07-05T16:20:00Z',
    published: true,
    views: 2431,
    helpfulVotes: 156,
    notHelpfulVotes: 8
  },
  {
    id: '3',
    title: 'Oven Temperature Calibration',
    content: 'Step-by-step instructions for calibrating oven temperature for accurate cooking...',
    excerpt: 'How to ensure your oven maintains the correct temperature for perfect results.',
    category: 'ovens',
    type: 'manual',
    tags: ['calibration', 'temperature', 'oven', 'maintenance'],
    author: 'Michael Brown',
    createdAt: '2023-01-28T13:40:00Z',
    updatedAt: '2023-05-17T11:10:00Z',
    published: true,
    views: 987,
    helpfulVotes: 65,
    notHelpfulVotes: 5
  },
  {
    id: '4',
    title: 'Dishwasher Not Draining Properly',
    content: 'Detailed guide for resolving drainage issues in dishwashers across major brands...',
    excerpt: 'Troubleshooting steps to fix dishwashers that won\'t drain water completely.',
    category: 'dishwashers',
    type: 'troubleshooting',
    tags: ['drainage', 'dishwasher', 'repair'],
    author: 'Emily Wilson',
    createdAt: '2023-03-12T08:55:00Z',
    updatedAt: '2023-06-30T15:25:00Z',
    published: false,
    views: 543,
    helpfulVotes: 42,
    notHelpfulVotes: 3
  },
  {
    id: '5',
    title: 'HVAC Maintenance Checklist',
    content: 'Seasonal maintenance tasks to keep HVAC systems running efficiently...',
    excerpt: 'Regular maintenance checklist to extend the life of heating and cooling systems.',
    category: 'hvac',
    type: 'guide',
    tags: ['maintenance', 'hvac', 'seasonal'],
    author: 'Robert Davis',
    createdAt: '2023-05-05T11:20:00Z',
    updatedAt: '2023-07-12T10:15:00Z',
    published: true,
    views: 1876,
    helpfulVotes: 124,
    notHelpfulVotes: 18
  }
];

// Mock data for categories
const mockCategories: KnowledgeCategory[] = [
  { id: '1', name: 'Refrigerators', description: 'All refrigerator-related knowledge', slug: 'refrigerators', articleCount: 42 },
  { id: '2', name: 'Washers', description: 'Washing machine guides and troubleshooting', slug: 'washers', articleCount: 35 },
  { id: '3', name: 'Dryers', description: 'Dryer maintenance and repair articles', slug: 'dryers', articleCount: 28 },
  { id: '4', name: 'Dishwashers', description: 'Dishwasher guides and problem solutions', slug: 'dishwashers', articleCount: 31 },
  { id: '5', name: 'HVAC', description: 'Heating, ventilation, and air conditioning resources', slug: 'hvac', articleCount: 47 },
  { id: '6', name: 'Ovens', description: 'Oven and range repair and maintenance', slug: 'ovens', articleCount: 29 },
  { id: '7', name: 'Microwaves', description: 'Microwave troubleshooting and guides', slug: 'microwaves', articleCount: 18 },
  { id: '8', name: 'Water Heaters', description: 'Water heater installation and maintenance', slug: 'water-heaters', articleCount: 22 }
];

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [categories, setCategories] = useState<KnowledgeCategory[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [newArticleDialogOpen, setNewArticleDialogOpen] = useState(false);
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [editArticleDialogOpen, setEditArticleDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  
  // Form states for new/edit article
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [articleType, setArticleType] = useState<KnowledgeArticle['type']>('guide');
  const [articleTags, setArticleTags] = useState('');
  const [articlePublished, setArticlePublished] = useState(false);
  
  // Form states for category
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  
  // Filter articles based on search term
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Clear article form
  const clearArticleForm = () => {
    setArticleTitle('');
    setArticleContent('');
    setArticleExcerpt('');
    setArticleCategory('');
    setArticleType('guide');
    setArticleTags('');
    setArticlePublished(false);
  };
  
  // Clear category form
  const clearCategoryForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setCategorySlug('');
  };
  
  // Add new article
  const handleAddArticle = () => {
    const newArticle: KnowledgeArticle = {
      id: Date.now().toString(),
      title: articleTitle,
      content: articleContent,
      excerpt: articleExcerpt,
      category: articleCategory,
      type: articleType,
      tags: articleTags.split(',').map(tag => tag.trim()),
      author: 'Admin User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: articlePublished,
      views: 0,
      helpfulVotes: 0,
      notHelpfulVotes: 0
    };
    
    setArticles([...articles, newArticle]);
    clearArticleForm();
    setNewArticleDialogOpen(false);
  };
  
  // Edit article
  const handleEditArticle = () => {
    if (!selectedArticle) return;
    
    const updatedArticles = articles.map(article => {
      if (article.id === selectedArticle.id) {
        return {
          ...article,
          title: articleTitle,
          content: articleContent,
          excerpt: articleExcerpt,
          category: articleCategory,
          type: articleType,
          tags: articleTags.split(',').map(tag => tag.trim()),
          published: articlePublished,
          updatedAt: new Date().toISOString()
        };
      }
      return article;
    });
    
    setArticles(updatedArticles);
    clearArticleForm();
    setEditArticleDialogOpen(false);
  };
  
  // Delete article
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };
  
  // Add new category
  const handleAddCategory = () => {
    const newCategory: KnowledgeCategory = {
      id: Date.now().toString(),
      name: categoryName,
      description: categoryDescription,
      slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-'),
      articleCount: 0
    };
    
    setCategories([...categories, newCategory]);
    clearCategoryForm();
    setNewCategoryDialogOpen(false);
  };
  
  // Edit category
  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          name: categoryName,
          description: categoryDescription,
          slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-')
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    clearCategoryForm();
    setEditCategoryDialogOpen(false);
  };
  
  // Delete category
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  
  // Set up edit article form
  const setupEditArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleExcerpt(article.excerpt);
    setArticleCategory(article.category);
    setArticleType(article.type);
    setArticleTags(article.tags.join(', '));
    setArticlePublished(article.published);
    setEditArticleDialogOpen(true);
  };
  
  // Set up edit category form
  const setupEditCategory = (category: KnowledgeCategory) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setCategorySlug(category.slug);
    setEditCategoryDialogOpen(true);
  };
  
  // Article type icon mapping
  const getArticleTypeIcon = (type: KnowledgeArticle['type']) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'manual':
        return <FileText className="h-4 w-4" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4" />;
      case 'link':
        return <ExternalLink className="h-4 w-4" />;
      case 'troubleshooting':
        return <Settings className="h-4 w-4" />;
      default:
        return <FileQuestion className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base Management</h1>
        <div className="flex gap-2">
          <Dialog open={newArticleDialogOpen} onOpenChange={setNewArticleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Knowledge Base Article</DialogTitle>
                <DialogDescription>
                  Add a new article to the knowledge base. Fill out all fields for best results.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt/Summary</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the article"
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={articleCategory} onValueChange={setArticleCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Article Type</Label>
                    <Select value={articleType} onValueChange={(value) => setArticleType(value as KnowledgeArticle['type'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="guide">Guide</SelectItem>
                          <SelectItem value="manual">Manual/Documentation</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="link">External Link</SelectItem>
                          <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="maintenance, repair, refrigerator, etc."
                    value={articleTags}
                    onChange={(e) => setArticleTags(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Article content..."
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="resize-none"
                    rows={10}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={articlePublished}
                    onCheckedChange={(checked) => setArticlePublished(checked === true)}
                  />
                  <Label htmlFor="published">Publish article immediately</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewArticleDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddArticle}>Create Article</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={newCategoryDialogOpen} onOpenChange={setNewCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your knowledge base articles.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Brief description of the category"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cat-slug">Slug (URL path)</Label>
                  <Input
                    id="cat-slug"
                    placeholder="category-slug"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave blank to auto-generate from the category name
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCategoryDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCategory}>Create Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title, tags, or content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles" className="mt-6">
          <div className="grid gap-4">
            {filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
                <FileQuestion className="w-12 h-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Articles Found</h3>
                <p className="text-sm text-muted-foreground">
                  No articles match your search criteria. Try adjusting your search or create a new article.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    clearArticleForm();
                    setNewArticleDialogOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Article
                </Button>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{article.title}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-1">
                          {article.excerpt}
                        </CardDescription>
                      </div>
                      <div className="flex items-start space-x-1">
                        <Badge variant={article.published ? "secondary" : "outline"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getArticleTypeIcon(article.type)}
                          {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Category: {categories.find(c => c.slug === article.category)?.name || article.category}</p>
                      <p>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Views: {article.views}</span>
                      <span>Helpful: {article.helpfulVotes} / Not Helpful: {article.notHelpfulVotes}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <div className="flex justify-end w-full gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setupEditArticle(article)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>
                    {category.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-sm">
                    <p>Slug: <code className="bg-muted px-1 py-0.5 rounded text-xs">{category.slug}</code></p>
                    <p className="mt-1">Articles: {category.articleCount}</p>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <div className="flex justify-end w-full gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setupEditCategory(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
                <CardDescription>Most viewed articles in the knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[...articles]
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 10)
                      .map((article, index) => (
                        <div key={article.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-mono text-sm bg-muted rounded-full h-6 w-6 flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{article.title}</p>
                              <p className="text-sm text-muted-foreground">{article.views} views</p>
                            </div>
                          </div>
                          <Badge variant="outline">{article.type}</Badge>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Helpful Ratings</CardTitle>
                <CardDescription>Articles with highest helpful ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {[...articles]
                      .filter(a => a.helpfulVotes + a.notHelpfulVotes > 0)
                      .sort((a, b) => {
                        const aRatio = a.helpfulVotes / (a.helpfulVotes + a.notHelpfulVotes);
                        const bRatio = b.helpfulVotes / (b.helpfulVotes + b.notHelpfulVotes);
                        return bRatio - aRatio;
                      })
                      .slice(0, 10)
                      .map((article, index) => {
                        const helpfulRatio = article.helpfulVotes / (article.helpfulVotes + article.notHelpfulVotes);
                        const helpfulPercent = Math.round(helpfulRatio * 100);
                        
                        return (
                          <div key={article.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="font-mono text-sm bg-muted rounded-full h-6 w-6 flex items-center justify-center">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{article.title}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span>{article.helpfulVotes} helpful / {article.notHelpfulVotes} not helpful</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={helpfulPercent >= 75 ? "secondary" : "outline"}
                            >
                              {helpfulPercent}% helpful
                            </Badge>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Article Dialog */}
      <Dialog open={editArticleDialogOpen} onOpenChange={setEditArticleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Base Article</DialogTitle>
            <DialogDescription>
              Update the article details. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter article title"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-excerpt">Excerpt/Summary</Label>
              <Textarea
                id="edit-excerpt"
                placeholder="Brief summary of the article"
                value={articleExcerpt}
                onChange={(e) => setArticleExcerpt(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={articleCategory} onValueChange={setArticleCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Article Type</Label>
                <Select value={articleType} onValueChange={(value) => setArticleType(value as KnowledgeArticle['type'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select article type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="manual">Manual/Documentation</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                placeholder="maintenance, repair, refrigerator, etc."
                value={articleTags}
                onChange={(e) => setArticleTags(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                placeholder="Article content..."
                value={articleContent}
                onChange={(e) => setArticleContent(e.target.value)}
                className="resize-none"
                rows={10}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-published"
                checked={articlePublished}
                onCheckedChange={(checked) => setArticlePublished(checked === true)}
              />
              <Label htmlFor="edit-published">Published</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditArticleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditArticle}>Update Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-cat-name">Category Name</Label>
              <Input
                id="edit-cat-name"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-cat-desc">Description</Label>
              <Textarea
                id="edit-cat-desc"
                placeholder="Brief description of the category"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-cat-slug">Slug (URL path)</Label>
              <Input
                id="edit-cat-slug"
                placeholder="category-slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
