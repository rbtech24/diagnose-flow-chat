
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { ApplianceManager } from '@/components/workflow/ApplianceManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    const path = name 
      ? `/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`
      : `/workflow-editor?folder=${encodeURIComponent(folder)}`;
    navigate(path);
  };

  const handleAddIssue = (applianceName: string) => {
    openWorkflowEditor(applianceName);
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-slate-600 hover:text-slate-900"
          onClick={handleBackToAdmin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
      </div>

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
        onAddIssue={handleAddIssue}
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
