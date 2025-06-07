
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagnosisNode from '../diagnosis/DiagnosisNode';
import { defaultEdgeOptions } from '@/utils/flow';
import { FlowToolbar } from './FlowToolbar';
import { FlowBackground } from './FlowBackground';
import { Node } from '@xyflow/react';
import { SavedWorkflow } from '@/utils/flow/types';

// Define all node types to be rendered with DiagnosisNode
const nodeTypes = {
  diagnosis: DiagnosisNode,
  flowNode: DiagnosisNode,
  flowTitle: DiagnosisNode,
  flowAnswer: DiagnosisNode
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
  onApplyNodeChanges?: () => void;
  currentWorkflow?: SavedWorkflow;
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
  onApplyNodeChanges,
  currentWorkflow,
}: FlowWrapperProps) {
  return (
    <div className="w-full h-full">
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
        minZoom={0.2}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <FlowBackground />
        <FlowToolbar
          onAddNode={onAddNode}
          onSave={onSave}
          onImportClick={onImportClick}
          onCopySelected={onCopySelected}
          onPaste={onPaste}
          appliances={appliances}
          onApplyNodeChanges={onApplyNodeChanges}
          currentWorkflow={currentWorkflow}
        />
      </ReactFlow>
    </div>
  );
}

export function FlowWrapperWithProvider(props: FlowWrapperProps) {
  return (
    <ReactFlowProvider>
      <FlowWrapper {...props} />
    </ReactFlowProvider>
  );
}
