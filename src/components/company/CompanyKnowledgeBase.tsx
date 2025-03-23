import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book, 
  Search, 
  BookOpen, 
  FileText, 
  Link as LinkIcon, 
  ThumbsUp, 
  ThumbsDown, 
  Settings,
  File,
  FileSpreadsheet,
  Workflow,
  AlertTriangle,
  FileQuestion
} from "lucide-react";
import { KnowledgeArticleType } from "@/types/knowledge";
import { emptyKnowledgeArticles } from "@/utils/placeholderData";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  type: KnowledgeArticleType;
  excerpt: string;
  fromCommunityPost?: string;
}

export function CompanyKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<KnowledgeArticleType | "all">("all");
  const [knowledgeArticles] = useState<KnowledgeArticle[]>(emptyKnowledgeArticles);
  
  const filteredArticles = knowledgeArticles.filter(article => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Apply type filter
    const matchesType = typeFilter === "all" || article.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: KnowledgeArticleType) => {
    switch(type) {
      case "guide":
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      case "manual":
        return <FileText className="h-5 w-5 text-amber-500" />;
      case "faq":
        return <Book className="h-5 w-5 text-green-500" />;
      case "link":
        return <LinkIcon className="h-5 w-5 text-purple-500" />;
      case "troubleshooting":
        return <Settings className="h-5 w-5 text-orange-500" />;
      case "tech-sheet":
        return <FileSpreadsheet className="h-5 w-5 text-cyan-500" />;
      case "service-manual":
        return <File className="h-5 w-5 text-indigo-500" />;
      case "wire-diagram":
        return <Workflow className="h-5 w-5 text-rose-500" />;
      case "technical-alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "misc-document":
        return <FileQuestion className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: KnowledgeArticleType) => {
    switch(type) {
      case "tech-sheet":
        return "Tech Sheet";
      case "service-manual":
        return "Service Manual";
      case "wire-diagram":
        return "Wire Diagram";
      case "technical-alert":
        return "Technical Alert";
      case "misc-document":
        return "Misc Document";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const isDocumentType = (type: KnowledgeArticleType) => {
    return ["tech-sheet", "service-manual", "wire-diagram", "technical-alert", "misc-document"].includes(type);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-blue-500" />
          <CardTitle>Knowledge Base</CardTitle>
        </div>
        <CardDescription>
          Access repair guides, manuals, technical documents and resources
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
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={typeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={typeFilter === "tech-sheet" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("tech-sheet")}
            className="flex items-center gap-1"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Tech Sheets
          </Button>
          <Button 
            variant={typeFilter === "service-manual" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("service-manual")}
            className="flex items-center gap-1"
          >
            <File className="h-3.5 w-3.5" />
            Service Manuals
          </Button>
          <Button 
            variant={typeFilter === "wire-diagram" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("wire-diagram")}
            className="flex items-center gap-1"
          >
            <Workflow className="h-3.5 w-3.5" />
            Wire Diagrams
          </Button>
          <Button 
            variant={typeFilter === "technical-alert" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("technical-alert")}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Technical Alerts
          </Button>
          <Button 
            variant={typeFilter === "misc-document" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTypeFilter("misc-document")}
            className="flex items-center gap-1"
          >
            <FileQuestion className="h-3.5 w-3.5" />
            Misc Documents
          </Button>
        </div>
        
        <ScrollArea className="flex-grow h-[280px] pr-4">
          <div className="space-y-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTypeIcon(article.type)}</div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        {article.fromCommunityPost && (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" />
                            From Community
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <div className="text-xs px-2 py-0.5 bg-slate-100 rounded-full inline-block">
                          {article.category}
                        </div>
                        <div className="text-xs px-2 py-0.5 bg-slate-100 rounded-full inline-block">
                          {getTypeLabel(article.type)}
                        </div>
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
                        {isDocumentType(article.type) && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 ml-auto">
                            <FileText className="h-3.5 w-3.5" />
                            Download
                          </Button>
                        )}
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
