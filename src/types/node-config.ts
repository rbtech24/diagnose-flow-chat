
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

export interface NodeData {
  title?: string;
  content?: string;
  richInfo?: string;
  technicalSpecs?: TechnicalSpecs;
  yes?: string;
  no?: string;
  options?: string[];
  type?: string;
  media?: MediaItem[];
}

export interface NodeConfigProps {
  nodeData: NodeData;
  onChange: (data: NodeData) => void;
}
