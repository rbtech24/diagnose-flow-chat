
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FolderPlus, FileText, Trash2, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");
  
  // Simulated data
  const articles = [
    { id: "1", title: "Troubleshooting Refrigerator Cooling Issues", category: "Refrigerators", status: "published", views: 1280, lastUpdate: "3 days ago" },
    { id: "2", title: "Washing Machine Error Codes: Complete Guide", category: "Washing Machines", status: "published", views: 950, lastUpdate: "1 week ago" },
    { id: "3", title: "Dryer Not Heating: Diagnosis Steps", category: "Dryers", status: "draft", views: 0, lastUpdate: "2 days ago" },
    { id: "4", title: "Dishwasher Not Draining: Quick Fixes", category: "Dishwashers", status: "published", views: 762, lastUpdate: "2 weeks ago" },
  ];
  
  const categories = [
    { id: "1", name: "Refrigerators", articleCount: 12, lastUpdate: "3 days ago" },
    { id: "2", name: "Washing Machines", articleCount: 8, lastUpdate: "1 week ago" },
    { id: "3", name: "Dryers", articleCount: 6, lastUpdate: "2 days ago" },
    { id: "4", name: "Dishwashers", articleCount: 9, lastUpdate: "2 weeks ago" },
    { id: "5", name: "Ovens & Ranges", articleCount: 7, lastUpdate: "1 month ago" },
  ];
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage technical documentation and troubleshooting guides</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search knowledge base..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "articles" ? "New Article" : "New Category"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="articles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Knowledge Articles</CardTitle>
              <CardDescription>Manage troubleshooting guides and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No articles match your search" : "No articles found"}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{article.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">Category: {article.category}</p>
                            <span>•</span>
                            <p className="text-sm text-muted-foreground">Views: {article.views}</p>
                            <span>•</span>
                            <p className="text-sm text-muted-foreground">Updated: {article.lastUpdate}</p>
                            <Badge variant={article.status === "published" ? "default" : "outline"}>
                              {article.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Knowledge Categories</CardTitle>
              <CardDescription>Organize your knowledge base by categories</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No categories match your search" : "No categories found"}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FolderPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{category.articleCount} articles</p>
                            <span>•</span>
                            <p className="text-sm text-muted-foreground">Last updated: {category.lastUpdate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
