
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import NodeConfigPanel from '@/components/NodeConfigPanel';
import { useState, useCallback, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updateNodeFn, setUpdateNodeFn] = useState<((nodeId: string, newData: any) => void) | null>(null);
  const { userRole, isLoading } = useUserRole();
  const { checkWorkflowAccess } = useAuth();

  useEffect(() => {
    // Check if user has admin permissions
    if (!isLoading) {
      if (userRole !== 'admin') {
        toast({
          title: "Access Denied",
          description: "Only administrators can edit workflows.",
          variant: "destructive"
        });
        navigate('/admin/workflows');
        return;
      }
      
      // For existing workflows, check licensing
      if (folder && name) {
        const workflowId = `${folder}-${name}`;
        const accessStatus = checkWorkflowAccess(workflowId);
        
        if (!accessStatus.hasAccess) {
          toast({
            title: "License Issue",
            description: accessStatus.message || "Your license doesn't allow editing this workflow.",
            variant: "destructive"
          });
          navigate('/admin/workflows');
        }
      }
    }
  }, [userRole, isLoading, navigate, folder, name, toast, checkWorkflowAccess]);

  const handleNodeSelect = useCallback((node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    console.log('WorkflowEditor handleNodeSelect:', node);
    setSelectedNode(node);
    setUpdateNodeFn(() => updateNode);
  }, []);

  const handleNodeUpdate = useCallback((nodeData: any) => {
    console.log('WorkflowEditor handleNodeUpdate:', nodeData);
    if (selectedNode && updateNodeFn) {
      updateNodeFn(selectedNode.id, nodeData);
    }
  }, [selectedNode, updateNodeFn]);

  const handleBackToDashboard = () => {
    if (userRole === 'admin') {
      navigate('/admin/workflows');
    } else {
      navigate('/workflows');
    }
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
            {folder && `Editing: ${folder}${name ? ` / ${name}` : ''}`}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex-1">
            <FlowEditor 
              folder={folder || ''} 
              name={name || ''} 
              appliances={[]} 
              onNodeSelect={handleNodeSelect}
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
