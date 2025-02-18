
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagnosisNode from '../DiagnosisNode';
import { defaultEdgeOptions } from '@/utils/flow';
import { FlowToolbar } from './FlowToolbar';
import { FlowBackground } from './FlowBackground';
import { Node } from '@xyflow/react';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

interface FlowWrapperProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  snapToGrid: boolean;
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  appliances: string[];
}

export function FlowWrapper({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  snapToGrid,
  onAddNode,
  onSave,
  onImportClick,
  onCopySelected,
  onPaste,
  appliances,
}: FlowWrapperProps) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      snapToGrid={snapToGrid}
      snapGrid={[15, 15]}
      fitView
      className="bg-gray-50"
    >
      <FlowBackground />
      <FlowToolbar
        onAddNode={onAddNode}
        onSave={onSave}
        onImportClick={onImportClick}
        onCopySelected={onCopySelected}
        onPaste={onPaste}
        appliances={appliances}
      />
    </ReactFlow>
  );
}

export function FlowWrapperWithProvider(props: FlowWrapperProps) {
  return (
    <ReactFlowProvider>
      <FlowWrapper {...props} />
    </ReactFlowProvider>
  );
}
