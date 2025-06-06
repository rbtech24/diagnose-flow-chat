
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import NodeConfigPanel from '@/components/NodeConfigPanel';
import { useState, useCallback, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';
import { useWorkflows } from '@/hooks/useWorkflows';
import { SavedWorkflow } from '@/utils/flow/types';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const isNew = searchParams.get('new') === 'true';
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updateNodeFn, setUpdateNodeFn] = useState<((nodeId: string, newData: any) => void) | null>(null);
  const { userRole, isLoading } = useUserRole();
  const { folders, loadWorkflows } = useWorkflows();
  const [currentWorkflow, setCurrentWorkflow] = useState<SavedWorkflow | undefined>(undefined);

  // Load the current workflow if name is provided
  useEffect(() => {
    if (folder && name) {
      // Attempt to load the workflow from localStorage
      try {
        const storedWorkflows = JSON.parse(localStorage.getItem('diagnostic-workflows') || '[]');
        const matchingWorkflow = storedWorkflows.find(
          (w: SavedWorkflow) => 
            w.metadata.name === name && 
            (w.metadata.folder === folder || w.metadata.appliance === folder)
        );
        
        if (matchingWorkflow) {
          setCurrentWorkflow(matchingWorkflow);
        } else {
          toast({
            title: "Workflow Not Found",
            description: `Could not locate workflow "${name}" in folder "${folder}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        // Handle error silently or with user-friendly message
        toast({
          title: "Error Loading Workflow",
          description: "Failed to load the requested workflow",
          variant: "destructive"
        });
      }
    }
  }, [folder, name]);

  const handleNodeSelect = useCallback((node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    setSelectedNode(node);
    setUpdateNodeFn(() => updateNode);
  }, []);

  const handleNodeUpdate = useCallback((nodeData: any) => {
    if (selectedNode && updateNodeFn) {
      updateNodeFn(selectedNode.id, nodeData);
      toast({
        title: "Node Updated",
        description: "Node data has been successfully updated"
      });
    }
  }, [selectedNode, updateNodeFn]);

  const handleBackToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/workflows', { replace: true });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col">
        <div className="p-2 bg-slate-100 border-b flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center text-slate-600 hover:text-slate-900"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Button>
          <div className="ml-4 text-sm text-slate-500">
            {isNew && "Creating New Workflow"}
            {folder && !isNew && `Editing: ${folder}${name ? ` / ${name}` : ''}`}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex-1">
            <FlowEditor 
              folder={folder || ''} 
              name={name || ''} 
              appliances={folders} 
              onNodeSelect={handleNodeSelect}
              currentWorkflow={currentWorkflow}
            />
          </div>
          {selectedNode && (
            <div className="w-96 border-l border-gray-200 bg-white">
              <NodeConfigPanel 
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onUpdate={handleNodeUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
