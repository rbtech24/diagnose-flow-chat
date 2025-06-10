
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Field } from '@/types/node-config';
import { ContentField } from './field-types/ContentField';
import { OptionsField } from './field-types/OptionsField';
import { MediaField } from './field-types/MediaField';
import { WorkflowLinkField } from './WorkflowLinkField';

interface NodeFieldsProps {
  fields: Field[];
  onFieldsChange: (fields: Field[]) => void;
  onAddField: (type: Field['type']) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (dragIndex: number, hoverIndex: number) => void;
}

export function NodeFields({
  fields,
  onFieldsChange,
  onAddField,
  onRemoveField,
  onMoveField
}: NodeFieldsProps) {
  
  const fieldTypes = [
    { value: 'content', label: 'Content/Instructions' },
    { value: 'options', label: 'Options/Choices' },
    { value: 'media', label: 'Media (Images/Videos)' },
    { value: 'workflow-link', label: 'Link to Workflow' }
  ];

  const handleFieldChange = (fieldId: string, newData: any) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...newData } : field
    );
    onFieldsChange(updatedFields);
  };

  const handleWorkflowLinkChange = (fieldId: string, linkData: any) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId 
        ? { ...field, content: linkData ? JSON.stringify(linkData) : undefined }
        : field
    );
    onFieldsChange(updatedFields);
  };

  const renderField = (field: Field, index: number) => {
    const fieldProps = {
      key: field.id,
      field,
      onChange: (data: any) => handleFieldChange(field.id, data),
      onRemove: () => onRemoveField(field.id),
      canMoveUp: index > 0,
      canMoveDown: index < fields.length - 1,
      onMoveUp: () => onMoveField(index, index - 1),
      onMoveDown: () => onMoveField(index, index + 1),
    };

    switch (field.type) {
      case 'content':
        return <ContentField {...fieldProps} />;
      case 'options':
        return <OptionsField {...fieldProps} />;
      case 'media':
        return <MediaField {...fieldProps} />;
      case 'workflow-link':
        return (
          <div key={field.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Workflow Link</span>
              <div className="flex items-center gap-1">
                {fieldProps.canMoveUp && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fieldProps.onMoveUp}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                )}
                {fieldProps.canMoveDown && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fieldProps.onMoveDown}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fieldProps.onRemove}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <WorkflowLinkField
              value={field.content ? JSON.parse(field.content) : undefined}
              onChange={(linkData) => handleWorkflowLinkChange(field.id, linkData)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Step Content</h3>
        <div className="flex flex-wrap gap-1">
          {fieldTypes.map((type) => (
            <Button
              key={type.value}
              variant="outline"
              size="sm"
              onClick={() => onAddField(type.value as Field['type'])}
              className="h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => renderField(field, index))}
        
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-sm">No content added yet</p>
            <p className="text-xs">Use the buttons above to add content, options, media, or workflow links</p>
          </div>
        )}
      </div>
    </div>
  );
}
