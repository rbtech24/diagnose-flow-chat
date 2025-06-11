
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import DiagnosisNode from '@/components/diagnosis/DiagnosisNode';
import { FlowToolbar } from './FlowToolbar';
import { FlowControls } from './enhanced/FlowControls';
import { FlowMinimap } from './enhanced/FlowMinimap';
import { WorkflowOverview } from './enhanced/WorkflowOverview';
import { SavedWorkflow } from '@/utils/flow/types';
import { WorkflowVersion } from '@/hooks/useVersionHistory';
import { WorkflowTemplate } from '@/hooks/useWorkflowTemplates';

const nodeTypes = {
  diagnosis: DiagnosisNode,
};

interface FlowWrapperProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
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
  versions: WorkflowVersion[];
  onRestoreVersion: (version: WorkflowVersion) => void;
  onRemoveVersion: (versionId: string) => void;
  onClearVersions: () => void;
  onLoadTemplate?: (template: WorkflowTemplate) => void;
}

function FlowWrapperComponent({
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
  versions,
  onRestoreVersion,
  onRemoveVersion,
  onClearVersions,
  onLoadTemplate,
}: FlowWrapperProps) {
  const [snapToGridState, setSnapToGridState] = useState(snapToGrid);

  const handleSnapToggle = useCallback(() => {
    setSnapToGridState(prev => !prev);
  }, []);

  const handleAlignNodes = useCallback((alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length < 2) return;

    let alignValue: number;
    const isHorizontal = ['left', 'center', 'right'].includes(alignment);

    if (isHorizontal) {
      const positions = selectedNodes.map(node => node.position.x);
      alignValue = alignment === 'left' 
        ? Math.min(...positions)
        : alignment === 'right'
        ? Math.max(...positions)
        : positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    } else {
      const positions = selectedNodes.map(node => node.position.y);
      alignValue = alignment === 'top'
        ? Math.min(...positions)
        : alignment === 'bottom'
        ? Math.max(...positions)
        : positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    }

    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        return {
          ...node,
          position: {
            ...node.position,
            [isHorizontal ? 'x' : 'y']: alignValue
          }
        };
      }
      return node;
    });

    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange]);

  const handleAutoLayout = useCallback(() => {
    // Simple auto-layout algorithm - arrange nodes in a grid
    const gridSize = Math.ceil(Math.sqrt(nodes.length));
    const spacing = 200;
    
    const updatedNodes = nodes.map((node, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      return {
        ...node,
        position: {
          x: col * spacing + 100,
          y: row * spacing + 100
        }
      };
    });

    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange]);

  return (
    <div className="w-full h-full relative">
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
        versions={versions}
        onRestoreVersion={onRestoreVersion}
        onRemoveVersion={onRemoveVersion}
        onClearVersions={onClearVersions}
        onLoadTemplate={onLoadTemplate}
      />

      {/* Move WorkflowOverview outside the ReactFlow container */}
      <WorkflowOverview 
        nodes={nodes} 
        edges={edges} 
        currentWorkflow={currentWorkflow}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGridState}
        snapGrid={[20, 20]}
        attributionPosition="bottom-left"
        className="bg-gray-50"
        fitView
        maxZoom={2}
        minZoom={0.1}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          className={snapToGridState ? "opacity-40" : "opacity-20"}
        />
        <Controls 
          position="bottom-left"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
        />
      </ReactFlow>

      <FlowControls
        snapToGrid={snapToGridState}
        onSnapToggle={handleSnapToggle}
        onAlignNodes={handleAlignNodes}
        onAutoLayout={handleAutoLayout}
      />

      <FlowMinimap />
    </div>
  );
}

export function FlowWrapperWithProvider(props: FlowWrapperProps) {
  return (
    <ReactFlowProvider>
      <FlowWrapperComponent {...props} />
    </ReactFlowProvider>
  );
}
