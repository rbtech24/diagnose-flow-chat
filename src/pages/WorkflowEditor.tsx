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
  const { userRole, isLoading: isUserRoleLoading } = useUserRole();
  const { workflows, folders, isLoading: isWorkflowsLoading } = useWorkflows();
  const [currentWorkflow, setCurrentWorkflow] = useState<SavedWorkflow | undefined>(undefined);

  // Load the current workflow if name is provided
  useEffect(() => {
    if (folder && name && !isWorkflowsLoading && workflows.length > 0) {
      const matchingWorkflow = workflows.find(
        (w: SavedWorkflow) => 
          w.metadata.name === name && 
          (w.metadata.folder === folder || w.metadata.appliance === folder)
      );
      
      if (matchingWorkflow) {
        setCurrentWorkflow(matchingWorkflow);
      } else if (!isNew) {
        toast({
          title: "Workflow Not Found",
          description: `Could not locate workflow "${name}" in folder "${folder}"`,
          variant: "destructive"
        });
      }
    }
  }, [folder, name, isWorkflowsLoading, workflows, isNew]);

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

  if (isUserRoleLoading || (isWorkflowsLoading && !isNew)) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen flex flex-col bg-slate-50">
        <header className="p-2 bg-slate-100 border-b flex items-center shrink-0">
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
        </header>
        <main className="flex-1 flex min-h-0">
          <div className="flex-1 relative">
            <FlowEditor 
              folder={folder || ''} 
              name={name || ''} 
              appliances={folders} 
              onNodeSelect={handleNodeSelect}
              currentWorkflow={currentWorkflow}
            />
          </div>
          {selectedNode && (
            <aside className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
              <NodeConfigPanel 
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onUpdate={handleNodeUpdate}
              />
            </aside>
          )}
        </main>
      </div>
    </ReactFlowProvider>
  );
}
