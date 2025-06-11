
import { useEffect, useState, useCallback } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
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
import { useAutoSave } from '@/hooks/useAutoSave';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { FlowEditorContent } from './flow/FlowEditorContent';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { WorkflowTemplate } from '@/hooks/useWorkflowTemplates';

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
  
  // State declarations first to fix the "used before declaration" errors
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updateNodeFn, setUpdateNodeFn] = useState<((nodeId: string, newData: any) => void) | null>(null);
  
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

  // Auto-save and version history hooks
  const autoSaveState = useAutoSave({
    nodes,
    edges,
    nodeCounter,
    currentWorkflow,
    enabled: !isNewWorkflow && !!currentWorkflow
  });

  const {
    versions,
    addVersion,
    removeVersion,
    clearVersions
  } = useVersionHistory({
    currentWorkflow
  });

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
    handleDeleteSelected,
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
    handleFileImport: handleFileImportEvent,
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

  // Create a wrapper function that matches the expected interface
  const handleFileImport = useCallback((file: File) => {
    // Create a mock event object that matches what useFileHandling expects
    const mockEvent = {
      target: {
        files: [file],
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleFileImportEvent(mockEvent);
  }, [handleFileImportEvent]);

  useHotkeySetup({
    handleQuickSaveClick,
    handleCopySelected,
    handlePaste,
    currentWorkflow,
  });

  // Handle template loading
  const handleLoadTemplate = useCallback((template: WorkflowTemplate) => {
    console.log('Loading template in FlowEditor:', template);
    
    try {
      // Process template nodes to ensure they work with our flow editor
      const processedNodes = template.nodes.map(node => ({
        ...node,
        // Ensure each node has a unique ID in case there are conflicts
        id: `${node.id}-${Date.now()}`,
        // Ensure data is properly formatted
        data: {
          ...node.data,
          nodeId: node.data?.nodeId || `N${String(Math.random().toString(36).substr(2, 5))}`
        }
      }));

      // Process edges to match the new node IDs
      const processedEdges = template.edges.map(edge => ({
        ...edge,
        id: `${edge.id}-${Date.now()}`,
        source: `${edge.source}-${Date.now()}`,
        target: `${edge.target}-${Date.now()}`
      }));

      // Load the template data
      setNodes(processedNodes);
      setEdges(processedEdges);
      setNodeCounter(template.nodeCounter || processedNodes.length + 1);
      
      // Add to history
      const newState = {
        nodes: processedNodes,
        edges: processedEdges,
        nodeCounter: template.nodeCounter || processedNodes.length + 1
      };
      setHistory(createHistoryState(newState));
      
      toast({
        title: "Template Loaded",
        description: `"${template.name}" template has been loaded successfully`
      });
    } catch (error) {
      console.error('Error loading template:', error);
      toast({
        title: "Error Loading Template",
        description: "Failed to load the selected template. Please try again.",
        variant: "destructive"
      });
    }
  }, [setNodes, setEdges, setNodeCounter, setHistory]);

  // Add version when significant changes occur
  useEffect(() => {
    if (currentWorkflow && nodes.length > 0) {
      const timeoutId = setTimeout(() => {
        if (autoSaveState.hasUnsavedChanges) {
          addVersion(nodes, edges, nodeCounter, 'Auto-save version', true);
        }
      }, 10000); // Add version every 10 seconds if there are changes

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, nodeCounter, currentWorkflow, autoSaveState.hasUnsavedChanges, addVersion]);

  // Handle version restoration
  const handleRestoreVersion = useCallback((version: any) => {
    setNodes(version.nodes);
    setEdges(version.edges);
    setNodeCounter(version.nodeCounter);
    
    // Add to history
    const newState = { 
      nodes: version.nodes, 
      edges: version.edges, 
      nodeCounter: version.nodeCounter 
    };
    setHistory(addToHistory(history, newState));
    
    toast({
      title: "Version Restored",
      description: `Restored to version: ${version.description}`
    });
  }, [setNodes, setEdges, setNodeCounter, history, setHistory]);

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

  // Override onNodeSelect to track selected node
  const handleNodeSelectInternal = useCallback((node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    console.log('Setting selected node:', node);
    setSelectedNode(node);
    setUpdateNodeFn(() => updateNode);
    
    if (onNodeSelect) {
      onNodeSelect(node, updateNode);
    }
  }, [onNodeSelect]);

  // Focus on a specific node (for validation)
  const handleNodeFocus = useCallback((nodeId: string) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    if (targetNode) {
      // Focus the node and select it
      setNodes(prevNodes => 
        prevNodes.map(n => ({
          ...n,
          selected: n.id === nodeId
        }))
      );
      
      // If we have ReactFlow instance, we could also center the view on the node
      console.log('Focusing on node:', nodeId);
      toast({
        title: "Node Focused",
        description: `Highlighted node: ${targetNode.data?.label || nodeId}`
      });
    }
  }, [nodes, setNodes]);

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
      onDeleteSelected={handleDeleteSelected}
      appliances={appliances}
      onApplyNodeChanges={handleApplyNodeChanges}
      onNodeFocus={handleNodeFocus}
      autoSaveState={autoSaveState}
      versions={versions}
      onRestoreVersion={handleRestoreVersion}
      onRemoveVersion={removeVersion}
      onClearVersions={clearVersions}
      onLoadTemplate={handleLoadTemplate}
    />
  );
}
