
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
import { Separator } from '../ui/separator';

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
    <div className="absolute top-0 left-0 right-0 z-10 bg-background border-b pointer-events-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-2 lg:p-4 gap-3">
        {/* Left side - Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full lg:w-auto">
          <Button 
            variant="default"
            size="sm" 
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onAddNode}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Step</span>
          </Button>

          {onApplyNodeChanges && (
            <Button 
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={onApplyNodeChanges}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Apply Changes</span>
            </Button>
          )}

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          <SaveWorkflowDialog onSave={onSave} currentWorkflow={currentWorkflow} />

          <Button 
            variant="secondary" 
            size="sm"
            className="flex items-center gap-2" 
            onClick={onImportClick}
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </Button>
        </div>

        {/* Right side - Secondary Actions and Navigation */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3 w-full lg:w-auto justify-end">
          {/* Search - responsive width */}
          <div className="relative flex-1 lg:flex-none min-w-[120px] max-w-[200px]">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-8 pl-8 text-sm"
            />
          </div>

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          {/* Clipboard Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            <Button 
              variant="secondary"
              size="sm"
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3"
              onClick={onCopySelected}
            >
              <Copy className="w-4 h-4" />
              <span className="hidden md:inline">Copy</span>
            </Button>
            
            <Button 
              variant="secondary"
              size="sm"
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3"
              onClick={onPaste}
            >
              <Clipboard className="w-4 h-4" />
              <span className="hidden md:inline">Paste</span>
            </Button>
            
            <Button 
              variant="secondary"
              size="sm"
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3"
              onClick={() => {
                handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export', 'export', '');
              }}
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          {/* Navigation */}
          <Button 
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            onClick={handleGoToWorkflows}
          >
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Workflows</span>
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
