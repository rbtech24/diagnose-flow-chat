import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { toast } from '@/hooks/use-toast';
import { getAllWorkflows, getWorkflowsInFolder } from '@/utils/flow';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { DeleteApplianceDialog } from '@/components/workflow/DeleteApplianceDialog';
import { EditApplianceDialog } from '@/components/appliance/EditApplianceDialog';
import { SavedWorkflow } from '@/utils/flow/types';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [workflowsState, setWorkflowsState] = useState(getAllWorkflows());
  
  const {
    appliances,
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom,
    moveWorkflowToFolder
  } = useAppliances();

  // Get all workflows to build the folders list
  const folders = [...new Set(workflowsState.map(w => w.metadata?.folder || 'Default'))];
  
  // Get workflows for the selected folder or all workflows if no folder is selected
  const workflows = selectedFolder 
    ? workflowsState.filter(w => w.metadata?.folder === selectedFolder)
    : workflowsState;

  console.log('Current folders:', folders);
  console.log('Selected folder:', selectedFolder);
  console.log('Workflows in view:', workflows);
  
  const filteredAppliances = appliances
    .filter(appliance => 
      (selectedFolder ? appliance.name === selectedFolder : true) &&
      (searchTerm ? 
        appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appliance.symptoms.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : true
      )
    );

  const handleAddAppliance = (name: string) => {
    addAppliance(name);
    toast({
      title: "Appliance Added",
      description: `${name} has been added successfully.`
    });
  };

  const handleDeleteAppliance = (index: number) => {
    deleteAppliance(index);
    setDeletingApplianceIndex(null);
    toast({
      title: "Appliance Deleted",
      description: "The appliance and its workflows have been deleted."
    });
  };

  const handleDeleteWorkflow = (workflow: SavedWorkflow) => {
    const updatedWorkflows = workflowsState.filter(w => 
      !(w.metadata.name === workflow.metadata.name && 
        w.metadata.folder === workflow.metadata.folder)
    );
    setWorkflowsState(updatedWorkflows);
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    toast({
      title: "Workflow Deleted",
      description: `${workflow.metadata.name} has been deleted.`
    });
  };

  const handleToggleWorkflowActive = (workflow: SavedWorkflow) => {
    const updatedWorkflows = workflowsState.map(w => {
      if (w.metadata.name === workflow.metadata.name && 
          w.metadata.folder === workflow.metadata.folder) {
        return {
          ...w,
          metadata: {
            ...w.metadata,
            isActive: !w.metadata.isActive
          }
        };
      }
      return w;
    });
    setWorkflowsState(updatedWorkflows);
    localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    toast({
      title: workflow.metadata.isActive ? "Workflow Deactivated" : "Workflow Activated",
      description: `${workflow.metadata.name} has been ${workflow.metadata.isActive ? 'deactivated' : 'activated'}.`
    });
  };

  const handleMoveWorkflow = (fromIndex: number, toIndex: number) => {
    const updatedWorkflows = [...workflows];
    const [movedWorkflow] = updatedWorkflows.splice(fromIndex, 1);
    updatedWorkflows.splice(toIndex, 0, movedWorkflow);
    
    // Update the full workflows state while maintaining the order in the current folder
    if (selectedFolder) {
      const newState = workflowsState.filter(w => w.metadata?.folder !== selectedFolder);
      setWorkflowsState([...newState, ...updatedWorkflows]);
      localStorage.setItem('diagnostic-workflows', JSON.stringify([...newState, ...updatedWorkflows]));
    } else {
      setWorkflowsState(updatedWorkflows);
      localStorage.setItem('diagnostic-workflows', JSON.stringify(updatedWorkflows));
    }

    toast({
      title: "Workflow Moved",
      description: `${movedWorkflow.metadata.name} has been reordered successfully.`
    });
  };

  const handleMoveWorkflowToFolder = (workflow: SavedWorkflow, targetFolder: string) => {
    if (moveWorkflowToFolder(workflow, targetFolder)) {
      // Refresh the workflows state
      setWorkflowsState(getAllWorkflows());
      toast({
        title: "Workflow Moved",
        description: `${workflow.metadata.name} has been moved to ${targetFolder}.`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to move workflow to the selected folder.",
        variant: "destructive"
      });
    }
  };

  const openWorkflowEditor = (folder: string, name?: string) => {
    const path = name 
      ? `/workflow-editor/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`
      : `/workflow-editor/${encodeURIComponent(folder)}`;
    navigate(path);
  };

  const getSymptomCardColor = (index: number): string => {
    const colors = [
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-indigo-100'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto p-6">
      <WorkflowHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        folders={folders}
        isReordering={isReordering}
        onReorderingChange={setIsReordering}
        onAddAppliance={handleAddAppliance}
      />

      <div className="mb-4 text-sm text-gray-500">
        {selectedFolder ? 
          `Showing ${workflows.length} workflows in ${selectedFolder}` : 
          `Showing all ${workflows.length} workflows`
        }
      </div>

      <WorkflowGrid
        appliances={filteredAppliances}
        workflows={workflows}
        isReordering={isReordering}
        onEdit={(index, name) => setEditingAppliance({ index, name })}
        onDelete={(index) => setDeletingApplianceIndex(index)}
        onToggleWorkflow={toggleWorkflow}
        onMoveSymptom={moveSymptom}
        onMoveAppliance={moveAppliance}
        onOpenWorkflowEditor={openWorkflowEditor}
        onAddIssue={(applianceName) => openWorkflowEditor(applianceName)}
        onDeleteWorkflow={handleDeleteWorkflow}
        onMoveWorkflow={handleMoveWorkflow}
        onToggleWorkflowActive={handleToggleWorkflowActive}
        getSymptomCardColor={getSymptomCardColor}
      />

      {editingAppliance && (
        <EditApplianceDialog
          applianceName={editingAppliance.name}
          isOpen={true}
          onClose={() => setEditingAppliance(null)}
          onSave={(newName) => {
            editAppliance(editingAppliance.index, newName);
            setEditingAppliance(null);
          }}
        />
      )}

      <DeleteApplianceDialog
        isOpen={deletingApplianceIndex !== null}
        onClose={() => setDeletingApplianceIndex(null)}
        onConfirm={() => {
          if (deletingApplianceIndex !== null) {
            handleDeleteAppliance(deletingApplianceIndex);
          }
        }}
      />
    </div>
  );
}
