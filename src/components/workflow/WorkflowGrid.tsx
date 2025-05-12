
import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash, GripVertical, FileText, Edit, Eye, MoveHorizontal, FolderIcon, Plus, ChevronUp, ChevronDown, Check, ArrowUpRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkflowGridProps {
  appliances: Appliance[];
  workflows: SavedWorkflow[];
  isReordering: boolean;
  onEdit: (index: number, name: string) => void;
  onDelete: (index: number) => void;
  onToggleWorkflow: (applianceIndex: number, symptomIndex: number) => void;
  onMoveSymptom: (applianceIndex: number, fromIndex: number, toIndex: number) => void;
  onMoveAppliance: (fromIndex: number, toIndex: number) => void;
  onOpenWorkflowEditor: (applianceName: string, symptomName?: string) => void;
  onAddIssue: (applianceName: string) => void;
  onDeleteWorkflow: (workflow: SavedWorkflow) => void;
  onMoveWorkflow: (fromIndex: number, toIndex: number) => void;
  onToggleWorkflowActive: (workflow: SavedWorkflow) => void;
  onMoveWorkflowToFolder?: (workflow: SavedWorkflow, targetFolder: string) => Promise<boolean>;
  getSymptomCardColor: (index: number) => string;
  isReadOnly?: boolean;
  workflowsByFolder?: Record<string, SavedWorkflow[]>;
  enableFolderView?: boolean;
}

