
import { Field, Option } from '@/types/node-config';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface OptionsFieldProps {
  field: Field;
  onFieldChange: (updatedField: Field) => void;
}

export function OptionsField({ field, onFieldChange }: OptionsFieldProps) {
  const options: Option[] = (field.options || []).map(o => {
    if (typeof o === 'string') {
      const id = uuidv4();
      return { id, label: o, value: o };
    }
    return o as Option;
  });

  const handleOptionChange = (id: string, newLabel: string) => {
    const newOptions = options.map(opt =>
      opt.id === id ? { ...opt, label: newLabel, value: newLabel } : opt
    );
    onFieldChange({ ...field, options: newOptions });
  };

  const addOption = () => {
    const newOption: Option = {
      id: uuidv4(),
      label: '',
      value: ''
    };
    onFieldChange({ ...field, options: [...options, newOption] });
  };

  const removeOption = (id: string) => {
    const newOptions = options.filter(opt => opt.id !== id);
    onFieldChange({ ...field, options: newOptions });
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium text-gray-700">
          Response Options
        </Label>
        <Button variant="outline" size="sm" onClick={addOption} className="h-7 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add Option
        </Button>
      </div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input
              value={option.label}
              onChange={e => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <Button variant="ghost" size="icon" onClick={() => removeOption(option.id)} className="shrink-0">
              <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
            </Button>
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-center text-xs text-gray-400 py-4 border border-dashed rounded-md">
            No options defined. Click "Add Option" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
