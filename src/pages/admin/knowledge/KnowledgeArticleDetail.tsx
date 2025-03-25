
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useKnowledgeArticles } from "@/hooks/useKnowledgeArticles";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ArticleForm, ArticleFormValues } from "@/components/admin/knowledge/ArticleForm";

export default function KnowledgeArticleDetail() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { getArticle, updateArticle } = useKnowledgeArticles();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      setIsLoading(true);
      try {
        const fetchedArticle = await getArticle(articleId);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, getArticle]);

  const getFormInitialValues = (): ArticleFormValues => {
    if (!article) {
      return {
        title: "",
        content: "",
        category: "",
        is_public: false,
        tags: [],
      };
    }
    
    const tags = Array.isArray(article.tags) ? article.tags : [];
    
    return {
      title: article.title,
      content: article.content,
      category: article.category || '',
      is_public: article.is_public,
      tags,
    };
  };

  const handleSubmit = async (values: ArticleFormValues) => {
    if (!articleId) return;
    
    try {
      setIsSubmitting(true);
      
      const updatedArticle = await updateArticle(articleId, {
        ...values,
        tags: values.tags,
      });
      
      if (updatedArticle) {
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/knowledge")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-64 mb-2" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-40" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/admin/knowledge")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Article Not Found</h3>
              <p className="text-muted-foreground">
                The requested article could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/knowledge")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold ml-4">Edit Article</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Edit the title, content, and visibility of this article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm 
            initialData={getFormInitialValues()}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
