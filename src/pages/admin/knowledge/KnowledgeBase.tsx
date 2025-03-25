
import React, { useState } from "react";
import { useKnowledgeBaseData } from "@/hooks/useKnowledgeBaseData";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Tag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function KnowledgeBase() {
  const { articles, isLoading, createArticle } = useKnowledgeBaseData();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    is_public: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewArticle(prev => ({ ...prev, is_public: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user && user.companyId) {
      const tagsArray = newArticle.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      await createArticle({
        title: newArticle.title,
        content: newArticle.content,
        category: newArticle.category,
        tags: tagsArray,
        is_public: newArticle.is_public,
        company_id: user.companyId
      });
      
      // Reset form and close dialog
      setNewArticle({
        title: "",
        content: "",
        category: "",
        tags: "",
        is_public: false
      });
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div>Loading knowledge base...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Knowledge Article</DialogTitle>
                <DialogDescription>
                  Create a new knowledge base article to share information with your team.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={newArticle.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    name="category"
                    value={newArticle.category}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags"
                    placeholder="e.g. guide, troubleshooting, setup"
                    value={newArticle.tags}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    name="content"
                    rows={6}
                    value={newArticle.content}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_public" 
                    checked={newArticle.is_public}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_public">Make article public</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Article</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {articles.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">No articles found in your knowledge base.</p>
          <Button
            onClick={() => setIsDialogOpen(true)}
          >
            Add Your First Article
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>
                  {article.category || "Uncategorized"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="line-clamp-3 text-sm text-gray-500">
                  {article.content}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {Array.isArray(article.tags) && article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views} views
                </div>
                <Button variant="outline" size="sm">
                  View Article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
