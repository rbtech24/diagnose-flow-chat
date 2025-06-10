
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './FlowAnimations.css';
import DiagnosisNode from '../diagnosis/DiagnosisNode';
import { enhancedEdgeOptions } from '@/utils/flow/edge-styles';
import { FlowToolbar } from './FlowToolbar';
import { FlowBackground } from './FlowBackground';
import { Node } from '@xyflow/react';
import { SavedWorkflow } from '@/utils/flow/types';
import { useWorkflowSearch } from '@/hooks/useWorkflowSearch';
import { useMemo } from 'react';

// Define all node types to be rendered with DiagnosisNode
const nodeTypes = {
  diagnosis: DiagnosisNode,
  flowNode: DiagnosisNode,
  flowTitle: DiagnosisNode,
  flowAnswer: DiagnosisNode
};

interface FlowWrapperProps {
  nodes: Node[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  snapToGrid: boolean;
  onAddNode: () => void;
  onSave: (name: string, folder: string, appliance: string) => Promise<void>;
  onImportClick: () => void;
  onCopySelected: () => void;
  onPaste: () => void;
  onDeleteSelected: () => void;
  appliances: string[];
  onApplyNodeChanges?: () => void;
  currentWorkflow?: SavedWorkflow;
  onNodeFocus?: (nodeId: string) => void;
}

export function FlowWrapper({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  snapToGrid,
  onAddNode,
  onSave,
  onImportClick,
  onCopySelected,
  onPaste,
  onDeleteSelected,
  appliances,
  onApplyNodeChanges,
  currentWorkflow,
  onNodeFocus,
}: FlowWrapperProps) {
  const { filteredNodeIds, highlightedNodes, hasActiveFilters } = useWorkflowSearch(nodes);

  // Apply search/filter styling to nodes
  const styledNodes = useMemo(() => {
    if (!hasActiveFilters) {
      return nodes;
    }

    return nodes.map(node => {
      const isFiltered = filteredNodeIds.has(node.id);
      const isHighlighted = highlightedNodes.has(node.id);
      
      let style = { ...node.style };
      let className = node.className || '';

      if (hasActiveFilters) {
        if (!isFiltered) {
          // Dim nodes that don't match the filter
          style = {
            ...style,
            opacity: 0.3,
          };
        } else if (isHighlighted) {
          // Highlight specific focused nodes
          style = {
            ...style,
            boxShadow: '0 0 0 3px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.3)',
            opacity: 1,
          };
          className += ' search-highlighted';
        } else {
          // Show filtered nodes normally
          style = {
            ...style,
            opacity: 1,
          };
        }
      }

      return {
        ...node,
        style,
        className
      };
    });
  }, [nodes, filteredNodeIds, highlightedNodes, hasActiveFilters]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={enhancedEdgeOptions}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView={false}
        className="bg-gray-50"
        minZoom={0.1}
        maxZoom={3}
        defaultViewport={{ x: 100, y: 100, zoom: 0.6 }}
        style={{ 
          backgroundColor: '#f9fafb',
          '--xy-edge-stroke-default': '#22c55e',
          '--xy-edge-stroke-width-default': '3px'
        } as React.CSSProperties}
      >
        <FlowBackground />
        <FlowToolbar
          onAddNode={onAddNode}
          onSave={onSave}
          onImportClick={onImportClick}
          onCopySelected={onCopySelected}
          onPaste={onPaste}
          onDeleteSelected={onDeleteSelected}
          appliances={appliances}
          onApplyNodeChanges={onApplyNodeChanges}
          currentWorkflow={currentWorkflow}
          onNodeFocus={onNodeFocus}
        />
      </ReactFlow>
    </div>
  );
}

export function FlowWrapperWithProvider(props: FlowWrapperProps) {
  return (
    <ReactFlowProvider>
      <FlowWrapper {...props} />
    </ReactFlowProvider>
  );
}
