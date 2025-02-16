
import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { handleSaveWorkflow } from '@/utils/flowUtils';
import { Download, Upload, Plus, Copy, Clipboard, Search, Link2 } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';

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
    <div className="fixed top-4 right-4 left-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search workflows..."
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
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
        <Link to="/workflows">
          <Button variant="secondary" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Workflows
          </Button>
        </Link>
      </div>

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
