
import { Field, TechnicalSpecs } from '@/types/node-config';
import { NodeTypeSelect } from './NodeTypeSelect';
import { NodeFields } from './NodeFields';
import { TechnicalSpecsPanel } from './TechnicalSpecs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface NodeConfigFormProps {
  nodeType: string;
  label: string;
  fields: Field[];
  showTechnicalFields: boolean;
  technicalSpecs: TechnicalSpecs;
  onNodeTypeChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onFieldsChange: (fields: Field[]) => void;
  onTechnicalSpecsChange: (specs: TechnicalSpecs) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
  onReset: () => void;
  onApply: () => void;
  hasValidationErrors?: boolean;
}

export function NodeConfigForm({
  nodeType,
  label,
  fields,
  showTechnicalFields,
  technicalSpecs,
  onNodeTypeChange,
  onLabelChange,
  onFieldsChange,
  onTechnicalSpecsChange,
  onAddField,
  onRemoveField,
  onMoveField,
  onReset,
  onApply,
  hasValidationErrors
}: NodeConfigFormProps) {
  return (
    <div className="space-y-6">
      <NodeTypeSelect 
        value={nodeType} 
        onChange={onNodeTypeChange}
      />

      <div className="space-y-2">
        <Label>Label</Label>
        <Input 
          placeholder="Enter node label" 
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        />
      </div>

      <NodeFields 
        fields={fields}
        onFieldsChange={onFieldsChange}
        onAddField={onAddField}
        onRemoveField={onRemoveField}
        onMoveField={onMoveField}
      />

      <TechnicalSpecsPanel 
        nodeType={nodeType}
        value={technicalSpecs}
        onChange={onTechnicalSpecsChange}
      />

      <Card className="p-4 bg-gray-50">
        <Label className="mb-2 block">JSON Preview</Label>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify({
            type: nodeType,
            label,
            content: fields.filter(f => f.type === 'content').map(f => f.content).join('\n\n'),
            media: fields.filter(f => f.type === 'media').flatMap(f => f.media || []),
            options: fields.find(f => f.type === 'options')?.options,
            technicalSpecs: showTechnicalFields ? technicalSpecs : undefined
          }, null, 2)}
        </pre>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onApply}>Apply Changes</Button>
      </div>
    </div>
  );
}
