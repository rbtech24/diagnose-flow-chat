
import { useEffect, useState, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';
import {
  handleSaveWorkflow,
  handleImportWorkflow,
  SavedWorkflow,
  initialNodes,
  initialEdges,
} from '@/utils/flow';
import { createHistoryState, addToHistory } from '@/utils/workflowHistory';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFlowState } from '@/hooks/useFlowState';
import { useFlowActions } from '@/hooks/useFlowActions';
import { useFlowConnect } from '@/hooks/useFlowConnect';
import { useNodeOperations } from '@/hooks/useNodeOperations';
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

  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (currentWorkflow) {
      handleQuickSaveClick();
    }
  });

  useHotkeys('ctrl+c', (e) => {
    e.preventDefault();
    handleCopySelected();
  });

  useHotkeys('ctrl+v', (e) => {
    e.preventDefault();
    handlePaste();
  });

  const handleSave = async (name: string, folder: string, appliance: string) => {
    try {
      const workflow = await handleSaveWorkflow(nodes, edges, nodeCounter, name, folder, appliance, '');
      if (workflow) {
        toast({
          title: "Workflow Saved",
          description: `Successfully saved "${name}" to folder "${folder}"`
        });
      }
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the workflow. Please try again.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await handleImportWorkflow(file, setNodes, setEdges, setNodeCounter);
        const newState = { nodes, edges, nodeCounter };
        setHistory(addToHistory(history, newState));
      } finally {
        setIsLoading(false);
        event.target.value = '';
      }
    }
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    if (onNodeSelect) {
      onNodeSelect(node, handleNodeUpdate);
    }
  }, [onNodeSelect, handleNodeUpdate]);

  const handleFileInputClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

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
