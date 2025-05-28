
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

export interface Field {
  id: string;
  type: 'content' | 'media' | 'options';
  content?: string;
  media?: MediaItem[];
  options?: string[];
}

export interface NodeData extends Record<string, unknown> {
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
