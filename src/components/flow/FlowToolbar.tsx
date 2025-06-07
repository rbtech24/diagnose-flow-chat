
import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { handleSaveWorkflow } from '@/utils/flow';
import { Download, Upload, Plus, Copy, Clipboard, Search, Link2, Save } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { SavedWorkflow } from '@/utils/flow/types';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';

interface FlowToolbarProps {
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  appliances: string[];
  onApplyNodeChanges?: () => void;
  currentWorkflow?: SavedWorkflow;
}

export function FlowToolbar({
  onAddNode,
  onSave,
  onImportClick,
  onCopySelected,
  onPaste,
  appliances,
  onApplyNodeChanges,
  currentWorkflow
}: FlowToolbarProps) {
  const { nodes, edges, nodeCounter } = useFlowState();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const isAdmin = userRole === 'admin';

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSaveWorkflow(nodes, edges, nodeCounter, file.name, 'import', 'import', '');
  }, [nodes, edges, nodeCounter]);

  const handleGoToWorkflows = useCallback(() => {
    const basePath = isAdmin ? '/admin/workflows' : '/workflows';
    navigate(basePath);
  }, [isAdmin, navigate]);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-4 p-4 bg-background border-b pointer-events-auto">
      {/* Primary Actions Group */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <Button 
          variant="default"
          size="sm" 
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onAddNode}
        >
          <Plus className="w-4 h-4" />
          Add Step
        </Button>

        {onApplyNodeChanges && (
          <Button 
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={onApplyNodeChanges}
          >
            <Save className="w-4 h-4" />
            Apply Changes
          </Button>
        )}
      </div>

      {/* Save and Import Group */}
      <div className="flex items-center gap-3 pointer-events-auto border-l border-gray-200 pl-4">
        <SaveWorkflowDialog onSave={onSave} currentWorkflow={currentWorkflow} />

        <Button 
          variant="secondary" 
          size="sm"
          className="flex items-center gap-2" 
          onClick={onImportClick}
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </div>

      {/* Clipboard and Export Group */}
      <div className="flex items-center gap-2 pointer-events-auto border-l border-gray-200 pl-4">
        <Button 
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={onCopySelected}
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button 
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={onPaste}
        >
          <Clipboard className="w-4 h-4" />
          Paste
        </Button>
        <Button 
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export', 'export', '');
          }}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Navigation Group */}
      <div className="pointer-events-auto border-l border-gray-200 pl-4">
        <Button 
          variant="default"
          size="sm"
          className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          onClick={handleGoToWorkflows}
        >
          <Link2 className="w-4 h-4" />
          Workflows
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search Group */}
      <div className="relative pointer-events-auto">
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
