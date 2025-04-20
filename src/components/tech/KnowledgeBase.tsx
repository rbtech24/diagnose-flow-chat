
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/utils/toast-helpers";

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  type: KnowledgeArticleType;
  excerpt: string;
  fromCommunityPost?: string;
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<KnowledgeArticleType | "all">("all");
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchKnowledgeArticles();
  }, [user?.id]);
  
  const fetchKnowledgeArticles = async () => {
    try {
      setLoading(true);
      
      // Get all knowledge articles that are public or belong to the user's company
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .or(`is_public.eq.true,company_id.eq.${user?.companyId || '00000000-0000-0000-0000-000000000000'}`);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform the data to match our KnowledgeArticle interface
        const transformedData: KnowledgeArticle[] = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category || 'General',
          // Map database category to our type, defaulting to "guide"
          type: mapCategoryToType(item.category) || 'guide',
          excerpt: item.content.substring(0, 120) + '...',
          // If it came from a community post, add a reference
          fromCommunityPost: item.from_community_post
        }));
        
        setArticles(transformedData);
      } else {
        // No data found, use sample data
        setArticles(mockKnowledgeArticles);
      }
    } catch (error) {
      console.error('Error fetching knowledge articles:', error);
      showToast.error("Failed to load knowledge articles");
      // Fallback to mock data
      setArticles(mockKnowledgeArticles);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to map database categories to our article types
  const mapCategoryToType = (category?: string): KnowledgeArticleType | undefined => {
    if (!category) return undefined;
    
    category = category.toLowerCase();
    if (category.includes('guide')) return 'guide';
    if (category.includes('manual')) return 'manual';
    if (category.includes('sheet') || category.includes('spec')) return 'tech-sheet';
    if (category.includes('diagram')) return 'wire-diagram';
    if (category.includes('faq')) return 'faq';
    if (category.includes('link')) return 'link';
    if (category.includes('alert')) return 'technical-alert';
    if (category.includes('trouble')) return 'troubleshooting';
    return 'misc-document';
  };
  
  const filteredArticles = articles.filter(article => {
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

  if (loading) {
    return <div className="animate-pulse p-4">Loading knowledge base...</div>;
  }

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

// Fallback mock data in case the real data cannot be fetched
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
  },
  {
    id: "kb-006",
    title: "Whirlpool WRF535SWHZ Technical Sheet",
    category: "Refrigeration",
    type: "tech-sheet",
    excerpt: "Technical specifications and component details for Whirlpool WRF535SWHZ French Door Refrigerator."
  },
  {
    id: "kb-007",
    title: "GE Profile Dishwasher PDT715 Wiring Diagram",
    category: "Dishwashers",
    type: "wire-diagram",
    excerpt: "Complete wire diagram with component connections for GE Profile PDT715 series dishwashers."
  },
  {
    id: "kb-008",
    title: "Maytag MHW5630HW Service Manual",
    category: "Laundry",
    type: "service-manual",
    excerpt: "Comprehensive service guide for Maytag MHW5630HW washing machine including disassembly instructions."
  },
  {
    id: "kb-009",
    title: "Safety Alert: Samsung Refrigerator Ice Maker Recall",
    category: "Refrigeration",
    type: "technical-alert",
    excerpt: "Important safety information regarding Samsung ice maker recall affecting models produced between 2016-2018."
  },
  {
    id: "kb-010",
    title: "Warranty Processing Guidelines",
    category: "Administrative",
    type: "misc-document",
    excerpt: "Documentation outlining proper procedures for processing warranty claims across all major manufacturers."
  }
];
