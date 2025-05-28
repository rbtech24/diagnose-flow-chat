
// Enhanced media types with proper validation
export interface BaseMediaItem {
  type: 'image' | 'video' | 'pdf';
  url: string;
  alt?: string;
  title?: string;
}

export interface ImageMediaItem extends BaseMediaItem {
  type: 'image';
  width?: number;
  height?: number;
  format?: 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
}

export interface VideoMediaItem extends BaseMediaItem {
  type: 'video';
  duration?: number;
  format?: 'mp4' | 'webm' | 'ogg';
  thumbnail?: string;
}

export interface PDFMediaItem extends BaseMediaItem {
  type: 'pdf';
  pageCount?: number;
  size?: number;
}

export type MediaItem = ImageMediaItem | VideoMediaItem | PDFMediaItem;

export interface MediaContentProps {
  media: MediaItem[];
  className?: string;
  showTitles?: boolean;
}
