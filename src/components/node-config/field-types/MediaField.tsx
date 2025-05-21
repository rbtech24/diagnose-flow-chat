
import { Field, MediaItem } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { X, FileText, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MediaFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function MediaField({ field, onFieldChange }: MediaFieldProps) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia = Array.from(files).map(file => {
      // Determine media type based on file extension
      const isPDF = file.name.toLowerCase().endsWith('.pdf');
      const url = URL.createObjectURL(file);
      
      // Store file metadata to help with identification
      const mediaItem: MediaItem = {
        type: isPDF ? 'pdf' as const : 'image' as const,
        url: url
      };
      
      console.log("Created media item:", mediaItem);
      return mediaItem;
    });

    onFieldChange({ 
      ...field, 
      media: [...(field.media || []), ...newMedia] 
    });
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleVideoUrl = () => {
    if (videoUrl.trim()) {
      onFieldChange({
        ...field,
        media: [...(field.media || []), { type: 'video', url: videoUrl }]
      });
      setVideoUrl('');
    }
  };

  const handlePdfUrl = () => {
    if (pdfUrl.trim()) {
      const mediaItem: MediaItem = { type: 'pdf', url: pdfUrl };
      console.log("Added PDF from URL:", mediaItem);
      
      onFieldChange({
        ...field,
        media: [...(field.media || []), mediaItem]
      });
      setPdfUrl('');
    }
  };

  const removeMedia = (index: number) => {
    onFieldChange({
      ...field,
      media: field.media?.filter((_, i) => i !== index)
    });
  };

  // Helper function to get media type icon
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-6 h-6 text-blue-500" />;
      case 'video':
        return <FileVideo className="w-6 h-6 text-red-500" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Images, Videos or PDFs
      </Label>
      <div className="flex flex-wrap gap-2">
        {field.media?.map((item, i) => (
          <div key={i} className="relative group border border-gray-200 rounded p-1 bg-gray-50">
            {item.type === 'image' ? (
              <img 
                src={item.url} 
                alt="Reference image" 
                className="w-20 h-20 object-cover rounded-lg" 
              />
            ) : item.type === 'video' ? (
              <div className="w-40 h-24 relative">
                <iframe 
                  src={item.url} 
                  className="w-full h-full rounded-lg" 
                  title="Video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="absolute top-0 left-0 bg-black/30 text-white px-1 text-xs rounded">
                  Video
                </div>
              </div>
            ) : (
              <div className="w-40 h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2">
                <FileText className="w-10 h-10 text-green-600" />
                <div className="text-xs text-center mt-1 text-gray-600 truncate w-full">
                  PDF Document
                </div>
              </div>
            )}
            <button
              className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
              onClick={() => removeMedia(i)}
              aria-label="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Upload files</Label>
          <Input 
            type="file" 
            accept="image/*,.pdf" 
            multiple 
            onChange={handleFileUpload}
            className="text-sm"
          />
          <div className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, PDF</div>
        </div>
        
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Video URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              className="text-sm"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button 
              type="button" 
              size="sm"
              onClick={handleVideoUrl}
              disabled={!videoUrl.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">PDF URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter PDF URL"
              className="text-sm"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />
            <Button 
              type="button" 
              size="sm"
              onClick={handlePdfUrl}
              disabled={!pdfUrl.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
