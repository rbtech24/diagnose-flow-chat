
import React from 'react';
import { EnhancedNodeData, EnhancedNodeType } from '@/types/enhanced-node-config';
import { DecisionTreeConfig } from './DecisionTreeConfig';
import { DataFormConfig } from './DataFormConfig';
import { EquipmentTestConfig } from './EquipmentTestConfig';
import { PhotoCaptureConfig } from './PhotoCaptureConfig';
import { MultiBranchConfig } from './MultiBranchConfig';
import { ProcedureStepConfig } from './ProcedureStepConfig';

interface EnhancedNodeConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function EnhancedNodeConfig({ nodeData, onChange }: EnhancedNodeConfigProps) {
  const nodeType = nodeData.type as EnhancedNodeType;

  switch (nodeType) {
    case 'decision-tree':
      return <DecisionTreeConfig nodeData={nodeData} onChange={onChange} />;
    
    case 'data-form':
    case 'data-collection':
      return <DataFormConfig nodeData={nodeData} onChange={onChange} />;
    
    case 'equipment-test':
      return <EquipmentTestConfig nodeData={nodeData} onChange={onChange} />;
    
    case 'photo-capture':
      return <PhotoCaptureConfig nodeData={nodeData} onChange={onChange} />;
    
    case 'multi-branch':
      return <MultiBranchConfig nodeData={nodeData} onChange={onChange} />;
    
    case 'procedure-step':
      return <ProcedureStepConfig nodeData={nodeData} onChange={onChange} />;
    
    default:
      return null;
  }
}
