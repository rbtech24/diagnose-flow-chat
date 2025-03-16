
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  FileSpreadsheet, 
  File, 
  Workflow,
  CheckCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export interface CommunityFiltersProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  showDocumentFilters?: boolean;
}

export function CommunityFilters({
  tags,
  selectedTags,
  onTagSelect,
  activeTab = "all",
  onTabChange,
  showDocumentFilters = false
}: CommunityFiltersProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filter by Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {showDocumentFilters && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-3">Post Type</h3>
            <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full mb-2">
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="question">Questions</TabsTrigger>
                <TabsTrigger value="tech-sheet-request" className="flex items-center justify-center gap-1">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  {!isMobile && "Tech Sheets"}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => onTagSelect(tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
          
          {tags.length === 0 && (
            <p className="text-sm text-muted-foreground">No tags available</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            Cooling Issue
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            Refrigerator
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            Washing Machine
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            Dishwasher
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            Samsung
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {}}
          >
            LG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
