
import React from 'react';
import { Node, Edge, Connection } from '@xyflow/react';
import { FlowWrapperWithProvider } from './FlowWrapper';
import { LoadingOverlay } from './LoadingOverlay';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowVersion } from '@/hooks/useVersionHistory';
import { WorkflowTemplate } from '@/hooks/useWorkflowTemplates';

interface FlowEditorContentProps {
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  snapToGrid: boolean;
  currentWorkflow?: SavedWorkflow;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onQuickSave: () => void;
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onFileImport: (file: File) => void;
  onFileInputClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  onDeleteSelected: () => void;
  appliances: string[];
  onApplyNodeChanges?: () => void;
  onNodeFocus?: (nodeId: string) => void;
  autoSaveState: any;
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearVersions: () => void;
  onLoadTemplate?: (template: WorkflowTemplate) => void;
}

export function FlowEditorContent({
  nodes,
  edges,
  isLoading,
  snapToGrid,
  currentWorkflow,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onQuickSave,
  onAddNode,
  onSave,
  onFileImport,
  onFileInputClick,
  onCopySelected,
  onPaste,
  onDeleteSelected,
  appliances,
  onApplyNodeChanges,
  onNodeFocus,
  autoSaveState,
  versions,
  onRestoreVersion,
  onRemoveVersion,
  onClearVersions,
  onLoadTemplate
}: FlowEditorContentProps) {
  return (
    <div className="relative w-full h-full bg-gray-50">
      {isLoading && <LoadingOverlay />}
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
        onImportClick={onFileInputClick}
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
        onLoadTemplate={onLoadTemplate}
      />
    </div>
  );
}
