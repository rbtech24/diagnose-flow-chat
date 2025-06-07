
import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { handleSaveWorkflow } from '@/utils/flow';
import { Download, Upload, Plus, Copy, Clipboard, Search, Link2, Save, Trash } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { SavedWorkflow } from '@/utils/flow/types';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface FlowToolbarProps {
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  onDeleteSelected: () => void;
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
  onDeleteSelected,
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
    <div className="absolute top-0 left-0 right-0 z-10 bg-background border-b pointer-events-auto">
      <div className="flex items-center justify-between p-4 gap-6">
        {/* Left section - Primary Actions */}
        <div className="flex items-center gap-4">
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

          <Separator orientation="vertical" className="h-6" />

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

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 h-9"
            />
          </div>
        </div>

        {/* Right section - Secondary Actions */}
        <div className="flex items-center gap-4">
          {/* Clipboard Actions Group */}
          <div className="flex items-center gap-2">
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
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
              onClick={onDeleteSelected}
            >
              <Trash className="w-4 h-4" />
              Delete
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

          <Separator orientation="vertical" className="h-6" />

          {/* Navigation */}
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
