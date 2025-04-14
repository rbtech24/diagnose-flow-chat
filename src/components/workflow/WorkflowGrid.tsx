import { ApplianceCard } from '@/components/appliance/ApplianceCard';
import { Appliance } from '@/types/appliance';
import { SavedWorkflow } from '@/utils/flow/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, Trash, GripVertical, FileText, Edit, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

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
  onMoveWorkflowToFolder?: (workflow: SavedWorkflow, targetFolder: string) => void;
  getSymptomCardColor: (index: number) => string;
  isReadOnly?: boolean;
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
  isReadOnly = false
}: WorkflowGridProps) {
  const { toast } = useToast();
  
  if (appliances.length === 0 && workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No appliances or workflows found matching your search criteria.</p>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    const targetCard = (e.target as HTMLElement).closest('.appliance-card');
    if (targetCard) {
      targetCard.classList.add('border-purple-300', 'border-2');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    const targetCard = (e.target as HTMLElement).closest('.appliance-card');
    if (targetCard) {
      targetCard.classList.remove('border-purple-300', 'border-2');
    }
  };

  const handleDrop = (e: React.DragEvent, targetAppliance: string) => {
    if (isReadOnly) return;
    e.preventDefault();
    const targetCard = (e.target as HTMLElement).closest('.appliance-card');
    if (targetCard) {
      targetCard.classList.remove('border-purple-300', 'border-2');
    }

    const workflowData = e.dataTransfer.getData('workflow-data');
    if (workflowData) {
      const workflow = JSON.parse(workflowData);
      if (workflow.metadata.folder !== targetAppliance) {
        onMoveWorkflowToFolder?.(workflow, targetAppliance);
        toast({
          title: "Workflow Moved",
          description: `Workflow moved to ${targetAppliance}`,
          type: "success"
        });
      }
    }
  };

  const handleViewWorkflow = (folder: string, name?: string) => {
    if (isReadOnly) {
      toast({
        title: "Workflow Details",
        description: `Viewing workflow: ${name || 'New Workflow'}`,
        type: "custom"
      });
      return;
    }
    
    onOpenWorkflowEditor(folder, name);
  };

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
                description: `Viewing ${symptomName} in ${appliance.name}`,
                type: "custom"
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
                  checked={workflow.metadata.isActive}
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
