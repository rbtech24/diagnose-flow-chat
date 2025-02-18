import { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  useReactFlow,
  Node,
  Edge,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagnosisNode from './DiagnosisNode';
import { FlowToolbar } from './flow/FlowToolbar';
import { LoadingOverlay } from './flow/LoadingOverlay';
import { WorkflowActions } from './flow/WorkflowActions';
import { toast } from '@/hooks/use-toast';
import {
  defaultEdgeOptions,
  handleSaveWorkflow,
  handleImportWorkflow,
  SavedWorkflow,
  initialNodes,
  initialEdges,
  handleQuickSave
} from '@/utils/flow';
import { createHistoryState, addToHistory, undo, redo } from '@/utils/workflowHistory';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFlowState } from '@/hooks/useFlowState';
import { Button } from './ui/button';
import { Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

interface FlowEditorProps {
  onNodeSelect?: (node: any, updateNode: (nodeId: string, newData: any) => void) => void;
  appliances?: string[];
  currentWorkflow?: SavedWorkflow;
  folder: string;
  name: string;
}

function FlowEditorContent({ 
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

  const { getViewport } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState(() => 
    createHistoryState({ nodes, edges, nodeCounter })
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

  useHotkeys('ctrl+z', (e) => {
    e.preventDefault();
    handleUndo();
  });

  useHotkeys('ctrl+shift+z', (e) => {
    e.preventDefault();
    handleRedo();
  });

  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (currentWorkflow) {
      handleQuickSave(nodes, edges, nodeCounter, currentWorkflow);
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

  const handleConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const newState = { nodes, edges: newEdges, nodeCounter };
        setHistory(addToHistory(history, newState));
        return newEdges;
      });
      toast({
        title: "Connection Added",
        description: "Nodes have been connected successfully."
      });
    },
    [setEdges, nodes, nodeCounter, history, setHistory]
  );

  const handleUndo = () => {
    const newHistory = undo(history);
    if (newHistory !== history) {
      setHistory(newHistory);
      setNodes(newHistory.present.nodes);
      setEdges(newHistory.present.edges);
      setNodeCounter(newHistory.present.nodeCounter);
    }
  };

  const handleRedo = () => {
    const newHistory = redo(history);
    if (newHistory !== history) {
      setHistory(newHistory);
      setNodes(newHistory.present.nodes);
      setEdges(newHistory.present.edges);
      setNodeCounter(newHistory.present.nodeCounter);
    }
  };

  const handleQuickSaveClick = () => {
    if (currentWorkflow) {
      handleQuickSave(nodes, edges, nodeCounter, currentWorkflow);
      toast({
        title: "Workflow Auto-saved",
        description: "Your changes have been saved automatically."
      });
    } else {
      toast({
        title: "Cannot Quick Save",
        description: "This is a new workflow. Please use 'Save Workflow' to save it first.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (name: string, folder: string, appliance: string): Promise<void> => {
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

  const handleCopySelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      setCopiedNodes(selectedNodes);
      toast({
        title: "Nodes Copied",
        description: `${selectedNodes.length} node(s) copied to clipboard`
      });
    }
  }, [nodes, setCopiedNodes]);

  const handlePaste = useCallback(() => {
    if (copiedNodes.length === 0) return;

    const viewport = getViewport();
    const [minX, minY] = [
      Math.min(...copiedNodes.map(node => node.position.x)),
      Math.min(...copiedNodes.map(node => node.position.y))
    ];

    const newNodes = copiedNodes.map(node => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: -viewport.x + window.innerWidth / 2 + (node.position.x - minX),
        y: -viewport.y + window.innerHeight / 2 + (node.position.y - minY),
      },
      data: {
        ...node.data,
        label: `${node.data.label} (Copy)`,
        nodeId: `N${String(nodeCounter + 1).padStart(3, '0')}`
      },
      selected: false
    }));

    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes, ...newNodes];
      const newState = { nodes: updatedNodes, edges, nodeCounter: nodeCounter + newNodes.length };
      setHistory(addToHistory(history, newState));
      return updatedNodes;
    });

    setNodeCounter(prev => prev + newNodes.length);

    toast({
      title: "Nodes Pasted",
      description: `${newNodes.length} node(s) pasted`
    });
  }, [copiedNodes, getViewport, edges, nodeCounter, history, setNodes, setNodeCounter, setHistory]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
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

  const handleNodeUpdate = (nodeId: string, newData: any) => {
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData,
          },
        };
      }
      return node;
    }));
  };

  const handleAddNode = () => {
    const newNodeId = `node-${nodeCounter}`;
    const newNode = {
      id: newNodeId,
      type: 'diagnosis',
      position: {
        x: window.innerWidth / 2 - 75,
        y: window.innerHeight / 2 - 75,
      },
      data: {
        label: `Node ${nodeCounter}`,
        type: 'question',
        nodeId: `N${String(nodeCounter).padStart(3, '0')}`,
        content: '',
        options: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCounter((nc) => nc + 1);
    
    const newState = { nodes: [...nodes, newNode], edges, nodeCounter: nodeCounter + 1 };
    setHistory(addToHistory(history, newState));

    toast({
      title: "Node Added",
      description: "New node has been added to the workflow."
    });
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {currentWorkflow && (
          <Button
            variant="default"
            size="sm"
            onClick={handleQuickSaveClick}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        )}
        <WorkflowActions />
      </div>
      
      {isLoading && <LoadingOverlay />}
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={handleFileImport}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={(event, node) => onNodeSelect(node, handleNodeUpdate)}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView
        className="bg-gray-50"
      >
        <Background gap={15} />
        <Controls />
        <MiniMap />
        <FlowToolbar
          onAddNode={handleAddNode}
          onSave={handleSave}
          onImportClick={handleImportClick}
          onCopySelected={handleCopySelected}
          onPaste={handlePaste}
          appliances={appliances}
        />
      </ReactFlow>
    </div>
  );
}

export default function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorContent {...props} />
    </ReactFlowProvider>
  );
}
