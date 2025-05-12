
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Workflow, FileText, GripVertical, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useWorkflows } from "@/hooks/useWorkflows";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminWorkflows() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { workflows, handleMoveWorkflow, handleDeleteWorkflow, handleToggleWorkflowActive } = useWorkflows();
  const [reorderMode, setReorderMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<any>(null);
  
  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.metadata.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkflow = () => {
    console.log("Navigating to workflow editor");
    navigate('/admin/workflow-editor');
  };

  const handleEditWorkflow = (folder: string, name: string) => {
    // The issue was here - we need to use the correct path format when in the admin section
    // Using the current URL path structure to determine if we're in the admin section
    const path = window.location.pathname.startsWith('/admin') 
      ? `/admin/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`
      : `/workflow-editor?folder=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`;
    
    console.log("Navigating to:", path);
    navigate(path);
  };
  
  const handleMoveWorkflowItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    handleMoveWorkflow(fromIndex, toIndex);
    toast({
      title: "Workflow Reordered",
      description: "Workflow position updated successfully"
    });
  };

  const openDeleteDialog = (workflow: any) => {
    setWorkflowToDelete(workflow);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      handleDeleteWorkflow(workflowToDelete);
      toast({
        title: "Workflow Deleted",
        description: `"${workflowToDelete.metadata.name}" has been deleted`
      });
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const handleToggleActive = (workflow: any) => {
    handleToggleWorkflowActive(workflow);
    toast({
      title: workflow.metadata.isActive ? "Workflow Deactivated" : "Workflow Activated",
      description: `"${workflow.metadata.name}" is now ${workflow.metadata.isActive ? "deactivated" : "activated"}`
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage diagnosis workflows across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search workflows..." 
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setReorderMode(!reorderMode)}>
            {reorderMode ? "Done Reordering" : "Reorder Workflows"}
          </Button>
          <Button onClick={handleCreateWorkflow}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Workflows</CardTitle>
            <CardDescription>
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} available in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredWorkflows.length > 0 ? (
              <div className="space-y-4">
                {filteredWorkflows.map((workflow, index) => (
                  <div 
                    key={`${workflow.metadata.folder}-${workflow.metadata.name}`} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                    draggable={reorderMode}
                    onDragStart={(e) => {
                      if (!reorderMode) return;
                      e.dataTransfer.setData('workflow-index', index.toString());
                    }}
                    onDragOver={(e) => {
                      if (!reorderMode) return;
                      e.preventDefault();
                      e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                    }}
                    onDragLeave={(e) => {
                      if (!reorderMode) return;
                      e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                    }}
                    onDrop={(e) => {
                      if (!reorderMode) return;
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                      
                      const sourceIndex = parseInt(e.dataTransfer.getData('workflow-index'), 10);
                      handleMoveWorkflowItem(sourceIndex, index);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {reorderMode && (
                        <div className="cursor-grab">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{workflow.metadata.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Folder: {workflow.metadata.folder}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`h-2 w-2 rounded-full ${workflow.nodes.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-xs text-gray-500">{workflow.nodes.length} steps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={workflow.metadata.isActive === true}
                        onCheckedChange={() => handleToggleActive(workflow)}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Badge variant={workflow.metadata.isActive ? "secondary" : "outline"}>
                        {workflow.metadata.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditWorkflow(workflow.metadata.folder, workflow.metadata.name)}
                        >
                          Edit Workflow
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(workflow)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 
                  "No workflows found matching your search." : 
                  "No workflows available. Click 'Create Workflow' to add one."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the workflow "{workflowToDelete?.metadata.name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
