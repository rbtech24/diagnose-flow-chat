
import { useState } from "react";
import { DocumentManagement } from "@/components/admin/knowledge/DocumentManagement";
import { Button } from "@/components/ui/button";
import { KnowledgeArticle, KnowledgeCategory } from "@/types/knowledge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for knowledge articles
const mockArticles: KnowledgeArticle[] = [
  {
    id: "1",
    title: "Troubleshooting Refrigerator Cooling Issues",
    content: "This guide covers the most common refrigerator cooling problems and their solutions...",
    excerpt: "Learn how to diagnose and fix refrigerator cooling problems quickly.",
    category: "refrigerators",
    type: "troubleshooting",
    tags: ["cooling", "maintenance", "refrigerator"],
    author: "John Smith",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-06-22T14:45:00Z",
    published: true,
    views: 1245,
    helpfulVotes: 87,
    notHelpfulVotes: 12
  },
  {
    id: "2",
    title: "Washer Error Code Guide",
    content: "A comprehensive list of error codes for major washer brands and their meanings...",
    excerpt: "Quick reference for all washing machine error codes and troubleshooting steps.",
    category: "washers",
    type: "guide",
    tags: ["error codes", "washer", "diagnostics"],
    author: "Sarah Johnson",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-07-05T16:20:00Z",
    published: true,
    views: 2431,
    helpfulVotes: 156,
    notHelpfulVotes: 8
  },
  {
    id: "3",
    title: "Oven Temperature Calibration",
    content: "Step-by-step instructions for calibrating oven temperature for accurate cooking...",
    excerpt: "How to ensure your oven maintains the correct temperature for perfect results.",
    category: "ovens",
    type: "manual",
    tags: ["calibration", "temperature", "oven", "maintenance"],
    author: "Michael Brown",
    createdAt: "2023-01-28T13:40:00Z",
    updatedAt: "2023-05-17T11:10:00Z",
    published: true,
    views: 987,
    helpfulVotes: 65,
    notHelpfulVotes: 5
  },
  {
    id: "kb-006",
    title: "Whirlpool WRF535SWHZ Technical Sheet",
    content: "Technical specifications and component details for Whirlpool French Door Refrigerator...",
    excerpt: "Technical specifications and component details for Whirlpool WRF535SWHZ French Door Refrigerator.",
    category: "refrigerators",
    type: "tech-sheet",
    tags: ["technical", "specifications", "whirlpool", "refrigerator"],
    author: "Tech Support",
    createdAt: "2023-05-12T14:30:00Z",
    updatedAt: "2023-06-10T09:15:00Z",
    published: true,
    views: 423,
    helpfulVotes: 38,
    notHelpfulVotes: 2
  },
  {
    id: "kb-007",
    title: "GE Profile Dishwasher PDT715 Wiring Diagram",
    content: "Complete wire diagram with component connections for GE Profile PDT715 series dishwashers...",
    excerpt: "Complete wire diagram with component connections for GE Profile PDT715 series dishwashers.",
    category: "dishwashers",
    type: "wire-diagram",
    tags: ["wiring", "diagram", "ge", "dishwasher"],
    author: "Engineering Team",
    createdAt: "2023-04-18T11:45:00Z",
    updatedAt: "2023-05-22T16:30:00Z",
    published: true,
    views: 287,
    helpfulVotes: 29,
    notHelpfulVotes: 1
  },
  {
    id: "kb-009",
    title: "Safety Alert: Samsung Refrigerator Ice Maker Recall",
    content: "Important safety information regarding Samsung ice maker recall affecting models produced between 2016-2018...",
    excerpt: "Important safety information regarding Samsung ice maker recall affecting models produced between 2016-2018.",
    category: "refrigerators",
    type: "technical-alert",
    tags: ["safety", "recall", "samsung", "ice maker"],
    author: "Safety Team",
    createdAt: "2023-07-05T09:00:00Z",
    updatedAt: "2023-07-05T09:00:00Z",
    published: true,
    views: 752,
    helpfulVotes: 98,
    notHelpfulVotes: 4
  }
];

// Mock data for categories
const mockCategories: KnowledgeCategory[] = [
  { id: "1", name: "Refrigerators", description: "All refrigerator-related knowledge", slug: "refrigerators", articleCount: 42 },
  { id: "2", name: "Washers", description: "Washing machine guides and troubleshooting", slug: "washers", articleCount: 35 },
  { id: "3", name: "Dryers", description: "Dryer maintenance and repair articles", slug: "dryers", articleCount: 28 },
  { id: "4", name: "Dishwashers", description: "Dishwasher guides and problem solutions", slug: "dishwashers", articleCount: 31 },
  { id: "5", name: "HVAC", description: "Heating, ventilation, and air conditioning resources", slug: "hvac", articleCount: 47 },
  { id: "6", name: "Ovens", description: "Oven and range repair and maintenance", slug: "ovens", articleCount: 29 },
  { id: "7", name: "Microwaves", description: "Microwave troubleshooting and guides", slug: "microwaves", articleCount: 18 },
  { id: "8", name: "Water Heaters", description: "Water heater installation and maintenance", slug: "water-heaters", articleCount: 22 }
];

export default function KnowledgeDocuments() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
  const [categories] = useState<KnowledgeCategory[]>(mockCategories);
  
  // Add new article
  const handleAddArticle = (articleData: Omit<KnowledgeArticle, "id" | "createdAt" | "updatedAt" | "views" | "helpfulVotes" | "notHelpfulVotes">) => {
    const now = new Date().toISOString();
    const newArticle: KnowledgeArticle = {
      id: `kb-${Date.now()}`,
      ...articleData,
      createdAt: now,
      updatedAt: now,
      views: 0,
      helpfulVotes: 0,
      notHelpfulVotes: 0
    };
    
    setArticles([...articles, newArticle]);
    toast.success("Document added successfully");
  };
  
  // Update existing article
  const handleEditArticle = (updatedArticle: KnowledgeArticle) => {
    setArticles(articles.map(article => 
      article.id === updatedArticle.id ? updatedArticle : article
    ));
    toast.success("Document updated successfully");
  };
  
  // Delete article
  const handleDeleteArticle = (articleId: string) => {
    setArticles(articles.filter(article => article.id !== articleId));
    toast.success("Document deleted successfully");
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Document Management</h1>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="requests">Document Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-6">
          <DocumentManagement
            articles={articles}
            categories={categories}
            onAddArticle={handleAddArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <div className="p-8 text-center text-muted-foreground">
            <p>Category management will be implemented in a future update</p>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6">
          <div className="p-8 text-center text-muted-foreground">
            <p>Document requests from community will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
