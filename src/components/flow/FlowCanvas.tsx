
import { Node } from '@xyflow/react';
import { FlowWrapperWithProvider } from './FlowWrapper';

interface FlowCanvasProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  snapToGrid: boolean;
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  appliances: string[];
}

export function FlowCanvas({
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
}: FlowCanvasProps) {
  return (
    <FlowWrapperWithProvider
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      snapToGrid={snapToGrid}
      onAddNode={onAddNode}
      onSave={onSave}
      onImportClick={onImportClick}
      onCopySelected={onCopySelected}
      onPaste={onPaste}
      appliances={appliances}
    />
  );
}
