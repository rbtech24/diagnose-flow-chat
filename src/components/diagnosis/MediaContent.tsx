
import React, { useState } from 'react';
import { PDFViewer } from './PDFViewer';
import { MediaItem } from '@/types/node-config';
import { FileImage, FileVideo, FileText, Maximize2 } from 'lucide-react';

interface MediaContentProps {
  media: MediaItem[];
}

export function MediaContent({ media }: MediaContentProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (!media?.length) return null;

  const handleImageClick = (url: string) => {
    console.log("Image clicked, expanding:", url);
    setExpandedImage(url);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImage(null);
  };
  
  console.log("Rendering MediaContent with media items:", media);

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {media.map((item, index) => (
          <div key={index} className="relative group">
            {item.type === 'image' ? (
              <div 
                className="relative cursor-pointer bg-gray-50 border border-gray-200 p-1 rounded hover:shadow-md transition-shadow" 
                onClick={() => handleImageClick(item.url)}
              >
                <img 
                  src={item.url} 
                  alt="Reference image" 
                  className="w-20 h-20 object-cover rounded hover:scale-105 transition-transform" 
                />
                <div className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                  <Maximize2 size={10} />
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 text-xs rounded opacity-0 group-hover:opacity-100">
                  Click to enlarge
                </div>
              </div>
            ) : item.type === 'video' ? (
              <div className="relative border border-gray-200 rounded overflow-hidden">
                <iframe 
                  src={item.url} 
                  className="w-40 h-24 rounded border-2 border-blue-100" 
                  title="Embedded video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full">
                  <FileVideo size={10} />
                </div>
              </div>
            ) : item.type === 'pdf' ? (
              <div className="relative w-40 h-24 border border-gray-200 rounded overflow-hidden">
                <PDFViewer 
                  url={item.url} 
                  title={`PDF Document ${index + 1}`} 
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      
      {/* Expanded image modal */}
      {expandedImage && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center"
          onClick={handleCloseExpandedImage}
        >
          <img 
            src={expandedImage} 
            alt="Expanded view" 
            className="max-w-[90%] max-h-[90vh] object-contain"
          />
          <button 
            className="absolute top-4 right-4 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            onClick={handleCloseExpandedImage}
            aria-label="Close expanded view"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
