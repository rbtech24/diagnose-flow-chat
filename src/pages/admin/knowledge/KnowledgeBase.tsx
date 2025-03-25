
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Book, Eye, Clock, Tag, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { KnowledgeArticle, useKnowledgeBaseData } from "@/hooks/useKnowledgeBaseData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { OfflineAwareKnowledgeBase } from "@/components/admin/knowledge/OfflineAwareKnowledgeBase";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

const articleFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().optional(),
  tags: z.string().transform(value => 
    value.split(',').map(tag => tag.trim()).filter(Boolean)
  ),
  is_public: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { articles, isLoading, createArticle, updateArticle, deleteArticle } = useKnowledgeBaseData();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      is_public: false,
    },
  });
  
  const handleAddArticle = () => {
    form.reset({
      title: "",
      content: "",
      category: "",
      tags: "",
      is_public: false,
    });
    setEditingArticle(null);
    setDialogOpen(true);
  };
  
  const handleEditArticle = (article: KnowledgeArticle) => {
    form.reset({
      title: article.title,
      content: article.content,
      category: article.category || "",
      tags: article.tags?.join(', ') || "",
      is_public: article.is_public,
    });
    setEditingArticle(article);
    setDialogOpen(true);
  };
  
  const handleViewArticle = (article: KnowledgeArticle) => {
    navigate(`/admin/knowledge-base/${article.id}`);
  };
  
  const onSubmit = async (data: ArticleFormValues) => {
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, data);
      } else {
        await createArticle({
          ...data,
          company_id: user?.companyId,
        });
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save article:", error);
    }
  };
  
  const handleDeleteArticle = async (article: KnowledgeArticle) => {
    const success = await deleteArticle(article.id);
    if (success) {
      toast({
        title: "Article Deleted",
        description: `"${article.title}" has been deleted`,
      });
    }
  };
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <OfflineAwareKnowledgeBase>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Your centralized repository of technical information and troubleshooting guides
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-8 w-[250px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddArticle}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px]" />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : "Add your first article to build your knowledge base"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleAddArticle}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Article
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Book className="h-5 w-5 text-primary" />
                        {article.title}
                        {article.is_public && (
                          <Badge variant="outline" className="ml-2 text-xs">Public</Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {article.content.substring(0, 200)}
                        {article.content.length > 200 ? '...' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.category && (
                          <Badge variant="secondary">{article.category}</Badge>
                        )}
                        {article.tags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">
                            <Tag className="h-3 w-3 mr-1 text-blue-500" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <div className="flex items-center">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          {article.views} views
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Updated {format(new Date(article.updated_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewArticle(article)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{article.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteArticle(article)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Edit Article" : "Add New Article"}</DialogTitle>
              <DialogDescription>
                {editingArticle 
                  ? "Update knowledge base article information." 
                  : "Create a new knowledge base article for your team or clients."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="How to fix a common issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Technical, Support, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tags separated by commas" {...field} />
                        </FormControl>
                        <FormDescription>
                          Separate tags with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter article content here..."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-primary"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Make this article public
                        </FormLabel>
                        <FormDescription>
                          Public articles can be viewed by all users and don't require authentication
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingArticle ? "Update Article" : "Create Article"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </OfflineAwareKnowledgeBase>
  );
}
