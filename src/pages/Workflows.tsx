
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
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

  // Fixed function to properly open workflow editor
  const openWorkflowEditor = (folder: string, name?: string) => {
    console.log("Opening workflow editor with:", { folder, name });
    const basePath = isAdmin ? '/admin/workflow-editor' : '/workflow-editor';
    
    if (name) {
      navigate(`${basePath}?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`);
    } else {
      navigate(`${basePath}?folder=${encodeURIComponent(folder)}`);
    }
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
    navigate('/admin/workflows');
  };
  
  // Fixed function to create new workflow
  const handleCreateNewWorkflow = () => {
    console.log("Creating new workflow");
    const basePath = isAdmin ? '/admin/workflow-editor' : '/workflow-editor';
    navigate(`${basePath}?new=true`);
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
          Back to Admin Workflows
        </Button>
        
        {isAdmin && (
          <Button 
            variant="default"
            size="sm" 
            className="flex items-center"
            onClick={handleCreateNewWorkflow}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Workflow
          </Button>
        )}
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
        onOpenWorkflowEditor={openWorkflowEditor}
        onAddIssue={isAdmin ? handleAddIssue : undefined}
        onDeleteWorkflow={isAdmin ? handleDeleteWorkflow : undefined}
        onMoveWorkflow={isAdmin ? handleMoveWorkflow : undefined}
        onToggleWorkflowActive={isAdmin ? handleToggleWorkflowActive : undefined}
        onMoveWorkflowToFolder={isAdmin ? handleMoveWorkflowToFolderWithRefresh : undefined}
        isReadOnly={!isAdmin}
        workflowsByFolder={workflowsByFolder} 
        enableFolderView={true}
        enableDragDrop={isReordering} // Enable drag and drop functionality only when reordering is active
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
