
import { useCallback, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import DiagnosisNode from './DiagnosisNode';
import { toast } from '@/hooks/use-toast';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'diagnosis',
    position: { x: 250, y: 0 },
    data: { 
      label: 'Start Diagnosis',
      type: 'symptom',
      content: 'Select the main symptom',
      options: ['Dryer No Heat', 'No Power', 'Loud Noise']
    }
  },
];

const initialEdges: Edge[] = [];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'diagnosis',
      position: { x: 250, y: (nodes.length + 1) * 150 },
      data: {
        label: 'New Step',
        type: 'question',
        content: 'Enter question or instruction',
        options: ['Yes', 'No']
      }
    };
    setNodes([...nodes, newNode]);
    toast({
      title: "Node Added",
      description: "New diagnosis step has been added to the workflow."
    });
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white p-2 rounded-lg shadow-sm">
          <Button onClick={addNewNode} className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Step
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
