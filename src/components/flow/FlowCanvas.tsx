
import { Node } from '@xyflow/react';
import { FlowWrapperWithProvider } from './FlowWrapper';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowVersion } from '@/hooks/useVersionHistory';

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
  onDeleteSelected: () => void;
  appliances: string[];
  onApplyNodeChanges?: () => void;
  currentWorkflow?: SavedWorkflow;
  onNodeFocus?: (nodeId: string) => void;
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearVersions: () => void;
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
  onDeleteSelected,
  appliances,
  onApplyNodeChanges,
  currentWorkflow,
  onNodeFocus,
  versions,
  onRestoreVersion,
  onRemoveVersion,
  onClearVersions,
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
      onDeleteSelected={onDeleteSelected}
      appliances={appliances}
      onApplyNodeChanges={onApplyNodeChanges}
      currentWorkflow={currentWorkflow}
      onNodeFocus={onNodeFocus}
      versions={versions}
      onRestoreVersion={onRestoreVersion}
      onRemoveVersion={onRemoveVersion}
      onClearVersions={onClearVersions}
    />
  );
}
