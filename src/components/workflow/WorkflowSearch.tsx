
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  User,
  Tag,
  Folder
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: string;
  author: string;
  tags: string[];
  nodeCount: string;
  complexity: string;
}

interface WorkflowSearchProps {
  workflows: SavedWorkflow[];
  onFilteredResults: (filtered: SavedWorkflow[]) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function WorkflowSearch({ 
  workflows, 
  onFilteredResults, 
  onSearchChange 
}: WorkflowSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    dateRange: '',
    author: '',
    tags: [],
    nodeCount: '',
    complexity: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(workflows.map(w => w.metadata.folder).filter(Boolean)));
    const authors = Array.from(new Set(workflows.map(w => w.metadata.author || 'Unknown').filter(Boolean)));
    const allTags = Array.from(new Set(workflows.flatMap(w => w.metadata.tags || [])));
    
    return { categories, authors, tags: allTags };
  }, [workflows]);

  // Filter workflows based on current filters
  const filteredWorkflows = useMemo(() => {
    let result = [...workflows];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(workflow => 
        workflow.metadata.name.toLowerCase().includes(searchLower) ||
        workflow.metadata.description?.toLowerCase().includes(searchLower) ||
        workflow.metadata.folder.toLowerCase().includes(searchLower) ||
        workflow.nodes.some(node => 
          node.data?.title?.toLowerCase().includes(searchLower) ||
          node.data?.content?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(workflow => workflow.metadata.folder === filters.category);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      result = result.filter(workflow => 
        new Date(workflow.metadata.updatedAt) >= cutoffDate
      );
    }

    // Node count filter
    if (filters.nodeCount) {
      switch (filters.nodeCount) {
        case 'small':
          result = result.filter(workflow => workflow.nodes.length <= 5);
          break;
        case 'medium':
          result = result.filter(workflow => workflow.nodes.length > 5 && workflow.nodes.length <= 15);
          break;
        case 'large':
          result = result.filter(workflow => workflow.nodes.length > 15);
          break;
      }
    }

    // Complexity filter (based on edges and node types)
    if (filters.complexity) {
      result = result.filter(workflow => {
        const complexity = calculateComplexity(workflow);
        switch (filters.complexity) {
          case 'simple':
            return complexity <= 2;
          case 'moderate':
            return complexity > 2 && complexity <= 5;
          case 'complex':
            return complexity > 5;
          default:
            return true;
        }
      });
    }

    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter(workflow => 
        filters.tags.some(tag => workflow.metadata.tags?.includes(tag))
      );
    }

    return result;
  }, [workflows, filters]);

  // Calculate workflow complexity
  const calculateComplexity = (workflow: SavedWorkflow): number => {
    const nodeCount = workflow.nodes.length;
    const edgeCount = workflow.edges.length;
    const enhancedNodes = workflow.nodes.filter(node => 
      ['decision-tree', 'equipment-test', 'data-form', 'photo-capture'].includes(node.data?.type || '')
    ).length;
    
    return Math.round((nodeCount * 0.3) + (edgeCount * 0.4) + (enhancedNodes * 0.8));
  };

  // Update filters
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (key === 'searchTerm') {
      onSearchChange?.(value);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      searchTerm: '',
      category: '',
      dateRange: '',
      author: '',
      tags: [],
      nodeCount: '',
      complexity: ''
    };
    setFilters(emptyFilters);
    onSearchChange?.('');
  };

  // Apply filtered results
  React.useEffect(() => {
    onFilteredResults(filteredWorkflows);
  }, [filteredWorkflows, onFilteredResults]);

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search workflows, content, or descriptions..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {Object.values(filters).filter(value => 
                Array.isArray(value) ? value.length > 0 : value !== ''
              ).length}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Category
                </label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => updateFilter('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {filterOptions.categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Updated
                </label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => updateFilter('dateRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Select 
                  value={filters.nodeCount} 
                  onValueChange={(value) => updateFilter('nodeCount', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any size</SelectItem>
                    <SelectItem value="small">Small (≤5 steps)</SelectItem>
                    <SelectItem value="medium">Medium (6-15 steps)</SelectItem>
                    <SelectItem value="large">Large (>15 steps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Complexity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Complexity</label>
                <Select 
                  value={filters.complexity} 
                  onValueChange={(value) => updateFilter('complexity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any complexity</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Filter */}
            {filterOptions.tags.length > 0 && (
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.tags.map(tag => (
                    <Button
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newTags = filters.tags.includes(tag)
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        updateFilter('tags', newTags);
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredWorkflows.length} of {workflows.length} workflows
        </span>
        {hasActiveFilters && (
          <span>
            {workflows.length - filteredWorkflows.length} workflows filtered out
          </span>
        )}
      </div>
    </div>
  );
}
