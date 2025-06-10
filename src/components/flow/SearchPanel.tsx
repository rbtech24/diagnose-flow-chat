
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, X, Eye } from 'lucide-react';
import { NodeTypeFilter, SearchResult } from '@/hooks/useWorkflowSearch';

interface SearchPanelProps {
  searchTerm: string;
  typeFilter: NodeTypeFilter;
  searchResults: SearchResult[];
  hasActiveFilters: boolean;
  onSearch: (term: string) => void;
  onTypeFilter: (type: NodeTypeFilter) => void;
  onClearSearch: () => void;
  onFocusNode: (nodeId: string) => void;
}

const nodeTypeLabels: Record<NodeTypeFilter, string> = {
  all: 'All Types',
  question: 'Questions',
  solution: 'Solutions',
  test: 'Tests',
  measurement: 'Measurements',
  start: 'Start Nodes',
  action: 'Actions'
};

const nodeTypeColors: Record<Exclude<NodeTypeFilter, 'all'>, string> = {
  question: 'bg-blue-100 text-blue-800',
  solution: 'bg-green-100 text-green-800',
  test: 'bg-yellow-100 text-yellow-800',
  measurement: 'bg-purple-100 text-purple-800',
  start: 'bg-emerald-100 text-emerald-800',
  action: 'bg-orange-100 text-orange-800'
};

export function SearchPanel({
  searchTerm,
  typeFilter,
  searchResults,
  hasActiveFilters,
  onSearch,
  onTypeFilter,
  onClearSearch,
  onFocusNode
}: SearchPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'label':
        return '🏷️';
      case 'content':
        return '📝';
      case 'type':
        return '🔧';
      default:
        return '📄';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-10 h-9"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => onSearch('')}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Filter Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={typeFilter !== 'all' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {nodeTypeLabels[typeFilter]}
            {typeFilter !== 'all' && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {searchResults.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Type</h4>
            <div className="space-y-1">
              {Object.entries(nodeTypeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onTypeFilter(type as NodeTypeFilter)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Results Dropdown */}
      {hasActiveFilters && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Results ({searchResults.length})
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Search Results</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSearch}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No results found
                    </p>
                  ) : (
                    searchResults.map((result, index) => (
                      <div
                        key={`${result.nodeId}-${index}`}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer"
                        onClick={() => {
                          onFocusNode(result.nodeId);
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {getMatchTypeIcon(result.matchType)}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {result.matchText}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {result.nodeId}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {result.matchType}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0 h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSearch}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
