
import { NodeType, Field, TechnicalSpecs, MediaItem } from './node-config';

// Enhanced node types
export type EnhancedNodeType = 
  | NodeType 
  | 'decision-tree' 
  | 'data-form' 
  | 'equipment-test' 
  | 'photo-capture'
  | 'multi-branch'
  | 'data-collection'
  | 'procedure-step';

// Decision tree branch configuration
export interface DecisionBranch {
  id: string;
  label: string;
  condition: string;
  color?: string;
}

// Data collection field types
export interface DataField {
  id: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'file';
  label: string;
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Equipment test configuration
export interface EquipmentTest {
  equipmentType: string;
  testProcedure: string;
  requiredTools: string[];
  safetyWarnings: string[];
  expectedResults: string;
  toleranceRange?: {
    min: number;
    max: number;
    unit: string;
  };
}

// Photo capture configuration
export interface PhotoCapture {
  required: boolean;
  maxPhotos: number;
  guidelines: string[];
  requiredAngles?: string[];
  annotations?: boolean;
}

// Enhanced node data
export interface EnhancedNodeData extends Record<string, unknown> {
  title?: string;
  content?: string;
  richInfo?: string;
  technicalSpecs?: TechnicalSpecs;
  type?: EnhancedNodeType;
  media?: MediaItem[];
  
  // Decision tree specific
  branches?: DecisionBranch[];
  defaultBranch?: string;
  
  // Data collection specific
  dataFields?: DataField[];
  submitAction?: string;
  
  // Equipment test specific
  equipmentTest?: EquipmentTest;
  
  // Photo capture specific
  photoCapture?: PhotoCapture;
  
  // Multi-branch specific
  maxBranches?: number;
  branchLogic?: 'all' | 'any' | 'custom';
}

export interface EnhancedNodeConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}
