
import { useSearchParams } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import NodeConfigPanel from '@/components/NodeConfigPanel';
import { useState } from 'react';
import { Node } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';

export default function AdminWorkflowEditor() {
  const [searchParams] = useSearchParams();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeSelect = (node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    setSelectedNode(node);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Workflow Editor</h1>
        <p className="text-gray-600">
          {folder ? `Editing workflow in ${folder}` : 'New workflow'}
          {name ? ` - ${name}` : ''}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ReactFlowProvider>
          <div className="h-[calc(100vh-12rem)] flex">
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
                    console.log('Updating node:', nodeData);
                  }}
                />
              </div>
            )}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
