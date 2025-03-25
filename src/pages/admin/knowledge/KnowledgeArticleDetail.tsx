
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, Tag, Edit, Trash, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { KnowledgeArticle, useKnowledgeBaseData } from "@/hooks/useKnowledgeBaseData";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { OfflineAwareKnowledgeBase } from "@/components/admin/knowledge/OfflineAwareKnowledgeBase";

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

export default function KnowledgeArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articles, isLoading, updateArticle, deleteArticle, incrementArticleViews } = useKnowledgeBaseData();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
  
  useEffect(() => {
    if (!isLoading && id) {
      const foundArticle = articles.find(a => a.id === id);
      setArticle(foundArticle || null);
      
      if (foundArticle) {
        // Increment view count
        incrementArticleViews(foundArticle.id);
        
        // Set form values for editing
        form.reset({
          title: foundArticle.title,
          content: foundArticle.content,
          category: foundArticle.category || "",
          tags: foundArticle.tags?.join(', ') || "",
          is_public: foundArticle.is_public,
        });
      }
    }
  }, [id, articles, isLoading, incrementArticleViews, form]);
  
  const handleEditArticle = () => {
    setDialogOpen(true);
  };
  
  const onSubmit = async (data: ArticleFormValues) => {
    if (!article) return;
    
    try {
      await updateArticle(article.id, data);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to update article:", error);
    }
  };
  
  const handleDeleteArticle = async () => {
    if (!article) return;
    
    const success = await deleteArticle(article.id);
    if (success) {
      navigate('/admin/knowledge-base');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/knowledge-base")} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/knowledge-base")} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Article Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">The article you're looking for doesn't exist</h2>
              <p className="text-muted-foreground mb-4">It may have been deleted or moved.</p>
              <Button onClick={() => navigate("/admin/knowledge-base")}>
                Return to Knowledge Base
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <OfflineAwareKnowledgeBase>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/knowledge-base")} 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{article.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEditArticle}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
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
                    onClick={handleDeleteArticle}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className={article.is_public ? "bg-green-50" : "bg-yellow-50"}>
                {article.is_public ? (
                  <>
                    <Globe className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-700">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1 text-yellow-500" />
                    <span className="text-yellow-700">Private</span>
                  </>
                )}
              </Badge>
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
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {format(new Date(article.updated_at), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.views} views
              </div>
            </div>
            
            <div className="prose max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>
                Update knowledge base article information.
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
                    Update Article
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
