
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, FileText, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
}

export function PDFViewer({ url, title = 'Wire Diagram' }: PDFViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Log the PDF URL to help with debugging
  console.log(`Rendering PDF Viewer with URL: ${url}`);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // For blob URLs or direct URLs
    if (url.startsWith('blob:') || url.startsWith('http')) {
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = title.replace(/\s+/g, '-').toLowerCase() + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Invalid PDF URL format:", url);
    }
  };

  const containerClass = isExpanded 
    ? "fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center p-4"
    : "relative w-full h-full border border-gray-200 rounded overflow-hidden cursor-pointer";

  const iframeClass = isExpanded
    ? "w-full h-full max-w-4xl max-h-[90vh]"
    : "w-full h-full";

  const handleClick = () => {
    if (!isExpanded) {
      toggleExpanded();
    }
  };

  return (
    <div className={containerClass} onClick={handleClick}>
      <div className="relative w-full h-full flex flex-col bg-white rounded overflow-hidden">
        <div className="bg-gray-100 p-2 text-sm font-medium flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            <span>{title}</span>
          </div>
          <div className="flex space-x-1">
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => { e.stopPropagation(); handleDownload(e); }}
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <iframe 
          src={url} 
          className={iframeClass}
          title={title}
        />
      </div>
      
      {!isExpanded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors">
          <div className="bg-white/70 rounded-full p-2">
            <Maximize2 className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
}
