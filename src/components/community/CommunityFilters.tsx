
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CommunityFiltersProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function CommunityFilters({
  tags,
  selectedTags,
  onTagSelect
}: CommunityFiltersProps) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
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
