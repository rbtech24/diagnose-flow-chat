
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  FileSpreadsheet, 
  File, 
  Workflow 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
      {showDocumentFilters && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">Post Type</h3>
          <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full mb-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Posts</TabsTrigger>
              <TabsTrigger value="questions" className="flex-1">Questions</TabsTrigger>
              <TabsTrigger value="tech-sheet" className="flex-1 flex items-center justify-center gap-1">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Tech Sheets
              </TabsTrigger>
              <TabsTrigger value="wire-diagram" className="flex-1 flex items-center justify-center gap-1">
                <Workflow className="h-3.5 w-3.5" />
                Wire Diagrams
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <h3 className="text-lg font-medium mb-4">Filter by Tags</h3>
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
      </div>
    </div>
  );
}
