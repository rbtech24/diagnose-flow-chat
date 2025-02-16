import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/button';
import { PlusCircle, Save, Upload } from 'lucide-react';
import DiagnosisNode from './DiagnosisNode';
import { toast } from '@/hooks/use-toast';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#22c55e',
  },
  style: {
    strokeWidth: 2,
    stroke: '#22c55e',
  },
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'diagnosis',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Start Diagnosis [START]',
      type: 'symptom',
      content: 'Select the main symptom',
      options: ['Dryer No Heat', 'No Power', 'Loud Noise'],
      nodeId: 'START'
    }
  },
];

const initialEdges: Edge[] = [];

export default function FlowEditor({ onNodeSelect }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCounter, setNodeCounter] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      toast({
        title: "Connection Added",
        description: "Nodes have been connected successfully."
      });
    },
    [setEdges]
  );

  const updateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData }
          };
        }
        return node;
      })
    );
    toast({
      title: "Node Updated",
      description: "The node has been updated successfully."
    });
  }, [setNodes]);

  const onNodeClick = useCallback((event, node) => {
    onNodeSelect(node, updateNode);
  }, [onNodeSelect, updateNode]);

  const saveWorkflow = () => {
    const workflow = {
      nodes,
      edges,
      nodeCounter
    };
    localStorage.setItem('diagnostic-workflow', JSON.stringify(workflow));
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully."
    });
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        setNodeCounter(workflow.nodeCounter || nodes.length + 1);
        toast({
          title: "Workflow Imported",
          description: "Your workflow has been imported successfully."
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import workflow. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const addNewNode = () => {
    const uniqueId = `N${String(nodeCounter).padStart(3, '0')}`;
    setNodeCounter(prev => prev + 1);
    
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
    setNodes([...nodes, newNode]);
    toast({
      title: "Node Added",
      description: `New diagnosis step (${uniqueId}) has been added to the workflow.`
    });
  };

  return (
    <div className="w-full h-full">
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={importWorkflow}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white p-2 rounded-lg shadow-sm flex gap-2">
          <Button onClick={addNewNode} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Step
          </Button>
          <Button onClick={saveWorkflow} variant="secondary" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Workflow
          </Button>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="secondary" 
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
