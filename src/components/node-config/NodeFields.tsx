
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Field } from '@/types/node-config';
import { GripVertical, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface NodeFieldsProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
}

export function NodeFields({ fields, onFieldsChange, onAddField, onRemoveField, onMoveField }: NodeFieldsProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia = Array.from(files).map(file => ({
      type: 'image' as const,
      url: URL.createObjectURL(file)
    }));

    const mediaField = fields.find(f => f.type === 'media');
    if (mediaField) {
      onFieldsChange(fields.map(field => 
        field.id === mediaField.id 
          ? { ...field, media: [...(field.media || []), ...newMedia] }
          : field
      ));
    } else {
      onFieldsChange([...fields, { id: `media-${fields.length + 1}`, type: 'media', media: newMedia }]);
    }
  };

  const getFieldTitle = (type: Field['type']) => {
    switch (type) {
      case 'content':
        return 'Question or Instruction';
      case 'media':
        return 'Images or Videos';
      case 'options':
        return 'Response Options';
      default:
        return 'Field';
    }
  };

  const getFieldPlaceholder = (type: Field['type']) => {
    switch (type) {
      case 'content':
        return 'Enter the question or instruction text for this step...';
      case 'options':
        return 'Enter options (one per line)\nExample:\nYes\nNo\nNot applicable';
      default:
        return '';
    }
  };

  const renderField = (field: Field, index: number) => {
    return (
      <div key={field.id} className="flex gap-2 items-start group border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
        <button 
          className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={(e) => {
            e.preventDefault();
            const target = e.currentTarget.parentElement;
            if (!target) return;
            
            const initialY = e.pageY;
            const initialIndex = index;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const currentY = moveEvent.pageY;
              const diff = currentY - initialY;
              const newIndex = initialIndex + Math.round(diff / 50);
              if (newIndex >= 0 && newIndex < fields.length) {
                onMoveField(initialIndex, newIndex);
              }
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        
        <div className="flex-1 space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {getFieldTitle(field.type)}
          </Label>

          {field.type === 'content' && (
            <Textarea 
              placeholder={getFieldPlaceholder(field.type)}
              value={field.content || ''}
              onChange={(e) => onFieldsChange(fields.map(f => 
                f.id === field.id ? { ...f, content: e.target.value } : f
              ))}
              className="min-h-[100px] resize-none"
            />
          )}
          
          {field.type === 'media' && (
            <div className="space-y-2">
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
                      onClick={() => onFieldsChange(fields.map(f => 
                        f.id === field.id 
                          ? { ...f, media: f.media?.filter((_, index) => index !== i) } 
                          : f
                      ))}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      const url = input.value;
                      if (url) {
                        onFieldsChange(fields.map(f => 
                          f.id === field.id 
                            ? { ...f, media: [...(f.media || []), { type: 'video', url }] }
                            : f
                        ));
                        input.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {field.type === 'options' && (
            <Textarea 
              placeholder={getFieldPlaceholder(field.type)}
              value={field.options?.join('\n') || ''}
              onChange={(e) => onFieldsChange(fields.map(f => 
                f.id === field.id ? { ...f, options: e.target.value.split('\n').filter(Boolean) } : f
              ))}
              className="min-h-[100px] resize-none"
            />
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemoveField(field.id)}
          className="hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Fields</Label>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddField('content')}
            className="bg-white hover:bg-gray-50"
          >
            Add Content
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddField('media')}
            className="bg-white hover:bg-gray-50"
          >
            Add Media
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddField('options')}
            className="bg-white hover:bg-gray-50"
          >
            Add Options
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        {fields.map((field, index) => renderField(field, index))}
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fields added yet. Use the buttons above to add fields.
          </div>
        )}
      </div>
    </div>
  );
}
