
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
          <SelectItem value="symptom">Symptom</SelectItem>
          <SelectItem value="question">Question</SelectItem>
          <SelectItem value="instruction">Instruction</SelectItem>
          <SelectItem value="voltage-check">Voltage Check</SelectItem>
          <SelectItem value="resistance-check">Resistance Check</SelectItem>
          <SelectItem value="inspection">Visual Inspection</SelectItem>
          <SelectItem value="result">Result</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
