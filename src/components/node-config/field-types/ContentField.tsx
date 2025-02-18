
import { Field } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface ContentFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function ContentField({ field, onFieldChange }: ContentFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Question or Instruction
      </Label>
      <Textarea 
        placeholder="Enter the question or instruction text for this step..."
        value={field.content || ''}
        onChange={(e) => onFieldChange({ ...field, content: e.target.value })}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
}
