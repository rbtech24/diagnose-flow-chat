import { Button } from '../ui/button';
import { SaveWorkflowDialog } from './SaveWorkflowDialog';
import { SaveTemplateDialog } from './SaveTemplateDialog';
import { ValidationButton } from '../validation/ValidationButton';
import { SearchPanel } from './SearchPanel';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { WorkflowTemplateDialog } from './WorkflowTemplateDialog';
import { handleSaveWorkflow } from '@/utils/flow';
import { Download, Upload, Plus, Copy, Clipboard, Link2, Save, Trash, History, File } from 'lucide-react';
import { useFlowState } from '@/hooks/useFlowState';
import { useWorkflowValidation } from '@/hooks/useWorkflowValidation';
import { useWorkflowSearch } from '@/hooks/useWorkflowSearch';
import { useWorkflowTemplates, WorkflowTemplate } from '@/hooks/useWorkflowTemplates';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowVersion } from '@/hooks/useVersionHistory';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
  onNodeFocus?: (nodeId: string) => void;
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearVersions: () => void;
  onLoadTemplate?: (template: WorkflowTemplate) => void;
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
  currentWorkflow,
  onNodeFocus,
  versions,
  onRestoreVersion,
  onRemoveVersion,
  onClearVersions,
  onLoadTemplate
}: FlowToolbarProps) {
  const { nodes, edges, nodeCounter } = useFlowState();
  
  const { validationSummary, isValidating, autoValidate, validate } = useWorkflowValidation();
  const {
    searchTerm,
    typeFilter,
    searchResults,
    filteredNodeIds,
    highlightedNodes,
    handleSearch,
    handleTypeFilter,
    clearSearch,
    focusNode,
    hasActiveFilters
  } = useWorkflowSearch(nodes);
  
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const isAdmin = userRole === 'admin';

  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  // Auto-validate when nodes or edges change
  useEffect(() => {
    if (autoValidate && (nodes.length > 0 || edges.length > 0)) {
      const timeoutId = setTimeout(() => {
        validate({
          nodes,
          edges,
          nodeCounter,
          workflowMetadata: currentWorkflow?.metadata
        });
      }, 1000); // Debounce validation

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, nodeCounter, autoValidate, validate, currentWorkflow]);

  const handleValidate = useCallback(() => {
    validate({
      nodes,
      edges,
      nodeCounter,
      workflowMetadata: currentWorkflow?.metadata
    });
  }, [nodes, edges, nodeCounter, currentWorkflow, validate]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleSaveWorkflow(nodes, edges, nodeCounter, file.name, 'import', 'import', '');
  }, [nodes, edges, nodeCounter]);

  const handleGoToWorkflows = useCallback(() => {
    const basePath = isAdmin ? '/admin/workflows' : '/workflows';
    navigate(basePath);
  }, [isAdmin, navigate]);

  const handleSearchFocus = useCallback((nodeId: string) => {
    focusNode(nodeId);
    if (onNodeFocus) {
      onNodeFocus(nodeId);
    }
  }, [focusNode, onNodeFocus]);

  const handleSelectTemplate = useCallback((template: WorkflowTemplate) => {
    console.log('Template selected in toolbar:', template);
    
    if (onLoadTemplate) {
      // If we have an onLoadTemplate callback, use it to load the template data directly
      onLoadTemplate(template);
      toast({
        title: "Template Loaded",
        description: `Loaded "${template.name}" template into the current editor`
      });
    } else {
      // Fallback: navigate to a new editor with template data
      const searchParams = new URLSearchParams({
        folder: template.category,
        name: `${template.name} (Copy)`,
        template: 'true'
      });
      
      navigate(`/workflow-editor?${searchParams.toString()}`);
      
      toast({
        title: "Template Loaded",
        description: `Started new workflow from "${template.name}" template`
      });
    }
  }, [onLoadTemplate, navigate]);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-background border-b pointer-events-auto">
      <div className="flex flex-col gap-3 p-3">
        {/* Top Row - Core Actions */}
        <div className="flex items-center w-full gap-3 min-h-[36px] flex-nowrap">
          {/* Left Actions Group */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="default"
              size="sm" 
              className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs"
              onClick={onAddNode}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </Button>

            <SaveWorkflowDialog onSave={onSave} currentWorkflow={currentWorkflow} />

            <Button 
              variant="secondary" 
              size="sm"
              className="flex items-center gap-1.5 h-8 px-3 text-xs" 
              onClick={onImportClick}
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </Button>
          </div>

          <Separator orientation="vertical" className="h-5" />

          {/* Center Search Panel - Flexible */}
          <div className="flex-1 max-w-md mx-3 min-w-0">
            <SearchPanel
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              searchResults={searchResults}
              hasActiveFilters={hasActiveFilters}
              onSearch={handleSearch}
              onTypeFilter={handleTypeFilter}
              onClearSearch={clearSearch}
              onFocusNode={handleSearchFocus}
            />
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTemplateDialogOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 text-xs"
            >
              <File className="w-3.5 h-3.5" />
              Templates
            </Button>

            {/* Make Save Template Button More Prominent */}
            <SaveTemplateDialog
              nodes={nodes}
              edges={edges}
              nodeCounter={nodeCounter}
              trigger={
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex items-center gap-1.5 h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Template
                </Button>
              }
            />

            <ValidationButton
              validationSummary={validationSummary}
              isValidating={isValidating}
              onValidate={handleValidate}
              onNodeFocus={onNodeFocus}
            />
          </div>
        </div>

        {/* Bottom Row - Secondary Actions */}
        <div className="flex items-center justify-between w-full gap-3">
          {/* Left Side - Edit Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 h-8 px-3 text-xs hover:bg-background"
              onClick={onCopySelected}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </Button>
            
            <Button 
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 h-8 px-3 text-xs hover:bg-background"
              onClick={onPaste}
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste
            </Button>

            <Button 
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 h-8 px-3 text-xs hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDeleteSelected}
            >
              <Trash className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>

          {/* Right Side - Tool Actions */}
          <div className="flex items-center gap-2">
            {onApplyNodeChanges && (
              <Button 
                variant="secondary"
                size="sm"
                className="flex items-center gap-1.5 h-8 px-3 text-xs whitespace-nowrap"
                onClick={onApplyNodeChanges}
              >
                <Save className="w-3.5 h-3.5" />
                Apply
              </Button>
            )}

            <Button 
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 h-8 px-3 text-xs hover:bg-background"
              onClick={() => {
                handleSaveWorkflow(nodes, edges, nodeCounter, 'Exported Workflow', 'export', 'export', '');
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>

            <Popover open={versionHistoryOpen} onOpenChange={setVersionHistoryOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 h-8 px-3 text-xs whitespace-nowrap"
                >
                  <History className="w-3.5 h-3.5" />
                  History
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <VersionHistoryPanel
                  versions={versions}
                  onRestoreVersion={onRestoreVersion}
                  onRemoveVersion={onRemoveVersion}
                  onClearHistory={onClearVersions}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="default"
              size="sm"
              className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white h-8 px-3 text-xs whitespace-nowrap"
              onClick={handleGoToWorkflows}
            >
              <Link2 className="w-3.5 h-3.5" />
              Workflows
            </Button>
          </div>
        </div>
        
        {/* Search Results Summary */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 p-2 rounded-md">
            <p className="text-xs text-blue-700 flex items-center justify-between">
              <span>
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} node${searchResults.length === 1 ? '' : 's'}`
                  : 'No nodes match your search criteria'
                }
                {searchTerm && ` for "${searchTerm}"`}
                {typeFilter !== 'all' && ` in ${typeFilter} nodes`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="text-blue-700 hover:text-blue-900 h-5 px-1 text-xs"
              >
                Clear
              </Button>
            </p>
          </div>
        )}
      </div>

      <input
        type="file"
        id="import-workflow"
        className="hidden"
        accept=".json"
        onChange={handleImport}
      />

      <WorkflowTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
