
import { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { SavedWorkflow } from '@/utils/flow/types';

export interface WorkflowVersion {
  id: string;
  timestamp: Date;
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  description: string;
  isAutoSave: boolean;
}

interface UseVersionHistoryProps {
  currentWorkflow?: SavedWorkflow;
  maxVersions?: number;
}

export function useVersionHistory({
  currentWorkflow,
  maxVersions = 20
}: UseVersionHistoryProps) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);

  // Get storage key for the current workflow
  const getStorageKey = useCallback(() => {
    if (!currentWorkflow?.metadata?.name) return null;
    return `workflow-versions-${currentWorkflow.metadata.name}`;
  }, [currentWorkflow?.metadata?.name]);

  // Load versions from localStorage
  const loadVersions = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedVersions = JSON.parse(stored).map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp)
        }));
        setVersions(parsedVersions);
      }
    } catch (error) {
      console.error('Failed to load version history:', error);
    }
  }, [getStorageKey]);

  // Save versions to localStorage
  const saveVersions = useCallback((newVersions: WorkflowVersion[]) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(newVersions));
    } catch (error) {
      console.error('Failed to save version history:', error);
    }
  }, [getStorageKey]);

  // Add a new version
  const addVersion = useCallback((
    nodes: Node[],
    edges: Edge[],
    nodeCounter: number,
    description: string = 'Auto-save',
    isAutoSave: boolean = true
  ) => {
    const newVersion: WorkflowVersion = {
      id: `v${Date.now()}`,
      timestamp: new Date(),
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      nodeCounter,
      description,
      isAutoSave
    };

    setVersions(prev => {
      const updated = [newVersion, ...prev].slice(0, maxVersions);
      saveVersions(updated);
      return updated;
    });

    return newVersion;
  }, [maxVersions, saveVersions]);

  // Remove a version
  const removeVersion = useCallback((versionId: string) => {
    setVersions(prev => {
      const updated = prev.filter(v => v.id !== versionId);
      saveVersions(updated);
      return updated;
    });
  }, [saveVersions]);

  // Clear all versions
  const clearVersions = useCallback(() => {
    setVersions([]);
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [getStorageKey]);

  // Load versions when workflow changes
  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  return {
    versions,
    addVersion,
    removeVersion,
    clearVersions,
    loadVersions
  };
}
