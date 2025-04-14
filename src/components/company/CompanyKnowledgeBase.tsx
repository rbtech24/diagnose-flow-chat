
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKnowledgeBaseData } from "@/hooks/useKnowledgeBaseData";
import { KnowledgeArticle } from "@/hooks/useKnowledgeBaseData";
import { FileText, Search, Filter, PlusCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export function CompanyKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    articles, 
    categories, 
    isLoading, 
    error 
  } = useKnowledgeBaseData();
  const navigate = useNavigate();
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateArticle = () => {
    navigate("/company/knowledge/new");
  };

  const handleViewArticle = (id: string) => {
    navigate(`/company/knowledge/${id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">Error loading knowledge base data</div>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateArticle}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No Articles Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? "No articles match your search query. Try different keywords."
                  : "No knowledge base articles have been created yet."}
              </p>
              {!searchQuery && (
                <Button className="mt-4" onClick={handleCreateArticle}>
                  Create Your First Article
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <KnowledgeArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={() => handleViewArticle(article.id)} 
                />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles
                  .filter((article) => article.category === category)
                  .map((article) => (
                    <KnowledgeArticleCard 
                      key={article.id} 
                      article={article} 
                      onClick={() => handleViewArticle(article.id)} 
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function KnowledgeArticleCard({ article, onClick }: { article: KnowledgeArticle; onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="line-clamp-3 text-sm text-muted-foreground mb-3">
          {article.content}
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {article.category}
          </span>
          <span className="text-muted-foreground">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
