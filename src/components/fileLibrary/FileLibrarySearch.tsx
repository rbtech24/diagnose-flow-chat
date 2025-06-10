
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { FileCategory, SearchFilters } from '@/types/fileLibrary';

interface FileLibrarySearchProps {
  categories: FileCategory[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function FileLibrarySearch({
  categories,
  filters,
  onFiltersChange,
  onSearch,
  isLoading
}: FileLibrarySearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !filters.tags?.includes(tagInput.trim())) {
      onFiltersChange({
        ...filters,
        tags: [...(filters.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onFiltersChange({
      ...filters,
      tags: filters.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const fileTypes = [
    { value: 'tech_sheet', label: 'Tech Sheets' },
    { value: 'wire_diagram', label: 'Wire Diagrams' },
    { value: 'image', label: 'Images' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' }
  ];

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg border">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files by title, description, or tags..."
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <Button onClick={onSearch} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                File Type
              </label>
              <Select
                value={filters.fileType || ''}
                onValueChange={(value) => 
                  onFiltersChange({ 
                    ...filters, 
                    fileType: value || undefined 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All file types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All file types</SelectItem>
                  {fileTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category
              </label>
              <Select
                value={filters.categoryId || ''}
                onValueChange={(value) => 
                  onFiltersChange({ 
                    ...filters, 
                    categoryId: value || undefined 
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Visibility
              </label>
              <Select
                value={filters.visibility}
                onValueChange={(value: 'public' | 'company_only' | 'private') => 
                  onFiltersChange({ ...filters, visibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="company_only">Company Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
