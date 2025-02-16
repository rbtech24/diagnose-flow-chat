
import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { handleSaveWorkflow } from '@/utils/flowUtils';
import { Download, Upload, Plus, Copy, Clipboard } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useCallback } from 'react';

interface FlowToolbarProps {
  onAddNode: () => void;
  onSave: (name: string, folder: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  appliances: string[];
}

export function FlowToolbar({
  onAddNode,
  onSave,
  onImportClick,
  onCopySelected,
  onPaste,
  appliances
}: FlowToolbarProps) {
  const { nodes, edges, nodeCounter } = useFlowState();

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSaveWorkflow(nodes, edges, nodeCounter, file.name, 'import');
  }, [nodes, edges, nodeCounter]);

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <Button variant="secondary" className="flex items-center gap-2" onClick={onAddNode}>
        <Plus className="w-4 h-4" />
        Add Node
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" onClick={onCopySelected}>
        <Copy className="w-4 h-4" />
        Copy
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" onClick={onPaste}>
        <Clipboard className="w-4 h-4" />
        Paste
      </Button>
      <SaveWorkflowDialog onSave={onSave} />
      <Button variant="secondary" className="flex items-center gap-2" onClick={() => {
        handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export');
      }}>
        <Download className="w-4 h-4" />
        Export
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" onClick={onImportClick}>
        <Upload className="w-4 h-4" />
        Import
      </Button>
      <input
        type="file"
        id="import-workflow"
        className="hidden"
        accept=".json"
        onChange={handleImport}
      />
    </div>
  );
}
