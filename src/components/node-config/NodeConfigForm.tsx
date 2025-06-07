
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { NodeData, Field, TechnicalSpecs, NodeType } from '@/types/node-config';
import { WarningSelector } from '@/components/diagnosis/WarningIcons';
import { NodeFields } from './NodeFields';

interface NodeConfigFormProps {
  nodeType: NodeType;
  label: string;
  fields: Field[];
  showTechnicalFields: boolean;
  technicalSpecs: TechnicalSpecs;
  onNodeTypeChange: (type: NodeType) => void;
  onLabelChange: (label: string) => void;
  onFieldsChange: (fields: Field[]) => void;
  onTechnicalSpecsChange: (specs: TechnicalSpecs) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
  onReset: () => void;
  onApply: () => void;
  hasValidationErrors: boolean;
}

const nodeTypeOptions: { value: NodeType; label: string; description: string }[] = [
  { value: 'start', label: 'Start', description: 'Starting point of workflow (hidden from users)' },
  { value: 'question', label: 'Question', description: 'Decision point with Yes/No or multiple choice' },
  { value: 'action', label: 'Action', description: 'Instruction step with single "Next" button' },
  { value: 'test', label: 'Test', description: 'Measurement or testing step' },
  { value: 'measurement', label: 'Measurement', description: 'Technical measurement with specifications' },
  { value: 'solution', label: 'Solution', description: 'Final solution or outcome' }
];

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
  
  const handleWarningChange = (type: any, includeLicenseText: boolean = false) => {
    const updatedFields = fields.map(field => {
      if (field.id === 'warning') {
        return {
          ...field,
          content: type ? JSON.stringify({ type, includeLicenseText }) : undefined
        };
      }
      return field;
    });
    
    // Add warning field if it doesn't exist and we're setting a warning
    if (type && !fields.find(f => f.id === 'warning')) {
      updatedFields.push({
        id: 'warning',
        type: 'content',
        content: JSON.stringify({ type, includeLicenseText })
      });
    }
    
    onFieldsChange(updatedFields);
  };

  const getCurrentWarning = () => {
    const warningField = fields.find(f => f.id === 'warning');
    if (warningField?.content) {
      try {
        return JSON.parse(warningField.content);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  const currentWarning = getCurrentWarning();

  return (
    <div className="space-y-6">
      {/* Node Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="nodeType">Step Type</Label>
        <Select value={nodeType} onValueChange={onNodeTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select step type" />
          </SelectTrigger>
          <SelectContent>
            {nodeTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Node Label */}
      <div className="space-y-2">
        <Label htmlFor="label">Step Title</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter step title"
        />
      </div>

      {/* Warning Configuration */}
      {nodeType !== 'start' && (
        <WarningSelector
          value={currentWarning?.type}
          onChange={(type) => handleWarningChange(type, currentWarning?.includeLicenseText || false)}
          includeLicenseText={currentWarning?.includeLicenseText || false}
          onLicenseTextChange={(include) => handleWarningChange(currentWarning?.type, include)}
        />
      )}

      {/* Fields Configuration using NodeFields component */}
      <NodeFields
        fields={fields}
        onFieldsChange={onFieldsChange}
        onAddField={onAddField}
        onRemoveField={onRemoveField}
        onMoveField={onMoveField}
      />

      {/* Technical Specifications */}
      {showTechnicalFields && (
        <div className="space-y-4 border-t pt-4">
          <Label>Technical Specifications</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Value</Label>
              <Input
                type="number"
                value={technicalSpecs.range.min}
                onChange={(e) => onTechnicalSpecsChange({
                  ...technicalSpecs,
                  range: { ...technicalSpecs.range, min: Number(e.target.value) }
                })}
              />
            </div>
            <div>
              <Label>Max Value</Label>
              <Input
                type="number"
                value={technicalSpecs.range.max}
                onChange={(e) => onTechnicalSpecsChange({
                  ...technicalSpecs,
                  range: { ...technicalSpecs.range, max: Number(e.target.value) }
                })}
              />
            </div>
          </div>

          <div>
            <Label>Test Points</Label>
            <Input
              value={technicalSpecs.testPoints || ''}
              onChange={(e) => onTechnicalSpecsChange({
                ...technicalSpecs,
                testPoints: e.target.value
              })}
              placeholder="Enter test points..."
            />
          </div>

          <div>
            <Label>Measurement Points</Label>
            <Input
              value={technicalSpecs.measurementPoints || ''}
              onChange={(e) => onTechnicalSpecsChange({
                ...technicalSpecs,
                measurementPoints: e.target.value
              })}
              placeholder="Enter measurement points..."
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button 
          onClick={onApply} 
          disabled={hasValidationErrors}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}
