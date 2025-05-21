
import React from 'react';
import { PDFViewer } from './PDFViewer';
import { MediaItem } from '@/types/node-config';

interface MediaContentProps {
  media: MediaItem[];
}

export function MediaContent({ media }: MediaContentProps) {
  if (!media?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {media.map((item, index) => (
        <div key={index} className="relative group">
          {item.type === 'image' ? (
            <div className="relative">
              <img 
                src={item.url} 
                alt="Reference image" 
                className="w-20 h-20 object-cover rounded hover:scale-105 transition-transform cursor-pointer" 
              />
            </div>
          ) : item.type === 'video' ? (
            <div className="relative">
              <iframe 
                src={item.url} 
                className="w-40 h-24 rounded border-2 border-blue-100" 
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <PDFViewer url={item.url} title="Wire Diagram" />
          )}
        </div>
      ))}
    </div>
  );
}
