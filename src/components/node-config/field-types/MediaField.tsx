
import { Field, MediaItem } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { X, FileText, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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
      
      // Create media item
      const mediaItem: MediaItem = {
        type: isPDF ? 'pdf' as const : 'image' as const,
        url: url
      };
      
      console.log("Created media item:", mediaItem);
      return mediaItem;
    });

    // Debug log to check media items being added
    console.log("Current media:", field.media);
    console.log("Adding new media:", newMedia);
    
    // Update the field with new media
    const updatedField = { 
      ...field, 
      media: [...(field.media || []), ...newMedia] 
    };
    
    console.log("Updated field media:", updatedField.media);
    onFieldChange(updatedField);
    
    // Show success toast
    toast({
      title: "Media Added",
      description: `Added ${newMedia.length} new file(s)`,
    });
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleVideoUrl = () => {
    if (videoUrl.trim()) {
      const updatedField = {
        ...field,
        media: [...(field.media || []), { type: 'video', url: videoUrl }]
      };
      console.log("Added video from URL:", videoUrl);
      console.log("Updated field media:", updatedField.media);
      
      onFieldChange(updatedField);
      setVideoUrl('');
      
      toast({
        title: "Video Added",
        description: "Video URL has been added",
      });
    }
  };

  const handlePdfUrl = () => {
    if (pdfUrl.trim()) {
      const mediaItem: MediaItem = { type: 'pdf', url: pdfUrl };
      console.log("Added PDF from URL:", mediaItem);
      
      const updatedField = {
        ...field,
        media: [...(field.media || []), mediaItem]
      };
      
      console.log("Updated field media:", updatedField.media);
      onFieldChange(updatedField);
      setPdfUrl('');
      
      toast({
        title: "PDF Added",
        description: "PDF URL has been added",
      });
    }
  };

  const removeMedia = (index: number) => {
    console.log("Removing media at index:", index);
    const updatedMedia = field.media?.filter((_, i) => i !== index);
    console.log("Updated media after removal:", updatedMedia);
    
    onFieldChange({
      ...field,
      media: updatedMedia
    });
    
    toast({
      title: "Media Removed",
      description: "Media item has been removed",
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
      
      {/* Display current media */}
      <div className="flex flex-wrap gap-2">
        {field.media && field.media.length > 0 ? (
          field.media.map((item, i) => (
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
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">No media added yet</div>
        )}
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
