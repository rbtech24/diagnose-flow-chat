
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Try to get session from localStorage
          const storedSession = localStorage.getItem('supabase.auth.token');
          if (storedSession) {
            // If we have a stored session, try to refresh it
            const { data: refreshed, error } = await supabase.auth.refreshSession();
            if (!error && refreshed.session) {
              setIsCheckingAuth(false);
              return;
            }
          }

          toast({
            title: "Authentication Required",
            description: "Please sign in to access the workflow editor",
            variant: "destructive"
          });
          
          // Store the current URL to redirect back after auth
          localStorage.setItem('redirectAfterAuth', window.location.pathname + window.location.search);
          
          // Open the main system auth page in a new tab
          window.open('https://rapmain.netlify.app/admin/', '_blank');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "There was an error checking your authentication status",
          variant: "destructive"
        });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.open('https://rapmain.netlify.app/admin/', '_blank');
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Checking authentication...</h2>
          <p className="text-gray-600">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

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
