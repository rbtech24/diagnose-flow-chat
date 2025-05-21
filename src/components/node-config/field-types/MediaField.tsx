
import { Field, MediaItem } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { X, FileText } from 'lucide-react';

interface MediaFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function MediaField({ field, onFieldChange }: MediaFieldProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia = Array.from(files).map(file => {
      // Determine media type based on file extension
      const isPDF = file.name.toLowerCase().endsWith('.pdf');
      return {
        type: isPDF ? 'pdf' as const : 'image' as const,
        url: URL.createObjectURL(file)
      };
    });

    onFieldChange({ 
      ...field, 
      media: [...(field.media || []), ...newMedia] 
    });
  };

  const handleVideoUrl = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const input = event.currentTarget;
      const url = input.value;
      if (url) {
        onFieldChange({
          ...field,
          media: [...(field.media || []), { type: 'video', url }]
        });
        input.value = '';
      }
    }
  };

  const handlePdfUrl = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const input = event.currentTarget;
      const url = input.value;
      if (url && url.toLowerCase().endsWith('.pdf')) {
        onFieldChange({
          ...field,
          media: [...(field.media || []), { type: 'pdf', url }]
        });
        input.value = '';
      }
    }
  };

  const removeMedia = (index: number) => {
    onFieldChange({
      ...field,
      media: field.media?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Images, Videos or PDFs
      </Label>
      <div className="flex flex-wrap gap-2">
        {field.media?.map((item, i) => (
          <div key={i} className="relative group">
            {item.type === 'image' ? (
              <img src={item.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
            ) : item.type === 'video' ? (
              <iframe src={item.url} className="w-40 h-24 rounded-lg" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <button
              className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:shadow-md"
              onClick={() => removeMedia(i)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Input 
          type="file" 
          accept="image/*,.pdf" 
          multiple 
          onChange={handleFileUpload}
          className="text-sm"
        />
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter video URL (press Enter)"
            className="text-sm"
            onKeyPress={handleVideoUrl}
          />
          <Input
            type="url"
            placeholder="Enter PDF URL (press Enter)"
            className="text-sm"
            onKeyPress={handlePdfUrl}
          />
        </div>
      </div>
    </div>
  );
}
