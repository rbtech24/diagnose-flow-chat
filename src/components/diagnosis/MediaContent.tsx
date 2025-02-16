
import React from 'react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface MediaContentProps {
  media: MediaItem[];
}

export function MediaContent({ media }: MediaContentProps) {
  if (!media?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {media.map((item, index) => (
        <div key={index} className="relative">
          {item.type === 'image' ? (
            <img src={item.url} alt="" className="w-20 h-20 object-cover rounded" />
          ) : (
            <iframe 
              src={item.url} 
              className="w-40 h-24 rounded" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      ))}
    </div>
  );
}
