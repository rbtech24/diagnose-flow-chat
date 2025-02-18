
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { toast } from '@/hooks/use-toast';
import { getAllWorkflows, getWorkflowsInFolder } from '@/utils/flow';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowGrid } from '@/components/workflow/WorkflowGrid';
import { DeleteApplianceDialog } from '@/components/workflow/DeleteApplianceDialog';
import { EditApplianceDialog } from '@/components/appliance/EditApplianceDialog';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  
  const {
    appliances,
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom
  } = useAppliances();

  // Get all workflows to build the folders list
  const allWorkflows = getAllWorkflows();
  const folders = [...new Set(allWorkflows.map(w => w.metadata?.folder || 'Default'))];
  
  // Get workflows for the selected folder or all workflows if no folder is selected
  const workflows = selectedFolder 
    ? getWorkflowsInFolder(selectedFolder)
    : allWorkflows;

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

  const getSymptomCardColor = (index: number) => {
    const colors = [
      'bg-[#E5DEFF] hover:bg-[#DCD2FF]',
      'bg-[#D3E4FD] hover:bg-[#C4DBFF]',
      'bg-[#FDE1D3] hover:bg-[#FFD4C2]',
      'bg-[#F2FCE2] hover:bg-[#E9F9D4]',
      'bg-[#FEF7CD] hover:bg-[#FFF2B8]',
      'bg-[#FFDEE2] hover:bg-[#FFD0D6]',
    ];
    return colors[index % colors.length];
  };

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

  const handleToggleWorkflow = (applianceIndex: number, symptomIndex: number) => {
    const symptom = toggleWorkflow(applianceIndex, symptomIndex);
    toast({
      title: symptom.isActive ? "Workflow Activated" : "Workflow Deactivated",
      description: `${symptom.name} has been ${symptom.isActive ? 'activated' : 'deactivated'}.`
    });
  };

  const openWorkflowEditor = (applianceName: string, symptomName?: string) => {
    const params = new URLSearchParams();
    if (applianceName) params.set('appliance', applianceName);
    if (symptomName) params.set('symptom', symptomName);
    if (!symptomName) params.set('new', 'true');
    
    navigate({
      pathname: '/',
      search: params.toString(),
    });
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

      {/* Display workflows count for debugging */}
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
        onToggleWorkflow={handleToggleWorkflow}
        onMoveSymptom={moveSymptom}
        onMoveAppliance={moveAppliance}
        onOpenWorkflowEditor={openWorkflowEditor}
        onAddIssue={(applianceName) => openWorkflowEditor(applianceName)}
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
