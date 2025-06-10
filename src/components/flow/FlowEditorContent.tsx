
import { Node } from '@xyflow/react';
import { LoadingOverlay } from './LoadingOverlay';
import { FlowHeader } from './FlowHeader';
import { FlowCanvas } from './FlowCanvas';
import { FlowFileInput } from './FlowFileInput';
import { SavedWorkflow } from '@/utils/flow';
import { WorkflowVersion } from '@/hooks/useVersionHistory';

interface AutoSaveState {
  isAutoSaving: boolean;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

interface FlowEditorContentProps {
  nodes: Node[];
  edges: any[];
  isLoading: boolean;
  snapToGrid: boolean;
  currentWorkflow?: SavedWorkflow;
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onQuickSave: () => void;
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileInputClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  onDeleteSelected: () => void;
  appliances: string[];
  onApplyNodeChanges?: () => void;
  onNodeFocus?: (nodeId: string) => void;
  autoSaveState: AutoSaveState;
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearVersions: () => void;
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
}: FlowEditorContentProps) {
  return (
    <div className="w-full h-full relative">
      <FlowHeader 
        currentWorkflow={currentWorkflow}
        onQuickSave={onQuickSave}
        autoSaveState={autoSaveState}
      />
      
      {isLoading && <LoadingOverlay />}
      
      <FlowFileInput onFileImport={onFileImport} />

      <FlowCanvas
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
      />
    </div>
  );
}
