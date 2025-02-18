
import { Field, MediaItem } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { X } from 'lucide-react';

interface MediaFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function MediaField({ field, onFieldChange }: MediaFieldProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia = Array.from(files).map(file => ({
      type: 'image' as const,
      url: URL.createObjectURL(file)
    }));

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

  const removeMedia = (index: number) => {
    onFieldChange({
      ...field,
      media: field.media?.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Images or Videos
      </Label>
      <div className="flex flex-wrap gap-2">
        {field.media?.map((item, i) => (
          <div key={i} className="relative group">
            {item.type === 'image' ? (
              <img src={item.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <iframe src={item.url} className="w-40 h-24 rounded-lg" />
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
      <div className="flex gap-2">
        <Input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleFileUpload}
          className="text-sm"
        />
        <Input
          type="url"
          placeholder="Enter video URL"
          className="text-sm"
          onKeyPress={handleVideoUrl}
        />
      </div>
    </div>
  );
}
