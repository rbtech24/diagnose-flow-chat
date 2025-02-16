
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

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

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

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportWorkflow(file, setNodes, setEdges, setNodeCounter);
      event.target.value = '';
    }
  };

  const handleSave = (name: string, folder: string) => {
    handleSaveWorkflow(nodes, edges, nodeCounter, name, folder);
  };

  return (
    <div className="w-full h-full">
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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
        <FlowToolbar
          onAddNode={addNewNode}
          onSave={handleSave}
          onImportClick={() => fileInputRef.current?.click()}
        />
      </ReactFlow>
    </div>
  );
}
