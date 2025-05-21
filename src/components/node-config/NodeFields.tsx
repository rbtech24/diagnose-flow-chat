
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Field } from '@/types/node-config';
import { ContentField } from './field-types/ContentField';
import { MediaField } from './field-types/MediaField';
import { OptionsField } from './field-types/OptionsField';
import { FieldWrapper } from './field-types/FieldWrapper';
import { toast } from '@/hooks/use-toast';

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
  const handleFieldChange = (updatedField: Field) => {
    onFieldsChange(fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    ));
  };

  const handleRemoveField = (id: string) => {
    // Prevent removing the last field
    if (fields.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You must keep at least one field",
        variant: "destructive"
      });
      return;
    }
    onRemoveField(id);
    
    // Confirmation toast
    toast({
      title: "Section removed",
      description: "Field has been removed successfully"
    });
  };

  const handleAddField = (type: Field['type']) => {
    onAddField(type);
    
    // Confirmation toast
    toast({
      title: "Section added",
      description: `New ${type} section has been added`
    });
  };

  const renderField = (field: Field, index: number) => {
    const fieldContent = (() => {
      switch (field.type) {
        case 'content':
          return <ContentField field={field} onFieldChange={handleFieldChange} />;
        case 'media':
          return <MediaField field={field} onFieldChange={handleFieldChange} />;
        case 'options':
          return <OptionsField field={field} onFieldChange={handleFieldChange} />;
        default:
          return null;
      }
    })();

    return (
      <FieldWrapper
        key={field.id}
        field={field}
        index={index}
        onRemove={() => handleRemoveField(field.id)}
        onMove={onMoveField}
      >
        {fieldContent}
      </FieldWrapper>
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
            onClick={() => handleAddField('content')}
            className="bg-white hover:bg-gray-50"
          >
            Add Content
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddField('media')}
            className="bg-white hover:bg-gray-50"
          >
            Add Media
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleAddField('options')}
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
