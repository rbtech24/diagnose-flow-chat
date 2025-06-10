
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FileText } from 'lucide-react';
import { DataField, EnhancedNodeData } from '@/types/enhanced-node-config';

interface DataFormConfigProps {
  nodeData: EnhancedNodeData;
  onChange: (data: EnhancedNodeData) => void;
}

export function DataFormConfig({ nodeData, onChange }: DataFormConfigProps) {
  const dataFields = nodeData.dataFields || [];

  const addField = () => {
    const newField: DataField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: `Field ${dataFields.length + 1}`,
      required: false
    };

    onChange({
      ...nodeData,
      dataFields: [...dataFields, newField]
    });
  };

  const updateField = (fieldId: string, updates: Partial<DataField>) => {
    const updatedFields = dataFields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    onChange({
      ...nodeData,
      dataFields: updatedFields
    });
  };

  const removeField = (fieldId: string) => {
    const updatedFields = dataFields.filter(field => field.id !== fieldId);
    onChange({
      ...nodeData,
      dataFields: updatedFields
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Data Collection Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Form Fields</Label>
          <Button onClick={addField} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-3">
          {dataFields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Field {index + 1}</span>
                  <Button
                    onClick={() => removeField(field.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Field Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Enter field label"
                    />
                  </div>

                  <div>
                    <Label>Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(field.id, { type: value as DataField['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="file">File Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.required}
                    onCheckedChange={(checked) => updateField(field.id, { required: !!checked })}
                  />
                  <Label>Required field</Label>
                </div>

                {field.type === 'select' && (
                  <div>
                    <Label>Options (comma-separated)</Label>
                    <Input
                      value={field.options?.join(', ') || ''}
                      onChange={(e) => updateField(field.id, { 
                        options: e.target.value.split(',').map(o => o.trim()).filter(o => o) 
                      })}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {dataFields.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No form fields configured</p>
              <p className="text-sm">Add fields to collect data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