export function WorkflowGrid({
  appliances,
  workflows,
  isReordering,
  onEdit,
  onDelete,
  onToggleWorkflow,
  onMoveSymptom,
  onMoveAppliance,
  onOpenWorkflowEditor,
  onAddIssue,
  onDeleteWorkflow,
  onMoveWorkflow,
  onToggleWorkflowActive,
  onMoveWorkflowToFolder,
  getSymptomCardColor,
  isReadOnly = false,
  workflowsByFolder = {},
  enableFolderView = false
}: WorkflowGridProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [draggingWorkflow, setDraggingWorkflow] = useState<SavedWorkflow | null>(null);

  // Toggle folder expansion
  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // Check if the folder is expanded
  const isFolderExpanded = (folderName: string) => {
    return expandedFolders[folderName] === true;
  };

  if (appliances.length === 0 && workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No appliances or workflows found matching your search criteria.</p>
      </div>
    );
  }

  const availableFolders = [...new Set([
    'Default',
    ...appliances.map(app => app.name),
  ])];

  const handleDragOver = (e: React.DragEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    const targetCard = (e.target as HTMLElement).closest('.workflow-item, .appliance-card, .folder-container');
    if (targetCard) {
      targetCard.classList.add('border-purple-300', 'border-2');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    const targetCard = (e.target as HTMLElement).closest('.workflow-item, .appliance-card, .folder-container');
    if (targetCard) {
      targetCard.classList.remove('border-purple-300', 'border-2');
    }
  };

  const handleDrop = (e: React.DragEvent, targetAppliance: string) => {
    if (isReadOnly) return;
    e.preventDefault();
    
    const targetCard = (e.target as HTMLElement).closest('.workflow-item, .appliance-card, .folder-container');
    if (targetCard) {
      targetCard.classList.remove('border-purple-300', 'border-2');
    }

    // Get workflow data from drag event
    const workflowData = e.dataTransfer.getData('workflow-data');
    if (workflowData && draggingWorkflow) {
      const workflow = JSON.parse(workflowData);
      if (workflow.metadata.folder !== targetAppliance) {
        onMoveWorkflowToFolder?.(workflow, targetAppliance).then(success => {
          if (success) {
            toast({
              title: "Workflow Moved",
              description: `Workflow moved to ${targetAppliance}`
            });
          }
        });
      }
    }
    setDraggingWorkflow(null);
  };

  const handleDragStart = (e: React.DragEvent, workflow: SavedWorkflow) => {
    if (isReadOnly) return;
    e.dataTransfer.setData('workflow-index', workflowsByFolder[workflow.metadata.folder]?.indexOf(workflow).toString() || "0");
    e.dataTransfer.setData('workflow-data', JSON.stringify(workflow));
    e.dataTransfer.setData('source-folder', workflow.metadata.folder || 'Default');
    setDraggingWorkflow(workflow);
    const dragPreview = e.target as HTMLElement;
    dragPreview.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (isReadOnly) return;
    const dragPreview = e.target as HTMLElement;
    dragPreview.classList.remove('opacity-50');
    setDraggingWorkflow(null);
  };

  const handleWorkflowDrop = (e: React.DragEvent, targetWorkflow: SavedWorkflow) => {
    if (isReadOnly) return;
    e.preventDefault();
    
    const targetCard = (e.target as HTMLElement).closest('.workflow-item');
    if (targetCard) {
      targetCard.classList.remove('border-purple-300', 'border-2');
    }
    
    const sourceIndex = parseInt(e.dataTransfer.getData('workflow-index'), 10);
    const sourceFolder = e.dataTransfer.getData('source-folder');
    
    // Only handle reordering within the same folder
    if (sourceFolder === targetWorkflow.metadata.folder) {
      const folderWorkflows = workflowsByFolder[sourceFolder] || [];
      const targetIndex = folderWorkflows.findIndex(w => 
        w.metadata.name === targetWorkflow.metadata.name && 
        w.metadata.folder === targetWorkflow.metadata.folder
      );
      
      if (sourceIndex !== targetIndex && targetIndex !== -1) {
        onMoveWorkflow(sourceIndex, targetIndex);
        toast({
          title: "Workflow Reordered",
          description: "Workflow position updated successfully"
        });
      }
    }
    setDraggingWorkflow(null);
  };

  const handleFolderDrop = (e: React.DragEvent, folderName: string) => {
    if (isReadOnly) return;
    e.preventDefault();
    
    const targetFolder = (e.target as HTMLElement).closest('.folder-container');
    if (targetFolder) {
      targetFolder.classList.remove('border-purple-300', 'border-2');
    }

    // Move workflow to this folder
    const workflowData = e.dataTransfer.getData('workflow-data');
    if (workflowData && draggingWorkflow) {
      const workflow = JSON.parse(workflowData);
      if (workflow.metadata.folder !== folderName) {
        onMoveWorkflowToFolder?.(workflow, folderName).then(success => {
          if (success) {
            toast({
              title: "Workflow Moved",
              description: `Workflow moved to ${folderName}`
            });
          }
        });
      }
    }
    setDraggingWorkflow(null);
  };

  const handleViewWorkflow = (folder: string, name?: string) => {
    if (isReadOnly) {
      // Just show a toast message for view-only users
      toast({
        title: "Workflow Details",
        description: `Viewing workflow: ${name || 'New Workflow'}`
      });
      return;
    }
    
    // For admins, open the editor
    onOpenWorkflowEditor(folder, name);
  };

  // Render folder view with workflows grouped by folder
  if (enableFolderView && Object.keys(workflowsByFolder).length > 0) {
    return (
      <div className="space-y-6">
        {Object.entries(workflowsByFolder).map(([folderName, folderWorkflows]) => (
          <div 
            key={folderName} 
            className="folder-container border rounded-lg overflow-hidden"
            onDragOver={isReadOnly ? undefined : handleDragOver}
            onDragLeave={isReadOnly ? undefined : handleDragLeave}
            onDrop={isReadOnly ? undefined : (e) => handleFolderDrop(e, folderName)}
          >
            <div 
              className="bg-slate-100 p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleFolder(folderName)}
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-lg">{folderName}</h3>
                <span className="text-sm text-gray-500">({folderWorkflows.length})</span>
              </div>
              <div className="flex items-center gap-2">
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWorkflowEditor(folderName);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folderName);
                  }}
                >
                  {isFolderExpanded(folderName) ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Collapse</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Expand</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isFolderExpanded(folderName) && (
              <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folderWorkflows.map((workflow, index) => (
                  <Card 
                    key={`workflow-${workflow.metadata.name}-${workflow.metadata.folder}`}
                    className="workflow-item group relative p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                    draggable={!isReadOnly && isReordering}
                    onDragStart={isReadOnly ? undefined : (e) => handleDragStart(e, workflow)}
                    onDragEnd={isReadOnly ? undefined : handleDragEnd}
                    onDragOver={isReadOnly ? undefined : handleDragOver}
                    onDragLeave={isReadOnly ? undefined : handleDragLeave}
                    onDrop={isReadOnly ? undefined : (e) => handleWorkflowDrop(e, workflow)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {!isReadOnly && isReordering && (
                          <div className="mt-1 cursor-grab">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="mt-1">
                          <FileText className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">
                            {workflow.metadata.name}
                          </h2>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              {workflow.nodes.length} steps
                            </div>
                            <div className={`${workflow.metadata.isActive ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-1`}>
                              {workflow.metadata.isActive ? (
                                <>
                                  <Check className="h-3 w-3 text-green-500" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <span>Inactive</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-1">
                          {!isReadOnly && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onDeleteWorkflow(workflow);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => onOpenWorkflowEditor(workflow.metadata.folder || '', workflow.metadata.name)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {onMoveWorkflowToFolder && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0 text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                                    >
                                      <MoveHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Move to folder</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {availableFolders.map((folder) => (
                                      <DropdownMenuItem 
                                        key={folder}
                                        disabled={folder === workflow.metadata.folder}
                                        onClick={() => {
                                          if (folder !== workflow.metadata.folder) {
                                            onMoveWorkflowToFolder(workflow, folder).then(success => {
                                              if (success) {
                                                toast({
                                                  title: "Workflow Moved",
                                                  description: `Moved to ${folder} folder`
                                                });
                                              }
                                            });
                                          }
                                        }}
                                      >
                                        {folder}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                            onClick={() => handleViewWorkflow(workflow.metadata.folder || '', workflow.metadata.name)}
                          >
                            {isReadOnly ? <Eye className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                          </Button>
                        </div>
                        {!isReadOnly && (
                          <Switch
                            checked={workflow.metadata.isActive === true}
                            onCheckedChange={() => onToggleWorkflowActive(workflow)}
                            className="data-[state=checked]:bg-green-500"
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {!isReadOnly && (
                  <Card 
                    className="group relative p-4 shadow-sm border border-dashed border-gray-300 hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer"
                    onClick={() => onOpenWorkflowEditor(folderName)}
                  >
                    <div className="text-center">
                      <Plus className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Create New Workflow</p>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Otherwise, use the regular grid view (old behavior)
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appliances.map((appliance, index) => (
        <div
          key={`appliance-${appliance.name}`}
          className="appliance-card"
          onDragOver={isReadOnly ? undefined : handleDragOver}
          onDragLeave={isReadOnly ? undefined : handleDragLeave}
          onDrop={isReadOnly ? undefined : (e) => handleDrop(e, appliance.name)}
        >
          <ApplianceCard
            appliance={appliance}
            index={index}
            isReordering={isReordering}
            onEdit={isReadOnly ? undefined : () => onEdit(index, appliance.name)}
            onDelete={isReadOnly ? undefined : () => onDelete(index)}
            onToggleWorkflow={isReadOnly ? undefined : (symptomIndex) => onToggleWorkflow(index, symptomIndex)}
            onMoveSymptom={isReadOnly ? undefined : (fromIndex, toIndex) => onMoveSymptom(index, fromIndex, toIndex)}
            onMoveAppliance={isReadOnly ? undefined : onMoveAppliance}
            onOpenWorkflowEditor={isReadOnly ? 
              (symptomName) => toast({
                title: "View Only",
                description: `Viewing ${symptomName} in ${appliance.name}`
              }) : 
              (symptomName) => onOpenWorkflowEditor(appliance.name, symptomName)
            }
            onAddIssue={isReadOnly ? undefined : () => onAddIssue(appliance.name)}
            getSymptomCardColor={getSymptomCardColor}
          />
        </div>
      ))}

      {workflows.map((workflow, index) => (
        <Card 
          key={`workflow-${workflow.metadata.name}-${workflow.metadata.folder}`}
          className="group relative p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          draggable={!isReadOnly}
          onDragStart={isReadOnly ? undefined : (e) => {
            e.dataTransfer.setData('workflow-index', index.toString());
            e.dataTransfer.setData('workflow-data', JSON.stringify(workflow));
            const dragPreview = e.target as HTMLElement;
            dragPreview.classList.add('opacity-50');
          }}
          onDragEnd={isReadOnly ? undefined : (e) => {
            const dragPreview = e.target as HTMLElement;
            dragPreview.classList.remove('opacity-50');
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {workflow.metadata.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Folder: {workflow.metadata.folder}
                </p>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {workflow.nodes.length} steps
                  </div>
                  <div className={`${workflow.metadata.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {workflow.metadata.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                {!isReadOnly && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteWorkflow(workflow);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => onOpenWorkflowEditor(workflow.metadata.folder || '', workflow.metadata.name)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {onMoveWorkflowToFolder && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                          >
                            <MoveHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Move to folder</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {availableFolders.map((folder) => (
                            <DropdownMenuItem 
                              key={folder}
                              disabled={folder === workflow.metadata.folder}
                              onClick={() => {
                                if (folder !== workflow.metadata.folder) {
                                  onMoveWorkflowToFolder(workflow, folder);
                                }
                              }}
                            >
                              {folder}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                  onClick={() => handleViewWorkflow(workflow.metadata.folder || '', workflow.metadata.name)}
                >
                  {isReadOnly ? <Eye className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </Button>
              </div>
              {!isReadOnly && (
                <Switch
                  checked={workflow.metadata.isActive === true}
                  onCheckedChange={() => onToggleWorkflowActive(workflow)}
                  className="data-[state=checked]:bg-green-500"
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
