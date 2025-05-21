
import { Field, MediaItem } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { FileText, FileImage, FileVideo } from 'lucide-react';

interface MediaFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function MediaField({ field, onFieldChange }: MediaFieldProps) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Ensure media array exists
  useEffect(() => {
    if (!field.media) {
      // Initialize media array if it doesn't exist
      const updatedField: Field = {
        ...field,
        media: []
      };
      onFieldChange(updatedField);
      console.log("Initialized media array for field:", field.id);
    }
  }, [field, onFieldChange]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }
    
    console.log(`Processing ${files.length} file(s) for upload`);

    const newMedia = Array.from(files).map(file => {
      // Determine media type based on file extension
      const fileExt = file.name.toLowerCase().split('.').pop() || '';
      const isPDF = fileExt === 'pdf';
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
      
      if (!isPDF && !isImage) {
        console.warn(`Unsupported file type: ${fileExt} for file ${file.name}`);
        toast({
          title: "Unsupported File Type",
          description: `File type ${fileExt} is not supported. Only images and PDFs are allowed.`,
          variant: "destructive"
        });
        return null;
      }
      
      const url = URL.createObjectURL(file);
      const mediaType: "pdf" | "image" = isPDF ? "pdf" : "image";
      
      // Create media item with proper explicit type
      const mediaItem: MediaItem = {
        type: mediaType,
        url: url
      };
      
      console.log(`Created media item: ${mediaType} from file ${file.name}`);
      return mediaItem;
    }).filter(Boolean) as MediaItem[]; // Filter out null items and cast to MediaItem[]

    if (newMedia.length === 0) {
      console.log("No valid media files to add");
      return;
    }

    // Debug log to check media items being added
    console.log("Current media:", field.media);
    console.log(`Adding ${newMedia.length} new media items:`, newMedia);
    
    // Create a properly typed updated field with the new media items
    const updatedField: Field = { 
      ...field, 
      media: [...(field.media || []), ...newMedia] 
    };
    
    console.log("Updated field:", updatedField);
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
    if (!videoUrl.trim()) return;
    
    console.log("Adding video from URL:", videoUrl);
    
    // Create a properly typed media item with correct type
    const mediaItem: MediaItem = { 
      type: "video", 
      url: videoUrl 
    };
    
    const updatedField: Field = {
      ...field,
      media: [...(field.media || []), mediaItem]
    };
    
    console.log("Updated field media:", updatedField.media);
    onFieldChange(updatedField);
    setVideoUrl('');
    
    toast({
      title: "Video Added",
      description: "Video URL has been added",
    });
  };

  const handlePdfUrl = () => {
    if (!pdfUrl.trim()) return;
    
    console.log("Adding PDF from URL:", pdfUrl);
    
    // Create a properly typed media item with correct type
    const mediaItem: MediaItem = { 
      type: "pdf", 
      url: pdfUrl 
    };
    
    const updatedField: Field = {
      ...field,
      media: [...(field.media || []), mediaItem]
    };
    
    console.log("Updated field with PDF:", updatedField);
    onFieldChange(updatedField);
    setPdfUrl('');
    
    toast({
      title: "PDF Added",
      description: "PDF URL has been added",
    });
  };

  const removeMedia = (index: number) => {
    console.log("Removing media at index:", index);
    if (!field.media) {
      console.warn("Cannot remove media, media array is undefined");
      return;
    }
    
    const updatedMedia = field.media.filter((_, i) => i !== index);
    console.log("Media after removal:", updatedMedia);
    
    const updatedField: Field = {
      ...field,
      media: updatedMedia
    };
    
    console.log("Updated field after media removal:", updatedField);
    onFieldChange(updatedField);
    
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

  console.log("Rendering MediaField with media:", field.media);

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
