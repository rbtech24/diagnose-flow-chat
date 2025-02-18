
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface NodeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function NodeTypeSelect({ value, onChange }: NodeTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Node Type</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="question">Yes/No Question</SelectItem>
          <SelectItem value="choice">Multiple Choice</SelectItem>
          <SelectItem value="workflow">Link to Workflow</SelectItem>
          <SelectItem value="result">Result/End</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
