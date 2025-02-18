import { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Connection,
  useReactFlow,
  Node,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagnosisNode from './DiagnosisNode';
import { FlowToolbar } from './flow/FlowToolbar';
import { LoadingOverlay } from './flow/LoadingOverlay';
import { WorkflowActions } from './flow/WorkflowActions';
import { QuickSaveButton } from './flow/QuickSaveButton';
import { FlowBackground } from './flow/FlowBackground';
import { toast } from '@/hooks/use-toast';
import {
  defaultEdgeOptions,
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

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

interface FlowEditorProps {
  onNodeSelect?: (node: Node, updateNode: (nodeId: string, newData: any) => void) => void;
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

  const [history, setHistory] = useState(() => 
    createHistoryState({ nodes, edges, nodeCounter })
  );

  const {
    handleConnect,
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (onNodeSelect) {
      onNodeSelect(node, handleNodeUpdate);
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <QuickSaveButton 
          currentWorkflow={currentWorkflow}
          onQuickSave={handleQuickSaveClick}
        />
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
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView
        className="bg-gray-50"
      >
        <FlowBackground />
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
