
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
}

export function PDFViewer({ url, title = 'Wire Diagram' }: PDFViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const containerClass = isExpanded 
    ? "fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center p-4"
    : "relative w-40 h-32 border border-gray-200 rounded overflow-hidden";

  const iframeClass = isExpanded
    ? "w-full h-full max-w-4xl max-h-[90vh]"
    : "w-full h-full";

  return (
    <div className={containerClass}>
      <div className="relative w-full h-full flex flex-col bg-white rounded overflow-hidden">
        {title && (
          <div className="bg-gray-100 p-2 text-sm font-medium flex justify-between items-center">
            <span>{title}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={toggleExpanded}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <iframe 
          src={url} 
          className={iframeClass}
          title={title}
        />
      </div>
    </div>
  );
}
