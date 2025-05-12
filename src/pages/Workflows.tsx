
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/hooks/useAppliances';
import { useWorkflows } from '@/hooks/useWorkflows';
import { toast } from '@/hooks/use-toast';
import { WorkflowHeader } from '@/components/workflow/WorkflowHeader';
import { WorkflowView } from '@/components/workflow/WorkflowView';
import { ApplianceManager } from '@/components/workflow/ApplianceManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
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
      console.log("Refreshing folders");
      const folders = await getFolders();
      setFolderList(folders);
      // Run cleanup operations (with better error handling)
      try {
        await cleanupOrphanedWorkflows();
      } catch (err) {
        console.error("Error during orphaned workflow cleanup:", err);
      }
      try {
        await cleanupEmptyFolders();
      } catch (err) {
        console.error("Error during empty folder cleanup:", err);
      }
      // Refresh workflows (with better error handling)
      try {
        await loadWorkflows();
      } catch (err) {
        console.error("Error loading workflows:", err);
        toast({
          title: "Load Error",
          description: "Couldn't load workflows from server. Using local data.",
          variant: "destructive"
        });
      }
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
    addAppliance(name);
    refreshFolders();
    toast({
      title: "Appliance Added",
      description: `${name} has been added successfully.`
    });
  };

  // Function to properly open workflow editor
  const openWorkflowEditor = (folder: string, name?: string) => {
    if (name) {
      navigate(`/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`);
    } else {
      navigate(`/workflow-editor?folder=${encodeURIComponent(folder)}`);
    }
  };

  const handleAddIssue = (applianceName: string) => {
    openWorkflowEditor(applianceName);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Function to create new workflow
  const handleCreateNewWorkflow = () => {
    navigate(`/workflow-editor?new=true`);
  };
  
  const handleMoveWorkflowToFolderWithRefresh = async (workflow: SavedWorkflow, targetFolder: string) => {
    const success = await handleMoveWorkflowToFolder(workflow, targetFolder);
    if (success) {
      await refreshFolders();
    }
    return success;
  };

  // Group workflows by folder for folder view
  const workflowsByFolder: Record<string, SavedWorkflow[]> = {};
  workflows.forEach(workflow => {
    const folderName = workflow.metadata?.folder || 'Default';
    if (!workflowsByFolder[folderName]) {
      workflowsByFolder[folderName] = [];
    }
    workflowsByFolder[folderName].push(workflow);
  });

  // All users can now see workflows
  const canManageWorkflows = true;

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
        
        <Button 
          variant="default"
          size="sm" 
          className="flex items-center"
          onClick={handleCreateNewWorkflow}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Workflow
        </Button>
      </div>

      <WorkflowHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFolder={selectedFolder}
        onFolderChange={setSelectedFolder}
        folders={folderList}
        isReordering={isReordering}
        onReorderingChange={canManageWorkflows ? setIsReordering : undefined}
        onAddAppliance={canManageWorkflows ? handleAddAppliance : undefined}
        onFoldersRefresh={canManageWorkflows ? refreshFolders : undefined}
      />

      <WorkflowView
        filteredAppliances={filteredAppliances}
        workflows={workflows}
        isReordering={isReordering}
        selectedFolder={selectedFolder}
        onEdit={canManageWorkflows ? (index, name) => setEditingAppliance({ index, name }) : undefined}
        onDelete={canManageWorkflows ? (index) => setDeletingApplianceIndex(index) : undefined}
        onToggleWorkflow={canManageWorkflows ? toggleWorkflow : undefined}
        onMoveSymptom={canManageWorkflows ? moveSymptom : undefined}
        onMoveAppliance={canManageWorkflows ? moveAppliance : undefined}
        onOpenWorkflowEditor={openWorkflowEditor}
        onAddIssue={canManageWorkflows ? handleAddIssue : undefined}
        onDeleteWorkflow={canManageWorkflows ? handleDeleteWorkflow : undefined}
        onMoveWorkflow={canManageWorkflows ? handleMoveWorkflow : undefined}
        onToggleWorkflowActive={canManageWorkflows ? handleToggleWorkflowActive : undefined}
        onMoveWorkflowToFolder={canManageWorkflows ? handleMoveWorkflowToFolderWithRefresh : undefined}
        isReadOnly={!canManageWorkflows}
        workflowsByFolder={workflowsByFolder} 
        enableFolderView={true}
        enableDragDrop={isReordering}
      />

      {canManageWorkflows && (
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
