
import React from 'react';
import { MediaItem } from '@/types/media';

interface MediaContentProps {
  media: MediaItem[];
}

export function MediaContent({ media }: MediaContentProps) {
  if (!media || media.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {media.map((item, index) => (
        <div key={index} className="media-item">
          {item.type === 'image' && (
            <img 
              src={item.url} 
              alt={item.alt || item.title || 'Media content'} 
              className="max-w-full h-auto rounded border"
            />
          )}
          {item.type === 'video' && (
            <video 
              src={item.url} 
              controls 
              className="max-w-full h-auto rounded border"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {item.type === 'pdf' && (
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              📄 {item.title || 'View PDF'}
            </a>
          )}
          {item.title && (
            <p className="text-xs text-gray-600 mt-1">{item.title}</p>
          )}
        </div>
      ))}
    </div>
  );
}
