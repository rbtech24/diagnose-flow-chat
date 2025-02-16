
export type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

export type Field = {
  id: string;
  type: 'content' | 'media' | 'options';
  content?: string;
  media?: MediaItem[];
  options?: string[];
};

export type TechnicalSpecs = {
  range: { min: number; max: number };
  testPoints: string;
  value: number;
  measurementPoints: string;
  points: string;
};

export type NodeData = {
  type: string;
  label: string;
  content?: string;
  media?: MediaItem[];
  options?: string[];
  technicalSpecs?: TechnicalSpecs;
};
