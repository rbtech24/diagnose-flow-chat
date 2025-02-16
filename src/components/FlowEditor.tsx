import { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  getConnectedEdges,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagnosisNode from './DiagnosisNode';
import FlowToolbar from './flow/FlowToolbar';
import { toast } from '@/hooks/use-toast';
import {
  defaultEdgeOptions,
  initialNodes,
  initialEdges,
  handleSaveWorkflow,
  handleImportWorkflow,
} from '@/utils/flowUtils';
import { WorkflowState, HistoryState, createHistoryState, addToHistory, undo, redo } from '@/utils/workflowHistory';
import { useHotkeys } from 'react-hotkeys-hook';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

interface FlowEditorProps {
  onNodeSelect: (node: any, updateNode: (nodeId: string, newData: any) => void) => void;
  appliances: string[];
}

const LOCAL_STORAGE_KEY = 'workflow-state';

export default function FlowEditor({ onNodeSelect, appliances }: FlowEditorProps) {
  const loadInitialState = (): WorkflowState => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved workflow state');
      }
    }
    return { nodes: initialNodes, edges: initialEdges, nodeCounter: 1 };
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(loadInitialState().nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadInitialState().edges);
  const [nodeCounter, setNodeCounter] = useState(loadInitialState().nodeCounter);
  const [isLoading, setIsLoading] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const { getViewport } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<HistoryState>(() => 
    createHistoryState({ nodes, edges, nodeCounter })
  );

  useEffect(() => {
    const state = { nodes, edges, nodeCounter };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [nodes, edges, nodeCounter]);

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
    handleQuickSave();
  });

  useHotkeys('ctrl+c', (e) => {
    e.preventDefault();
    handleCopySelected();
  });

  useHotkeys('ctrl+v', (e) => {
    e.preventDefault();
    handlePaste();
  });

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

  const handleQuickSave = () => {
    handleSaveWorkflow(nodes, edges, nodeCounter, 'Quick Save', 'autosave');
    toast({
      title: "Workflow Auto-saved",
      description: "Your changes have been saved automatically."
    });
  };

  const onConnect = useCallback(
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
    [setEdges, nodes, nodeCounter, history]
  );

  const updateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData }
          };
        }
        return node;
      });
      const newState = { nodes: newNodes, edges, nodeCounter };
      setHistory(addToHistory(history, newState));
      return newNodes;
    });
    toast({
      title: "Node Updated",
      description: "The node has been updated successfully."
    });
  }, [setNodes, edges, nodeCounter, history]);

  const addNewNode = () => {
    setIsLoading(true);
    try {
      const uniqueId = `N${String(nodeCounter).padStart(3, '0')}`;
      const newNodeCounter = nodeCounter + 1;
      setNodeCounter(newNodeCounter);
      
      const newNode = {
        id: `node-${nodes.length + 1}`,
        type: 'diagnosis',
        position: { x: 250, y: (nodes.length + 1) * 150 },
        data: {
          label: `New Step [${uniqueId}]`,
          type: 'question',
          content: 'Enter question or instruction',
          options: ['Yes', 'No'],
          nodeId: uniqueId
        }
      };
      
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      
      const newState = { nodes: newNodes, edges, nodeCounter: newNodeCounter };
      setHistory(addToHistory(history, newState));
      
      toast({
        title: "Node Added",
        description: `New diagnosis step (${uniqueId}) has been added to the workflow.`
      });
    } finally {
      setIsLoading(false);
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

  const handleSave = async (name: string, folder: string) => {
    setIsLoading(true);
    try {
      await handleSaveWorkflow(nodes, edges, nodeCounter, name, folder);
    } finally {
      setIsLoading(false);
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
  }, [nodes]);

  const handlePaste = useCallback(() => {
    if (copiedNodes.length === 0) return;

    const [minX, minY] = [
      Math.min(...copiedNodes.map(node => node.position.x)),
      Math.min(...copiedNodes.map(node => node.position.y))
    ];

    const viewport = getViewport();
    const x = -viewport.x + viewport.width / 2;
    const y = -viewport.y + viewport.height / 2;

    const newNodes = copiedNodes.map(node => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: x + (node.position.x - minX),
        y: y + (node.position.y - minY),
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
  }, [copiedNodes, getViewport, edges, nodeCounter, history]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
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
        onConnect={onConnect}
        onNodeClick={(event, node) => onNodeSelect(node, updateNode)}
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
          onAddNode={addNewNode}
          onSave={handleSave}
          onImportClick={() => fileInputRef.current?.click()}
          onCopySelected={handleCopySelected}
          onPaste={handlePaste}
          appliances={appliances}
        />
      </ReactFlow>
    </div>
  );
}
