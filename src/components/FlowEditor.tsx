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
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isNewWorkflow = searchParams.get('new') === 'true';
  
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

  // Load workflow data when currentWorkflow changes or on initial load
  useEffect(() => {
    console.log('FlowEditor initializing with:', { isNewWorkflow, currentWorkflow, folder, name });
    
    if (isNewWorkflow) {
      console.log('Creating new workflow...');
      clearSavedState();
      setNodes(initialNodes);
      setEdges(initialEdges);
      setNodeCounter(1);
      setHistory(createHistoryState({ 
        nodes: initialNodes, 
        edges: initialEdges, 
        nodeCounter: 1 
      }));
      toast({
        title: "New Workflow",
        description: "Started creating a new workflow"
      });
    }
    else if (currentWorkflow) {
      console.log('Loading workflow data:', currentWorkflow);
      
      // Process nodes to ensure they have the correct format for React Flow
      const processedNodes = currentWorkflow.nodes.map(node => {
        // Ensure all nodes have the necessary properties
        return {
          ...node,
          // Map any custom node types to ones our app can handle
          type: node.type || 'diagnosis',
          // Ensure data structure is compatible
          data: {
            ...node.data,
            nodeId: node.data?.nodeId || `N${String(Math.random().toString(36).substr(2, 5))}`
          }
        };
      });

      setNodes(processedNodes);
      setEdges(currentWorkflow.edges);
      setNodeCounter(currentWorkflow.nodeCounter || processedNodes.length + 1);
      setHistory(createHistoryState({ 
        nodes: processedNodes, 
        edges: currentWorkflow.edges, 
        nodeCounter: currentWorkflow.nodeCounter || processedNodes.length + 1
      }));
      toast({
        title: "Workflow Loaded",
        description: `"${currentWorkflow.metadata.name}" from ${currentWorkflow.metadata.folder} loaded successfully`
      });
    }
  }, [currentWorkflow, isNewWorkflow, clearSavedState, setNodes, setEdges, setNodeCounter, folder, name]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    if (onNodeSelect) {
      event.stopPropagation(); // Prevent event bubbling
      onNodeSelect(node, handleNodeUpdate);
    }
  }, [onNodeSelect, handleNodeUpdate]);

  // This function will be passed to the "Apply Changes" button in the NodeConfigPanel
  const handleApplyNodeChanges = useCallback(() => {
    if (selectedNode && updateNodeFn) {
      console.log('Applying node changes to selected node:', selectedNode.id);
      // Note: The actual update is handled by the NodeConfigPanel through updateNodeFn
      toast({
        title: "Node Updated",
        description: "Changes have been applied successfully"
      });
    }
  }, [selectedNode, updateNodeFn]);

  // Added to keep track of the selected node and updateNode function
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updateNodeFn, setUpdateNodeFn] = useState<((nodeId: string, newData: any) => void) | null>(null);

  // Override onNodeSelect to track selected node
  const handleNodeSelectInternal = useCallback((node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    console.log('Setting selected node:', node);
    setSelectedNode(node);
    setUpdateNodeFn(() => updateNode);
    
    if (onNodeSelect) {
      onNodeSelect(node, updateNode);
    }
  }, [onNodeSelect]);

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
      onApplyNodeChanges={handleApplyNodeChanges}
    />
  );
}
