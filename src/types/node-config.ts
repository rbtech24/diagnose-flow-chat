export interface TechnicalSpecs {
  range: {
    min: number;
    max: number;
  };
  testPoints?: string;
  value?: number;
  measurementPoints?: string;
  points?: string;
}

export interface MediaItem {
  type: 'image' | 'video' | 'pdf';
  url: string;
  alt?: string;
  title?: string;
}

export interface Option {
  id: string;
  label: string;
  value: string;
  nextNodeId?: string;
}

export interface Field {
  id: string;
  type: 'content' | 'options' | 'media' | 'workflow-link';
  content?: string;
  placeholder?: string;
  options?: Array<string | Option>;
  media?: MediaItem[];
  validation?: {
    required?: boolean;
    pattern?: string;
    message?: string;
  };
}

export type WarningType = 'electric' | 'water' | 'fire';

export interface WarningConfig {
  type: WarningType;
  includeLicenseText: boolean;
}

export type NodeType = 'question' | 'solution' | 'test' | 'measurement' | 'start' | 'action';

export interface NodeData extends Record<string, unknown> {
  title?: string;
  content?: string;
  richInfo?: string;
  technicalSpecs?: TechnicalSpecs;
  yes?: string;
  no?: string;
  options?: Array<string | Option>;
  type?: NodeType;
  media?: MediaItem[];
  warning?: WarningConfig;
  linkToWorkflow?: {
    workflowName: string;
    stepId?: string;
  };
}

export interface NodeConfigProps {
  nodeData: NodeData;
  onChange: (data: NodeData) => void;
}
