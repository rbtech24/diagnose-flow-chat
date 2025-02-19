
import { useEffect, useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import {
  SavedWorkflow,
  initialNodes,
  initialEdges,
} from '@/utils/flow';
import { createHistoryState, addToHistory } from '@/utils/workflowHistory';
import { useFlowState } from '@/hooks/useFlowState';
import { useFlowActions } from '@/hooks/useFlowActions';
import { useFlowConnect } from '@/hooks/useFlowConnect';
import { useNodeOperations } from '@/hooks/useNodeOperations';
import { useFileHandling } from '@/hooks/useFileHandling';
import { useHotkeySetup } from '@/hooks/useHotkeySetup';
import { FlowEditorContent } from './flow/FlowEditorContent';

interface FlowEditorProps {
  onNodeSelect?: (node: Node, updateNode: (nodeId: string, newData: any) => void) => void;
  appliances?: string[];
  currentWorkflow?: SavedWorkflow;
  folder: string;
  name: string;
}

export default function FlowEditor({ 
  onNodeSelect, 
  appliances = [], 
  currentWorkflow,
  folder,
  name 
}: FlowEditorProps) {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    nodeCounter,
    setNodeCounter,
    isLoading,
    setIsLoading,
    snapToGrid,
    copiedNodes,
    setCopiedNodes,
    onNodesChange,
    onEdgesChange,
    clearSavedState,
  } = useFlowState();

  const [history, setHistory] = useState(() => 
    createHistoryState({ nodes, edges, nodeCounter })
  );

  const { handleNodeUpdate } = useNodeOperations(
    nodes,
    edges,
    nodeCounter,
    setNodes,
    setHistory
  );

  const {
    handleCopySelected,
    handlePaste,
    handleQuickSaveClick,
    handleAddNode,
  } = useFlowActions(
    nodes,
    edges,
    nodeCounter,
    setNodes,
    setEdges,
    setNodeCounter,
    history,
    setHistory,
    copiedNodes,
    setCopiedNodes,
    currentWorkflow
  );

  const handleConnect = useFlowConnect(
    nodes,
    edges,
    nodeCounter,
    setEdges,
    history,
    setHistory
  );

  const {
    handleSave,
    handleFileImport,
    handleFileInputClick,
  } = useFileHandling({
    nodes,
    edges,
    nodeCounter,
    setNodes,
    setEdges,
    setNodeCounter,
    setIsLoading,
    history,
    setHistory,
  });

  useHotkeySetup({
    handleQuickSaveClick,
    handleCopySelected,
    handlePaste,
    currentWorkflow,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isNew = searchParams.get('new') === 'true';
    
    if (isNew) {
      clearSavedState();
      setNodes(initialNodes);
      setEdges(initialEdges);
      setNodeCounter(1);
      setHistory(createHistoryState({ 
        nodes: initialNodes, 
        edges: initialEdges, 
        nodeCounter: 1 
      }));
    }
  }, [location.search, clearSavedState, setNodes, setEdges, setNodeCounter]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    if (onNodeSelect) {
      onNodeSelect(node, handleNodeUpdate);
    }
  }, [onNodeSelect, handleNodeUpdate]);

  return (
    <FlowEditorContent
      nodes={nodes}
      edges={edges}
      isLoading={isLoading}
      snapToGrid={snapToGrid}
      currentWorkflow={currentWorkflow}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      onNodeClick={handleNodeClick}
      onQuickSave={handleQuickSaveClick}
      onAddNode={handleAddNode}
      onSave={handleSave}
      onFileImport={handleFileImport}
      onFileInputClick={handleFileInputClick}
      onCopySelected={handleCopySelected}
      onPaste={handlePaste}
      appliances={appliances}
    />
  );
}
