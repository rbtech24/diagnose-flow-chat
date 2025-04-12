
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from 'react-hot-toast';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { ApplianceManager } from '@/components/workflow/ApplianceManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { role } = useUserRole();
  const isAdmin = role === 'admin';

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
    if (!isAdmin) {
      toast.error("Only administrators can add appliances.");
      return;
    }
    
    addAppliance(name);
    toast.success(`${name} has been added successfully.`);
  };

  const openWorkflowEditor = (folder: string, name?: string) => {
    if (!isAdmin) {
      toast("You don't have permission to edit workflows.");
      return;
    }
    
    const path = name 
      ? `/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`
      : `/workflow-editor?folder=${encodeURIComponent(folder)}`;
    navigate(path);
  };

  const handleAddIssue = (applianceName: string) => {
    if (!isAdmin) {
      toast.error("Only administrators can add workflows.");
      return;
    }
    
    openWorkflowEditor(applianceName);
  };

  const handleBackToDashboard = () => {
    if (isAdmin) {
      navigate('/admin');
    } else if (role === 'company') { // Changed from 'company_admin' to 'company'
      navigate('/company');
    } else {
      navigate('/tech');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-slate-600 hover:text-slate-900"
          onClick={handleBackToDashboard}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <WorkflowHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        folders={folders}
        isReordering={isReordering}
        onReorderingChange={isAdmin ? setIsReordering : undefined}
        onAddAppliance={isAdmin ? handleAddAppliance : undefined}
      />

      <WorkflowView
        filteredAppliances={filteredAppliances}
        workflows={workflows}
        isReordering={isReordering}
        selectedFolder={selectedFolder}
        onEdit={isAdmin ? (index, name) => setEditingAppliance({ index, name }) : undefined}
        onDelete={isAdmin ? (index) => setDeletingApplianceIndex(index) : undefined}
        onToggleWorkflow={isAdmin ? toggleWorkflow : undefined}
        onMoveSymptom={isAdmin ? moveSymptom : undefined}
        onMoveAppliance={isAdmin ? moveAppliance : undefined}
        onOpenWorkflowEditor={isAdmin ? openWorkflowEditor : undefined}
        onAddIssue={isAdmin ? handleAddIssue : undefined}
        onDeleteWorkflow={isAdmin ? handleDeleteWorkflow : undefined}
        onMoveWorkflow={isAdmin ? handleMoveWorkflow : undefined}
        onToggleWorkflowActive={isAdmin ? handleToggleWorkflowActive : undefined}
        onMoveWorkflowToFolder={isAdmin ? handleMoveWorkflowToFolder : undefined}
        isReadOnly={!isAdmin}
      />

      {isAdmin && (
        <ApplianceManager
          editingAppliance={editingAppliance}
          setEditingAppliance={setEditingAppliance}
          deletingApplianceIndex={deletingApplianceIndex}
          setDeletingApplianceIndex={setDeletingApplianceIndex}
          editAppliance={editAppliance}
          deleteAppliance={deleteAppliance}
        />
      )}
    </div>
  );
}
