
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { getNodeStyle } from '@/utils/nodeStyle';
import { cn } from '@/lib/utils';

interface NodeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const selectableNodeTypes = [
  { value: "question", label: "Yes/No Question" },
  { value: "choice", label: "Multiple Choice" },
  { value: "workflow", label: "Link to Workflow" },
  { value: "result", label: "Result/End" },
  { value: "decision-tree", label: "Decision Tree" },
  { value: "data-form", label: "Data Collection Form" },
  { value: "equipment-test", label: "Equipment Test" },
  { value: "photo-capture", label: "Photo Capture" },
  { value: "multi-branch", label: "Multi-Branch Logic" },
  { value: "data-collection", label: "Data Collection" },
  { value: "procedure-step", label: "Procedure Step" },
];

export function NodeTypeSelect({ value, onChange }: NodeTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Node Type</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a node type" />
        </SelectTrigger>
        <SelectContent>
          {selectableNodeTypes.map(typeInfo => {
            const style = getNodeStyle(typeInfo.value);
            return (
              <SelectItem key={typeInfo.value} value={typeInfo.value}>
                <div className="flex items-center gap-2">
                  <span className={cn('w-3 h-3 rounded-full', style.dot)}></span>
                  <span>{typeInfo.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
