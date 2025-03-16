
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Search, BookOpen, FileText, Link as LinkIcon, ThumbsUp, ThumbsDown } from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  type: "guide" | "manual" | "faq" | "link";
  excerpt: string;
}

const mockKnowledgeArticles: KnowledgeArticle[] = [
  {
    id: "kb-001",
    title: "Refrigerator Compressor Troubleshooting Guide",
    category: "Refrigeration",
    type: "guide",
    excerpt: "Step-by-step process for diagnosing and repairing common compressor issues in residential refrigerators."
  },
  {
    id: "kb-002",
    title: "HVAC System 3000 Service Manual",
    category: "HVAC",
    type: "manual",
    excerpt: "Complete technical specifications and repair procedures for the HVAC System 3000 series."
  },
  {
    id: "kb-003",
    title: "Common Washing Machine Leaks and Fixes",
    category: "Laundry",
    type: "faq",
    excerpt: "Frequently asked questions about detecting and repairing water leaks in various washing machine models."
  },
  {
    id: "kb-004",
    title: "Commercial Freezer Temperature Calibration",
    category: "Commercial",
    type: "guide",
    excerpt: "Guidelines for proper temperature calibration and troubleshooting inconsistencies in commercial freezers."
  },
  {
    id: "kb-005",
    title: "Manufacturer Support Resources",
    category: "Resources",
    type: "link",
    excerpt: "Direct links to manufacturer support portals, warranty information, and parts ordering systems."
  }
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredArticles = searchQuery 
    ? mockKnowledgeArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockKnowledgeArticles;

  const getTypeIcon = (type: KnowledgeArticle["type"]) => {
    switch(type) {
      case "guide":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "manual":
        return <FileText className="h-5 w-5 text-amber-500" />;
      case "faq":
        return <Book className="h-5 w-5 text-green-500" />;
      case "link":
        return <LinkIcon className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-blue-500" />
          <CardTitle>Knowledge Base</CardTitle>
        </div>
        <CardDescription>
          Access repair guides, manuals, and resources
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-grow h-[280px] pr-4">
          <div className="space-y-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTypeIcon(article.type)}</div>
                    <div>
                      <h3 className="font-medium mb-1">{article.title}</h3>
                      <div className="text-xs px-2 py-0.5 bg-slate-100 rounded-full inline-block mb-2">
                        {article.category}
                      </div>
                      <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                          <ThumbsDown className="h-3.5 w-3.5" />
                          Not Helpful
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No articles found matching your search
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">Browse All Resources</Button>
      </CardFooter>
    </Card>
  );
}
