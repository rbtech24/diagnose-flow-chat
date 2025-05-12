import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { ApplianceManager } from '@/components/workflow/ApplianceManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { cleanupOrphanedWorkflows, cleanupEmptyFolders } from '@/utils/flow';
import { getFolders } from '@/utils/flow/storage/categories';
import { SavedWorkflow } from '@/utils/flow/types';

export default function Workflows() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<{index: number, name: string} | null>(null);
  const [deletingApplianceIndex, setDeletingApplianceIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useUserRole();
  const isAdmin = userRole === 'admin';

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
    loadWorkflows,
    folders: workflowFolders,
    selectedFolder,
    setSelectedFolder,
    handleDeleteWorkflow,
    handleToggleWorkflowActive,
    handleMoveWorkflow,
    handleMoveWorkflowToFolder
  } = useWorkflows();
  
  const [folderList, setFolderList] = useState<string[]>([]);
  
  const refreshFolders = useCallback(async () => {
    try {
      const folders = await getFolders();
      setFolderList(folders);
      // Run cleanup operations
      await cleanupOrphanedWorkflows();
      await cleanupEmptyFolders();
      // Refresh workflows
      await loadWorkflows();
    } catch (error) {
      console.error("Error refreshing folders:", error);
    }
  }, [loadWorkflows]);
  
  useEffect(() => {
    refreshFolders();
  }, [refreshFolders]);

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
      toast({
        title: "Permission Denied",
        description: "Only administrators can add appliances.",
        variant: "destructive"
      });
      return;
    }
    
    addAppliance(name);
    refreshFolders();
    toast({
      title: "Appliance Added",
      description: `${name} has been added successfully.`
    });
  };

  const openWorkflowEditor = (folder: string, name?: string) => {
    if (!isAdmin) {
      toast({
        title: "View-Only Access",
        description: "You don't have permission to edit workflows."
      });
      return;
    }
    
    const path = name 
      ? `/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`
      : `/workflow-editor?folder=${encodeURIComponent(folder)}`;
    navigate(path);
  };

  const handleAddIssue = (applianceName: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can add workflows.",
        variant: "destructive"
      });
      return;
    }
    
    openWorkflowEditor(applianceName);
  };

  const handleBackToDashboard = () => {
    if (isAdmin) {
      navigate('/admin');
    } else if (userRole === 'company') {
      navigate('/company');
    } else {
      navigate('/tech');
    }
  };
  
  const handleMoveWorkflowToFolderWithRefresh = async (workflow: SavedWorkflow, targetFolder: string) => {
    const success = await handleMoveWorkflowToFolder(workflow, targetFolder);
    if (success) {
      await refreshFolders();
    }
    return success;
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
        folders={folderList}
        isReordering={isReordering}
        onReorderingChange={isAdmin ? setIsReordering : undefined}
        onAddAppliance={isAdmin ? handleAddAppliance : undefined}
        onFoldersRefresh={isAdmin ? refreshFolders : undefined}
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
        onMoveWorkflowToFolder={isAdmin ? handleMoveWorkflowToFolderWithRefresh : undefined}
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
