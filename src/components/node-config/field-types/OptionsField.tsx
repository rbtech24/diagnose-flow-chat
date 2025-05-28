
import { Field } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface OptionsFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function OptionsField({ field, onFieldChange }: OptionsFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Response Options
      </Label>
      <Textarea 
        placeholder="Enter options (one per line)"
        value={field.options?.join('\n') || ''}
        onChange={(e) => onFieldChange({ 
          ...field, 
          options: e.target.value.split('\n').filter(Boolean) 
        })}
        className="min-h-[100px] resize-none"
      />
    </div>
  );
}
