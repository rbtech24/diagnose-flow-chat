
import { useEffect, useRef, useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { SavedWorkflow } from '@/utils/flow/types';
import { handleQuickSave } from '@/utils/flow/operations';
import { toast } from '@/hooks/use-toast';

interface AutoSaveState {
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

interface UseAutoSaveProps {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  currentWorkflow?: SavedWorkflow;
  enabled?: boolean;
  intervalMs?: number;
}

export function useAutoSave({
  nodes,
  edges,
  nodeCounter,
  currentWorkflow,
  enabled = true,
  intervalMs = 5000 // 5 seconds
}: UseAutoSaveProps) {
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    isAutoSaving: false,
    lastSavedAt: null,
    hasUnsavedChanges: false
  });

  const lastSavedStateRef = useRef<string>('');
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create a stable hash of the current state
  const getCurrentStateHash = useCallback(() => {
    return JSON.stringify({
      nodes: nodes.map(n => ({ id: n.id, data: n.data, position: n.position })),
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
      nodeCounter
    });
  }, [nodes, edges, nodeCounter]);

  // Check if there are unsaved changes
  const checkForChanges = useCallback(() => {
    const currentHash = getCurrentStateHash();
    const hasChanges = currentHash !== lastSavedStateRef.current;
    
    setAutoSaveState(prev => ({
      ...prev,
      hasUnsavedChanges: hasChanges
    }));

    return hasChanges;
  }, [getCurrentStateHash]);

  // Perform auto-save
  const performAutoSave = useCallback(async () => {
    if (!currentWorkflow || !checkForChanges()) {
      return;
    }

    setAutoSaveState(prev => ({ ...prev, isAutoSaving: true }));

    try {
      await handleQuickSave(nodes, edges, nodeCounter, currentWorkflow);
      
      const currentHash = getCurrentStateHash();
      lastSavedStateRef.current = currentHash;
      
      setAutoSaveState(prev => ({
        ...prev,
        isAutoSaving: false,
        lastSavedAt: new Date(),
        hasUnsavedChanges: false
      }));

      console.log('Auto-save completed successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveState(prev => ({ ...prev, isAutoSaving: false }));
    }
  }, [nodes, edges, nodeCounter, currentWorkflow, checkForChanges, getCurrentStateHash]);

  // Set up auto-save interval
  useEffect(() => {
    if (!enabled || !currentWorkflow) {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
      return;
    }

    autoSaveIntervalRef.current = setInterval(() => {
      performAutoSave();
    }, intervalMs);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [enabled, currentWorkflow, intervalMs, performAutoSave]);

  // Check for changes when nodes/edges change
  useEffect(() => {
    checkForChanges();
  }, [checkForChanges]);

  // Initialize the last saved state on first load
  useEffect(() => {
    if (currentWorkflow && lastSavedStateRef.current === '') {
      lastSavedStateRef.current = getCurrentStateHash();
    }
  }, [currentWorkflow, getCurrentStateHash]);

  return {
    ...autoSaveState,
    performAutoSave
  };
}
