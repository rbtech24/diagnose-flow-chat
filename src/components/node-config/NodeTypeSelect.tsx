
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
          {/* Basic Node Types */}
          <SelectItem value="question">Yes/No Question</SelectItem>
          <SelectItem value="choice">Multiple Choice</SelectItem>
          <SelectItem value="workflow">Link to Workflow</SelectItem>
          <SelectItem value="result">Result/End</SelectItem>
          
          {/* Enhanced Node Types */}
          <SelectItem value="decision-tree">Decision Tree</SelectItem>
          <SelectItem value="data-form">Data Collection Form</SelectItem>
          <SelectItem value="equipment-test">Equipment Test</SelectItem>
          <SelectItem value="photo-capture">Photo Capture</SelectItem>
          <SelectItem value="multi-branch">Multi-Branch Logic</SelectItem>
          <SelectItem value="data-collection">Data Collection</SelectItem>
          <SelectItem value="procedure-step">Procedure Step</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
