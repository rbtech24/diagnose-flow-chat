
import { useSearchParams, useNavigate } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import NodeConfigPanel from '@/components/NodeConfigPanel';
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the workflow editor",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleNodeSelect = (node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    setSelectedNode(node);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex">
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
              onUpdate={(nodeData) => {
                // Handle node update logic here
                console.log('Updating node:', nodeData);
              }}
            />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
