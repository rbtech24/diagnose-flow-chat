
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { ApplianceManager } from '@/components/workflow/ApplianceManager';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    appliances,
    addAppliance,
    editAppliance,
    deleteAppliance,
    toggleWorkflow,
    moveAppliance,
    moveSymptom
  } = useAppliances();

  const {
    workflows,
    folders,
    selectedFolder,
    setSelectedFolder,
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  } = useWorkflows();

  const filteredAppliances = appliances.filter(appliance => 
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

  const openWorkflowEditor = (folder: string, name?: string) => {
    // Remove the encoding which was causing issues with the route
    const path = name 
      ? `/workflow-editor?folder=${folder}&name=${name}`
      : `/workflow-editor?folder=${folder}`;
    navigate(path);
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

      <WorkflowView
        filteredAppliances={filteredAppliances}
        workflows={workflows}
        isReordering={isReordering}
        selectedFolder={selectedFolder}
        onEdit={(index, name) => setEditingAppliance({ index, name })}
        onDelete={(index) => setDeletingApplianceIndex(index)}
        onToggleWorkflow={toggleWorkflow}
        onMoveSymptom={moveSymptom}
        onMoveAppliance={moveAppliance}
        onOpenWorkflowEditor={openWorkflowEditor}
        onDeleteWorkflow={handleDeleteWorkflow}
        onMoveWorkflow={handleMoveWorkflow}
        onToggleWorkflowActive={handleToggleWorkflowActive}
        onMoveWorkflowToFolder={handleMoveWorkflowToFolder}
      />

      <ApplianceManager
        editingAppliance={editingAppliance}
        setEditingAppliance={setEditingAppliance}
        deletingApplianceIndex={deletingApplianceIndex}
        setDeletingApplianceIndex={setDeletingApplianceIndex}
        editAppliance={editAppliance}
        deleteAppliance={deleteAppliance}
      />
    </div>
  );
}
