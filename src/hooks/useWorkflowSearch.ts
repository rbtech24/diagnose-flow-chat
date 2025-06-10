
import { useState, useCallback, useMemo } from 'react';
import { Node } from '@xyflow/react';

export type NodeTypeFilter = 'all' | 'question' | 'solution' | 'test' | 'measurement' | 'start' | 'action';

export interface SearchResult {
  nodeId: string;
  matchType: 'label' | 'content' | 'type';
  matchText: string;
}

export function useWorkflowSearch(nodes: Node[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<NodeTypeFilter>('all');
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() && typeFilter === 'all') {
      return [];
    }

    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase().trim();

    nodes.forEach(node => {
      // Type filter check
      if (typeFilter !== 'all') {
        const nodeType = node.data?.type || 'question';
        if (nodeType !== typeFilter) {
          return;
        }
      }

      // Search term check
      if (term) {
        const label = node.data?.label?.toLowerCase() || '';
        const content = node.data?.content?.toLowerCase() || '';
        const richInfo = node.data?.richInfo?.toLowerCase() || '';

        if (label.includes(term)) {
          results.push({
            nodeId: node.id,
            matchType: 'label',
            matchText: node.data?.label || node.id
          });
        } else if (content.includes(term)) {
          results.push({
            nodeId: node.id,
            matchType: 'content',
            matchText: content.substring(0, 50) + '...'
          });
        } else if (richInfo.includes(term)) {
          results.push({
            nodeId: node.id,
            matchType: 'content',
            matchText: richInfo.substring(0, 50) + '...'
          });
        }
      } else if (typeFilter !== 'all') {
        // If only type filter is active, include all nodes of that type
        results.push({
          nodeId: node.id,
          matchType: 'type',
          matchText: node.data?.label || node.id
        });
      }
    });

    return results;
  }, [nodes, searchTerm, typeFilter]);

  const filteredNodeIds = useMemo(() => {
    return new Set(searchResults.map(result => result.nodeId));
  }, [searchResults]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      setHighlightedNodes(filteredNodeIds);
    } else {
      setHighlightedNodes(new Set());
    }
  }, [filteredNodeIds]);

  const handleTypeFilter = useCallback((type: NodeTypeFilter) => {
    setTypeFilter(type);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setTypeFilter('all');
    setHighlightedNodes(new Set());
  }, []);

  const focusNode = useCallback((nodeId: string) => {
    setHighlightedNodes(new Set([nodeId]));
  }, []);

  return {
    searchTerm,
    typeFilter,
    searchResults,
    filteredNodeIds,
    highlightedNodes,
    handleSearch,
    handleTypeFilter,
    clearSearch,
    focusNode,
    hasActiveFilters: searchTerm.trim() !== '' || typeFilter !== 'all'
  };
}
