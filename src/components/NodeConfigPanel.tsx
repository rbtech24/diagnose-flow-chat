
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from '@/hooks/use-toast';
import { GripVertical, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

type Field = {
  id: string;
  type: 'content' | 'media' | 'options';
  content?: string;
  media?: MediaItem[];
  options?: string[];
};

export default function NodeConfigPanel({ node, onUpdate }) {
  const [nodeType, setNodeType] = useState('question');
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showTechnicalFields, setShowTechnicalFields] = useState(false);
  const [technicalSpecs, setTechnicalSpecs] = useState({
    range: { min: 0, max: 0 },
    testPoints: '',
    value: 0,
    measurementPoints: '',
    points: ''
  });

  useEffect(() => {
    if (node) {
      setNodeType(node.data.type || 'question');
      setLabel(node.data.label || '');
      
      // Initialize fields from node data
      const initialFields: Field[] = [];
      
      if (node.data.content) {
        initialFields.push({
          id: 'content-1',
          type: 'content',
          content: node.data.content
        });
      }
      
      if (node.data.media) {
        initialFields.push({
          id: 'media-1',
          type: 'media',
          media: node.data.media
        });
      }
      
      if (node.data.options) {
        initialFields.push({
          id: 'options-1',
          type: 'options',
          options: node.data.options
        });
      }
      
      setFields(initialFields.length > 0 ? initialFields : [{ id: 'content-1', type: 'content', content: '' }]);
      setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(node.data.type));
      setTechnicalSpecs(node.data.technicalSpecs || {
        range: { min: 0, max: 0 },
        testPoints: '',
        value: 0,
        measurementPoints: '',
        points: ''
      });
    }
  }, [node]);

  const handleApplyChanges = () => {
    if (!node) return;

    const updatedData = {
      type: nodeType,
      label,
      content: fields.find(f => f.type === 'content')?.content || '',
      media: fields.find(f => f.type === 'media')?.media || [],
      options: fields.find(f => f.type === 'options')?.options || [],
      technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
    };

    onUpdate(node.id, updatedData);
    toast({
      title: "Changes Applied",
      description: "Node configuration has been updated."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMedia: MediaItem[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newMedia.push({ type: 'image', url });
    });

    const mediaField = fields.find(f => f.type === 'media');
    if (mediaField) {
      setFields(fields.map(field => 
        field.id === mediaField.id 
          ? { ...field, media: [...(field.media || []), ...newMedia] }
          : field
      ));
    } else {
      setFields([...fields, { id: `media-${fields.length + 1}`, type: 'media', media: newMedia }]);
    }
  };

  const addField = (type: Field['type']) => {
    setFields([...fields, { id: `${type}-${fields.length + 1}`, type }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields];
    const dragField = newFields[dragIndex];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    setFields(newFields);
  };

  const renderField = (field: Field, index: number) => {
    return (
      <div key={field.id} className="flex gap-2 items-start group border p-4 rounded-lg bg-white">
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
                moveField(initialIndex, newIndex);
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
          <GripVertical className="w-4 h-4" />
        </button>
        
        <div className="flex-1 space-y-2">
          {field.type === 'content' && (
            <Textarea 
              placeholder="Enter content"
              value={field.content || ''}
              onChange={(e) => setFields(fields.map(f => 
                f.id === field.id ? { ...f, content: e.target.value } : f
              ))}
            />
          )}
          
          {field.type === 'media' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {field.media?.map((item, i) => (
                  <div key={i} className="relative group">
                    {item.type === 'image' ? (
                      <img src={item.url} alt="" className="w-20 h-20 object-cover rounded" />
                    ) : (
                      <iframe src={item.url} className="w-40 h-24 rounded" />
                    )}
                    <button
                      className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      onClick={() => setFields(fields.map(f => 
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
                />
                <Input
                  type="url"
                  placeholder="Enter video URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      const url = input.value;
                      if (url) {
                        setFields(fields.map(f => 
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
              placeholder="Enter options (one per line)"
              value={field.options?.join('\n') || ''}
              onChange={(e) => setFields(fields.map(f => 
                f.id === field.id ? { ...f, options: e.target.value.split('\n').filter(Boolean) } : f
              ))}
            />
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => removeField(field.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a node to edit its properties
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Configuration</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Node Type</Label>
          <Select 
            value={nodeType} 
            onValueChange={(value) => {
              setNodeType(value);
              setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symptom">Symptom</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="instruction">Instruction</SelectItem>
              <SelectItem value="voltage-check">Voltage Check</SelectItem>
              <SelectItem value="resistance-check">Resistance Check</SelectItem>
              <SelectItem value="inspection">Visual Inspection</SelectItem>
              <SelectItem value="result">Result</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Label</Label>
          <Input 
            placeholder="Enter node label" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Fields</Label>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addField('content')}
              >
                Add Content
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addField('media')}
              >
                Add Media
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addField('options')}
              >
                Add Options
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {fields.map((field, index) => renderField(field, index))}
          </div>
        </div>

        {showTechnicalFields && (
          <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-sm">Technical Specifications</h3>
            
            {nodeType === 'voltage-check' && (
              <>
                <div className="space-y-2">
                  <Label>Expected Voltage Range</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      className="w-24"
                      value={technicalSpecs.range?.min || 0}
                      onChange={(e) => setTechnicalSpecs(prev => ({
                        ...prev,
                        range: { ...prev.range, min: Number(e.target.value) }
                      }))}
                    />
                    <span>to</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      className="w-24"
                      value={technicalSpecs.range?.max || 0}
                      onChange={(e) => setTechnicalSpecs(prev => ({
                        ...prev,
                        range: { ...prev.range, max: Number(e.target.value) }
                      }))}
                    />
                    <span>V</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test Points</Label>
                  <Input 
                    placeholder="e.g., 'Between terminal 1 and ground'"
                    value={technicalSpecs.testPoints || ''}
                    onChange={(e) => setTechnicalSpecs(prev => ({
                      ...prev,
                      testPoints: e.target.value
                    }))}
                  />
                </div>
              </>
            )}
            
            {nodeType === 'resistance-check' && (
              <>
                <div className="space-y-2">
                  <Label>Expected Resistance</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      type="number" 
                      placeholder="Value" 
                      className="w-32"
                      value={technicalSpecs.value || 0}
                      onChange={(e) => setTechnicalSpecs(prev => ({
                        ...prev,
                        value: Number(e.target.value)
                      }))}
                    />
                    <span>Ω</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Measurement Points</Label>
                  <Input 
                    placeholder="e.g., 'Across heating element'"
                    value={technicalSpecs.measurementPoints || ''}
                    onChange={(e) => setTechnicalSpecs(prev => ({
                      ...prev,
                      measurementPoints: e.target.value
                    }))}
                  />
                </div>
              </>
            )}
            
            {nodeType === 'inspection' && (
              <div className="space-y-2">
                <Label>Inspection Points</Label>
                <Textarea 
                  placeholder="List specific points to inspect&#10;1. Check for visible damage&#10;2. Verify connection integrity"
                  value={technicalSpecs.points || ''}
                  onChange={(e) => setTechnicalSpecs(prev => ({
                    ...prev,
                    points: e.target.value
                  }))}
                />
              </div>
            )}
          </div>
        )}

        <Card className="p-4 bg-gray-50">
          <Label className="mb-2 block">JSON Preview</Label>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({
              type: nodeType,
              label,
              content: fields.find(f => f.type === 'content')?.content,
              media: fields.find(f => f.type === 'media')?.media,
              options: fields.find(f => f.type === 'options')?.options,
              technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
            }, null, 2)}
          </pre>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setNodeType(node.data.type);
            setLabel(node.data.label);
            const initialFields = [];
            if (node.data.content) {
              initialFields.push({ id: 'content-1', type: 'content', content: node.data.content });
            }
            if (node.data.media) {
              initialFields.push({ id: 'media-1', type: 'media', media: node.data.media });
            }
            if (node.data.options) {
              initialFields.push({ id: 'options-1', type: 'options', options: node.data.options });
            }
            setFields(initialFields);
          }}>
            Reset
          </Button>
          <Button onClick={handleApplyChanges}>Apply Changes</Button>
        </div>
      </div>
    </div>
  );
}
