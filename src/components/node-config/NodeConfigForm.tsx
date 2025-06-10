
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NodeData, Field, TechnicalSpecs } from '@/types/node-config';
import { EnhancedNodeType, EnhancedNodeData } from '@/types/enhanced-node-config';
import { WarningSelector } from '@/components/diagnosis/WarningIcons';
import { NodeFields } from './NodeFields';
import { DecisionTreeConfig } from './enhanced/DecisionTreeConfig';
import { DataFormConfig } from './enhanced/DataFormConfig';
import { EquipmentTestConfig } from './enhanced/EquipmentTestConfig';
import { PhotoCaptureConfig } from './enhanced/PhotoCaptureConfig';

interface NodeConfigFormProps {
  nodeType: EnhancedNodeType;
  label: string;
  fields: Field[];
  showTechnicalFields: boolean;
  technicalSpecs: TechnicalSpecs;
  onNodeTypeChange: (type: EnhancedNodeType) => void;
  onLabelChange: (label: string) => void;
  onFieldsChange: (fields: Field[]) => void;
  onTechnicalSpecsChange: (specs: TechnicalSpecs) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
  onReset: () => void;
  onApply: () => void;
  hasValidationErrors: boolean;
  nodeData?: EnhancedNodeData;
  onNodeDataChange?: (data: EnhancedNodeData) => void;
}

const nodeTypeOptions: { value: EnhancedNodeType; label: string; description: string; category: string }[] = [
  // Basic Types
  { value: 'start', label: 'Start', description: 'Starting point of workflow', category: 'Basic' },
  { value: 'question', label: 'Question', description: 'Yes/No or multiple choice decision', category: 'Basic' },
  { value: 'action', label: 'Action', description: 'Instruction step with single "Next" button', category: 'Basic' },
  { value: 'solution', label: 'Solution', description: 'Final solution or outcome', category: 'Basic' },
  
  // Testing & Measurement
  { value: 'test', label: 'Test', description: 'General testing step', category: 'Testing' },
  { value: 'measurement', label: 'Measurement', description: 'Technical measurement with specifications', category: 'Testing' },
  { value: 'equipment-test', label: 'Equipment Test', description: 'Specialized equipment testing procedure', category: 'Testing' },
  
  // Advanced Decision Making
  { value: 'decision-tree', label: 'Decision Tree', description: 'Multi-branch decision with complex logic', category: 'Advanced' },
  { value: 'multi-branch', label: 'Multi-Branch', description: 'Multiple parallel paths', category: 'Advanced' },
  
  // Data Collection
  { value: 'data-form', label: 'Data Collection', description: 'Form for collecting structured data', category: 'Data' },
  { value: 'photo-capture', label: 'Photo Capture', description: 'Capture photos with guidelines', category: 'Data' },
  
  // Procedures
  { value: 'procedure-step', label: 'Procedure Step', description: 'Detailed procedural instruction', category: 'Procedures' }
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
  hasValidationErrors,
  nodeData,
  onNodeDataChange
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

  const renderEnhancedConfiguration = () => {
    if (!nodeData || !onNodeDataChange) return null;

    switch (nodeType) {
      case 'decision-tree':
        return <DecisionTreeConfig nodeData={nodeData} onChange={onNodeDataChange} />;
      case 'data-form':
      case 'data-collection':
        return <DataFormConfig nodeData={nodeData} onChange={onNodeDataChange} />;
      case 'equipment-test':
        return <EquipmentTestConfig nodeData={nodeData} onChange={onNodeDataChange} />;
      case 'photo-capture':
        return <PhotoCaptureConfig nodeData={nodeData} onChange={onNodeDataChange} />;
      default:
        return null;
    }
  };

  const groupedOptions = nodeTypeOptions.reduce((acc, option) => {
    if (!acc[option.category]) acc[option.category] = [];
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof nodeTypeOptions>);

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
            {Object.entries(groupedOptions).map(([category, options]) => (
              <div key={category}>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                  {category}
                </div>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </div>
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

      {/* Warning Configuration - Hide for start nodes */}
      {nodeType !== 'start' && (
        <WarningSelector
          value={currentWarning?.type}
          onChange={(type) => handleWarningChange(type, currentWarning?.includeLicenseText || false)}
          includeLicenseText={currentWarning?.includeLicenseText || false}
          onLicenseTextChange={(include) => handleWarningChange(currentWarning?.type, include)}
        />
      )}

      {/* Enhanced Node Configuration */}
      {renderEnhancedConfiguration()}

      {/* Standard Fields Configuration */}
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
