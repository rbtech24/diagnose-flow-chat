
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { NodeTypeSelect } from './node-config/NodeTypeSelect';
import { NodeFields } from './node-config/NodeFields';
import { TechnicalSpecsPanel } from './node-config/TechnicalSpecs';
import { Field, TechnicalSpecs } from '@/types/node-config';

export default function NodeConfigPanel({ node, onUpdate }) {
  const [nodeType, setNodeType] = useState('question');
  const [label, setLabel] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showTechnicalFields, setShowTechnicalFields] = useState(false);
  const [technicalSpecs, setTechnicalSpecs] = useState<TechnicalSpecs>({
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

    const contentFields = fields.filter(f => f.type === 'content');
    const combinedContent = contentFields.map(f => f.content).filter(Boolean).join('\n\n');

    const mediaFields = fields.filter(f => f.type === 'media');
    const combinedMedia = mediaFields.reduce((acc, field) => {
      return acc.concat(field.media || []);
    }, [] as any[]);

    const optionsFields = fields.filter(f => f.type === 'options');
    const combinedOptions = optionsFields.reduce((acc, field) => {
      return acc.concat(field.options || []);
    }, [] as string[]);

    const updatedData = {
      type: nodeType,
      label,
      content: combinedContent,
      media: combinedMedia,
      options: combinedOptions,
      technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
    };

    onUpdate(node.id, updatedData);
    toast({
      title: "Changes Applied",
      description: "Node configuration has been updated."
    });
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
        <NodeTypeSelect 
          value={nodeType} 
          onChange={(value) => {
            setNodeType(value);
            setShowTechnicalFields(['voltage-check', 'resistance-check', 'inspection'].includes(value));
          }}
        />

        <div className="space-y-2">
          <Label>Label</Label>
          <Input 
            placeholder="Enter node label" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <NodeFields 
          fields={fields}
          onFieldsChange={setFields}
          onAddField={addField}
          onRemoveField={removeField}
          onMoveField={moveField}
        />

        <TechnicalSpecsPanel 
          nodeType={nodeType}
          value={technicalSpecs}
          onChange={setTechnicalSpecs}
        />

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
