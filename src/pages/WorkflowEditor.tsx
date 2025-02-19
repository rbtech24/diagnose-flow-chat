
import { useSearchParams } from 'react-router-dom';
import FlowEditor from '@/components/FlowEditor';
import NodeConfigPanel from '@/components/NodeConfigPanel';
import { useState } from 'react';
import { Node } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';

export default function WorkflowEditor() {
  const [searchParams] = useSearchParams();
  const folder = searchParams.get('folder');
  const name = searchParams.get('name');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updateNodeFn, setUpdateNodeFn] = useState<((nodeId: string, newData: any) => void) | null>(null);

  const handleNodeSelect = (node: Node, updateNode: (nodeId: string, newData: any) => void) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
    setUpdateNodeFn(() => updateNode); // Store the update function
  };

  const handleNodeUpdate = (nodeData: any) => {
    if (selectedNode && updateNodeFn) {
      console.log('Updating node with data:', nodeData);
      updateNodeFn(selectedNode.id, nodeData);
    }
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
              onUpdate={handleNodeUpdate}
            />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
