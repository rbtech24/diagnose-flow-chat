
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
    <div className="flex items-center gap-3 p-4 bg-background border-b">
      <Button 
        variant="default"
        size="sm" 
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={onAddNode}
      >
        <Plus className="w-4 h-4" />
        Add Step
      </Button>

      <SaveWorkflowDialog onSave={onSave} />

      <Button 
        variant="secondary" 
        size="sm"
        className="flex items-center gap-2" 
        onClick={onImportClick}
      >
        <Upload className="w-4 h-4" />
        Import
      </Button>

      <div className="flex items-center gap-2">
        <Button 
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={onCopySelected}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button 
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={onPaste}
        >
          <Clipboard className="w-4 h-4" />
        </Button>
        <Button 
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export');
          }}
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <Link to="/workflows">
        <Button 
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Workflows
        </Button>
      </Link>

      <div className="flex-1" />

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search nodes..."
          size={32}
          className="h-8 w-[200px] pl-8"
        />
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
