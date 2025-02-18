
import { useSearchParams } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import { NodeConfigPanel } from '@/components/NodeConfigPanel';
import { useState } from 'react';
import { Node } from '@xyflow/react';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeSelect = (node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    setSelectedNode(node);
  };

  return (
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
  );
}
